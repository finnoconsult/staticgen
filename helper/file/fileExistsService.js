var fileExists = require('file-exists');

// Idea from https://stackoverflow.com/questions/33355528/filtering-an-array-with-a-function-that-returns-a-promise

module.exports = (folder, files, callbackFunc) => {
  var isExists = file => fileExists(`${folder}/${file}`).then(exists => exists);

  var filterAsync = (array, filter) =>
    Promise.all(array.map(entry => filter(entry)))
    .then(bits => array.filter(entry => bits.shift()));

  filterAsync(files || [], isExists)
  .then(entries => {
    callbackFunc(entries);
  })
  .catch(e => console.error(e));

}
