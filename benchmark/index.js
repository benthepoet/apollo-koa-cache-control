const Benchmark = require('benchmark');
const _ = require('underscore');

const { getMinAge } = require('../');
const suite = new Benchmark.Suite();

const body = {
  extensions: {
    cacheControl: {
      hints: _.range(50).map(maxAge => ({ maxAge }))
    }
  }
};

suite
  .add('getMinAge', function () {
    const minAge = getMinAge(body);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run({ async: true });