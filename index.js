const _ = require('underscore');

module.exports = cacher;

function cacher() {
  const getMinAge = _.compose(
    _.min,
    _.partial(_.map, _, _.property('maxAge')),
    _.property(['extensions', 'cacheControl', 'hints'])
  );
  
  return async (ctx, next) => {
    await next();
    
    const minAge = getMinAge(ctx.body);
    if (!isNil(minAge) && minAge > 0) {
      ctx.set('Cache-Control', `public, max-age=${minAge}`);
    }
  };
}

function isNil(value) {
  return _.isUndefined(value) || _.isNull();
}