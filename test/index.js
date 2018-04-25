const assert = require('assert');
const sinon = require('sinon');
const _ = require('underscore');

const { cacher, getMinAge } = require('../');

describe('Cache Control', () => {

  const generateHints = _.compose(
    _.partial(_.map, _, maxAge => ({ maxAge })),
    _.shuffle,
    _.range
  );
  
  const body = {
    extensions: {
      cacheControl: {
        hints: generateHints(50)
      }
    }
  };
  
  describe('cacher', () => {
    it('should not set the cache control header', () => {
      const context = {
        body,
        set: sinon.spy()
      };
      
      cacher()(context, sinon.spy());
      assert(context.set, '\'Cache-Control\' header was set.');
    });
  });

  describe('getMinAge', () => {
    it('should return lowest age', () => {
      const minAge = getMinAge(body);
      assert.equal(minAge, 0, '\'minAge\' was not 0.');
    });
  });

});