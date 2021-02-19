const search = (words, query, filter) => {
  const regExp = RegExp(query, 'gim');
  if (query.length > 0) {
    return words.filter((word) => regExp.test([word.word].join(' ')));
  }
  if (filter) {
    return words.filter((word) => word.partOfSpeech === filter);
  }
  return words;
};

export default search;
