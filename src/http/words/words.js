import Api from '../api';

class WordsApi extends Api {
  constructor() {
    const headers = {
      'X-Rapidapi-Key': process.env.VUE_APP_API_KEY,
    };
    super(headers);
  }

  getWords(word, partOfSpeech) {
    return this.instance.get('/words/', {
      params: {
        letterPattern: word,
        limit: '10',
        hasDetails: 'typeOf,hasCategories',
        frequencymin: '8',
        partOfSpeech,
      },
    });
  }

  getWord(word) {
    return this.instance.get(`/words/${word}`);
  }
}

export default new WordsApi();
