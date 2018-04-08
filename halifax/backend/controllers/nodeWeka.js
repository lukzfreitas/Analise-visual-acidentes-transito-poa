var weka = require('./node_modules/node-weka/lib/weka-lib.js');
var arff = require('node-arff');

arff.load('data/some-file.arff', function(err, data) {
  if (err) {
    return console.error(err);
  }
  // find out some info about the field "age"
  var oldest = data.max('age');
  var youngest = data.min('age');
  var mostcommon = data.mode('age');
  var average = data.mean('age');

  // normalize the data (scale all numeric values so that they are between 0 and 1)
  data.normalize();

  // randomly sort the data
  data.randomize();
});

