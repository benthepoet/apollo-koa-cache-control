const assert = require('assert');
const _ = require('underscore');

const { cacher, getMinAge } = require('../');

describe('Cache Control', () => {

  const generateHints = _.compose(
    _.partial(_.map, _, maxAge => ({ maxAge })),
    _.shuffle,
    _.range
  );

  describe('getMinAge', () => {
    const body = {
      extensions: {
        cacheControl: {
          hints: generateHints(50)
        }
      }
    };
    
    it('should return lowest age', () => {
      const minAge = getMinAge(body);
      assert.equal(minAge, 0, '\'minAge\' was not 0.');
    });
  });

});