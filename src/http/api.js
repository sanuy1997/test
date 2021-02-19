import axios from 'axios';

export default class Api {
  constructor(headers = {}) {
    this.instance = axios.create({
      baseURL: 'https://wordsapiv1.p.rapidapi.com',
      headers,
    });
  }
}
