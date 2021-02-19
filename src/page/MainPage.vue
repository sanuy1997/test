<template>
  <div class="main-page">
    <div class="main-page__search">
      <input-el v-model="searchValue" @input="debounceSearch"> <search-icon /> </input-el>
      <div class="main-page__filter">
        <div>
          <input v-model="isFavorite" type="checkbox" id="favorite" @change="search" />
          <label for="favorite">only favorite</label>
        </div>
        <div>
          <input v-model="filter" type="radio" id="adjective" value="adjective" @change="search" />
          <label for="adjective">adjective</label>
        </div>
        <div>
          <input v-model="filter" type="radio" id="verb" value="verb" @change="search" />
          <label for="verb">verb</label>
        </div>
        <div>
          <input v-model="filter" type="radio" id="noun" value="noun" @change="search" />
          <label for="noun">noun</label>
        </div>
        <div>
          <input v-model="filter" type="radio" id="none" value="" @change="search" />
          <label for="none">none</label>
        </div>
      </div>
    </div>
    <div v-if="!loading" class="main-page__results">
      <div
        v-for="(word, index) in currentWords"
        :key="index"
        :draggable="(!searchValue && !filter) || isFavorite"
        class="main-page__result"
        @drop.stop="onDrop($event, word.word)"
        @dragover.prevent
        @dragenter.prevent
        @dragstart.stop="startDrag($event, word.word)"
      >
        <div class="main-page__result-info" @click="word.showDetail = !word.showDetail">
          <drag-icon class="main-page__drag-icon" v-if="isFavorite" />
          <h3>{{ word.word }}</h3>
          <span>{{ word.partOfSpeech }}</span>
          <span>{{ word.definition }}</span>
          <div @click.stop="toggleFavorite(word)">
            <star-icon :fill="word.favorite ? '#2980b9' : 'white'" />
          </div>
        </div>
        <div v-if="word.showDetail" class="main-page__result-details">
          <p>{{ word.pronunciation }}</p>
          <p v-for="(result, index) in word.allResults" :key="index">
            {{ index + 1 }}) {{ result.partOfSpeech }} - {{ result.definition }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="main-page__result-loader"><loader-el /></div>
  </div>
</template>

<script>
import StarIcon from '../components/icons/star-icon.vue';
import SearchIcon from '../components/icons/search-icon.vue';
import DragIcon from '../components/icons/drag-icon.vue';
import InputEl from '../components/UI/input-el.vue';
import LoaderEl from '../components/UI/loader-el.vue';
import ApiWords from '../http/words/words';
import debounce from '../utils/debounce';
import search from '../utils/search';

export default {
  name: 'MainPage',
  components: {
    StarIcon,
    DragIcon,
    InputEl,
    SearchIcon,
    LoaderEl,
  },
  data() {
    return {
      words: [],
      searchingFavoriteWords: [],
      filter: '',
      searchValue: '',
      loading: false,
      isFavorite: false,
      favoriteWords: JSON.parse(localStorage.getItem('favoriteWords')) || [],
    };
  },
  computed: {
    currentWords() {
      if (this.isFavorite) {
        return this.searchValue || this.filter ? this.searchingFavoriteWords : this.favoriteWords;
      }
      return this.searchValue || this.filter ? this.words : this.favoriteWords;
    },
  },
  methods: {
    startDrag(e, word) {
      e.dataTransfer.setData('fromWord', word);
    },
    onDrop(e, toWord) {
      const fromWord = e.dataTransfer.getData('fromWord');
      const fromIndex = this.favoriteWords.findIndex((item) => item.word === fromWord);
      const index = this.favoriteWords.findIndex((item) => item.word === toWord);
      const word = this.favoriteWords[fromIndex];
      this.favoriteWords.splice(fromIndex, 1);
      this.favoriteWords.splice(index, 0, word);
      localStorage.setItem('favoriteWords', JSON.stringify(this.favoriteWords));
      this.search();
    },
    search() {
      if (this.isFavorite) {
        this.searchingFavoriteWords = search(this.favoriteWords, this.searchValue, this.filter);
      } else if (this.searchValue || this.filter) {
        this.getData();
      } else {
        this.words = [];
      }
    },
    toggleFavorite(word) {
      if (word.favorite) {
        const index = this.words.findIndex((item) => item.word === word.word);
        this.favoriteWords.splice(index, 1);
        localStorage.setItem('favoriteWords', JSON.stringify(this.favoriteWords));
        if (this.words.length) {
          this.words[index].favorite = false;
        }
      } else {
        const localWord = { ...word };
        localWord.showDetail = false;
        localWord.favorite = true;
        this.favoriteWords.push(localWord);
        localStorage.setItem('favoriteWords', JSON.stringify(this.favoriteWords));
        const index = this.words.findIndex((item) => item.word === word.word);
        this.words[index].favorite = true;
      }
      if (this.isFavorite) {
        this.search();
      }
      this.favoriteWords = JSON.parse(localStorage.getItem('favoriteWords'));
    },
    async getData() {
      this.loading = true;
      const {
        data: {
          results: { data },
        },
      } = await ApiWords.getWords(this.searchValue, this.filter);
      const allWords = await Promise.all(data.map((item) => ApiWords.getWord(item)));
      const allFavoriteWords = allWords.map((item) => ({
        ...item,
        favorite: this.favoriteWords.some((favItem) => favItem.word === item.data.word),
      }));
      this.words = allFavoriteWords.map((item) => ({
        word: item.data.word,
        definition: this.filter
          ? item.data.results.find((result) => result.partOfSpeech === this.filter)?.definition
          : item.data.results[0]?.definition,
        partOfSpeech: this.filter
          ? item.data.results.find((result) => result.partOfSpeech === this.filter)?.partOfSpeech
          : item.data.results[0]?.partOfSpeech,
        favorite: item.favorite,
        pronunciation: item.data.pronunciation?.all,
        allResults: item.data.results,
        showDetail: false,
      }));
      this.loading = false;
    },
  },
  created() {
    this.debounceSearch = debounce(this.search, 1000);
  },
};
</script>

<style lang="scss">
.main-page {
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 920px) {
    flex-direction: column;
  }

  &__search {
    padding: 12px;
    height: fit-content;
    background: #e8e8e8;
    min-width: 400px;
    text-align: center;
    border-radius: 6px;
  }
  &__filter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  &__filter > div {
    display: flex;
    margin-top: 10px;
    cursor: pointer;
  }
  &__filter > div > label {
    text-transform: capitalize;
    margin-left: 6px;
  }
  &__results {
    margin-left: 18px;
    overflow: hidden;
    width: 100%;

    @media screen and (max-width: 920px) {
      margin-left: 0;
      margin-top: 18px;
    }
  }
  &__result {
    margin-bottom: 20px;
    background: white;
    padding: 7px 0 7px 20px;
    border-radius: 10px;
  }
  &__result-info {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  &__result-info :nth-child(3) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  &__result-info > * {
    margin-right: 20px;
  }
  &__result-info :last-child {
    margin-left: auto;
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
  &__result-info h3 {
    white-space: nowrap;
    text-transform: capitalize;
  }
  &__drag-icon {
    min-width: 24px;
  }
  &__result-loader {
    text-align: center;
    width: 100%;
    margin-top: 170px;
  }
}
</style>
