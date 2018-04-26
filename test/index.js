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
  
  const ranges = [
    [0, 50],
    [50, 100]
  ];
  
  ranges.forEach(([start, end]) => {
    describe(`range ${start} - ${end}`, () => {
      const body = {
        extensions: {
          cacheControl: {
            hints: generateHints(start, end)
          }
        }
      };
      
      describe('cacher', () => {
        it(`should ${start ? 'set': 'not set'} the cache control header`, async () => {
          const context = {
            body,
            set: sinon.spy()
          };
          
          await cacher()(context, sinon.spy());
          assert(start ? context.set.called : !context.set.called, `'Cache-Control' header ${context.set.called ? 'was' : 'was not'} set.`);
        });
      });
    
      describe('getMinAge', () => {
        it('should return lowest age', () => {
          const minAge = getMinAge(body);
          assert.equal(minAge, start, `'minAge' was not ${start}.`);
        });
      });
    });
  });

});