<template>
  <div class="words-result">
    <div
      v-for="(word, index) in currentWords"
      :key="index"
      :draggable="isDraggable"
      class="words-result__result"
      @drop.stop="onDrop($event, word.word)"
      @dragover.prevent
      @dragenter.prevent
      @dragstart.stop="startDrag($event, word.word)"
    >
      <div class="words-result__result-info" @click="word.showDetail = !word.showDetail">
        <drag-icon v-if="isDraggable" class="words-result__drag-icon" />
        <h3>{{ word.word }}</h3>
        <span>{{ word.partOfSpeech }}</span>
        <span>{{ word.definition }}</span>
        <div @click.stop="toggleFavorite(word)">
          <star-icon :fill="word.favorite ? '#2980b9' : 'white'" />
        </div>
      </div>
      <div v-if="word.showDetail" class="words-result__result-details">
        <p>{{ word.pronunciation }}</p>
        <p v-for="(result, index) in word.allResults" :key="index">
          {{ index + 1 }}) {{ result.partOfSpeech }} - {{ result.definition }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import DragIcon from '../icons/drag-icon.vue';
import StarIcon from '../icons/star-icon.vue';

export default {
  name: 'WordsResult',
  components: {
    DragIcon,
    StarIcon,
  },
  props: {
    currentWords: {
      type: Array,
      default: () => [],
    },
    isDraggable: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    words: {
      type: Array,
      default: () => [],
    },
    favoriteWords: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    startDrag(e, word) {
      e.dataTransfer.setData('fromWord', word);
    },
    onDrop(e, toWord) {
      const favoriteWords = [...this.favoriteWords];
      const fromWord = e.dataTransfer.getData('fromWord');
      const fromIndex = favoriteWords.findIndex((item) => item.word === fromWord);
      const index = favoriteWords.findIndex((item) => item.word === toWord);
      const word = favoriteWords[fromIndex];
      favoriteWords.splice(fromIndex, 1);
      favoriteWords.splice(index, 0, word);
      localStorage.setItem('favoriteWords', JSON.stringify(favoriteWords));
      this.$emit('drag', favoriteWords);
      this.$emit('search');
    },
    toggleFavorite(word) {
      const favoriteWords = [...this.favoriteWords];
      const words = [...this.words];
      if (word.favorite) {
        const wordIndex = words.findIndex((item) => item.word === word.word);
        const index = favoriteWords.findIndex((item) => item.word === word.word);
        favoriteWords.splice(index, 1);
        localStorage.setItem('favoriteWords', JSON.stringify(favoriteWords));
        if (words.length) {
          words[wordIndex].favorite = false;
        }
      } else {
        const localWord = { ...word };
        localWord.showDetail = false;
        localWord.favorite = true;
        favoriteWords.push(localWord);
        localStorage.setItem('favoriteWords', JSON.stringify(favoriteWords));
        const index = words.findIndex((item) => item.word === word.word);
        words[index].favorite = true;
      }
      this.$emit('toggleFavorite', { words, favoriteWords });
      if (this.isFavorite) {
        this.$emit('search');
      }
    },
  },
};
</script>

<style lang="scss">
.words-result {
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
  &__result-info :nth-last-child(2) {
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
}
</style>
