const R = require('ramda');

module.exports = cacher;

function cacher() {
  const getMinAge = R.pipe(
    R.path(['extensions', 'cacheControl', 'hints']),
    R.map(R.prop('maxAge')),
    R.reduce(R.min, Infinity)
  );
  
  return async (ctx, next) => {
    await next();
    
    const minAge = getMinAge(ctx.body);
    if (!R.isNil(minAge) && minAge > 0) {
      ctx.set('Cache-Control', `public, max-age=${minAge}`);
    }
  };
}