<template>
  <div class="main-page">
    <div class="main-page__search">
      <input-el v-model="searchValue" @input="debounceSearch"> <search-icon /> </input-el>
      <div class="main-page__filter">
        <checkbox-el v-model="isFavorite" label="Only favorite" @change="search" />
        <radio-el v-model="filter" value="verb" label="verb" @change="search" />
        <radio-el v-model="filter" value="adjective" label="adjective" @change="search" />
        <radio-el v-model="filter" value="noun" label="noun" @change="search" />
        <radio-el v-model="filter" value="" label="none" @change="search" />
      </div>
    </div>
    <div v-if="!loading" class="main-page__results">
      <words-result
        :isDraggable="isDraggable"
        :currentWords="currentWords"
        :words="words"
        :isFavorite="isFavorite"
        :favoriteWords="favoriteWords"
        @drag="favoriteWords = $event"
        @toggleFavorite="(words = $event.words), (favoriteWords = $event.favoriteWords)"
        @search="search"
      />
    </div>
    <div v-else class="main-page__result-loader"><loader-el /></div>
  </div>
</template>

<script>
import SearchIcon from '../components/icons/search-icon.vue';
import InputEl from '../components/UI/input-el.vue';
import LoaderEl from '../components/UI/loader-el.vue';
import ApiWords from '../http/words/words';
import debounce from '../utils/debounce';
import search from '../utils/search';
import WordsResult from '../components/words/words-result.vue';
import RadioEl from '../components/UI/radio-el.vue';
import CheckboxEl from '../components/UI/checkbox-el.vue';

export default {
  name: 'MainPage',
  components: {
    InputEl,
    SearchIcon,
    LoaderEl,
    WordsResult,
    RadioEl,
    CheckboxEl,
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
    isDraggable() {
      return (!this.searchValue && !this.filter) || this.isFavorite;
    },
  },
  methods: {
    search() {
      if (this.isFavorite) {
        this.searchingFavoriteWords = search(this.favoriteWords, this.searchValue, this.filter);
      } else if (this.searchValue || this.filter) {
        this.getData();
      } else {
        this.words = [];
      }
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

  &__results {
    margin-left: 18px;
    overflow: hidden;
    width: 100%;

    @media screen and (max-width: 920px) {
      margin-left: 0;
      margin-top: 18px;
    }
  }

  &__search {
    padding: 12px;
    height: fit-content;
    background: $grey-color;
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
  }
  &__result-loader {
    text-align: center;
    width: 100%;
    margin-top: 170px;
  }
}
</style>
