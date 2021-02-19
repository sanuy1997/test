import Api from '../api';

class WordsApi extends Api {
  constructor() {
    const headers = {
      'X-Rapidapi-Key': '32e0a521a4mshc96a453f7c72d10p1af1f4jsnbf5686c67247',
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
