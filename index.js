module.exports = {
  cacher,
  getMinAge
};

function cacher() {
  return async (ctx, next) => {
    await next();
    
    const minAge = getMinAge(ctx.body);
    if (!isNil(minAge) && minAge > 0) {
      ctx.set('Cache-Control', `public, max-age=${minAge}`);
    }
  };
}

function getMinAge({ extensions }) {
  const hintsUndefined = !extensions || !extensions.cacheControl || !extensions.cacheControl.hints;
  const hints = hintsUndefined ? [] : extensions.cacheControl.hints;
  
  let resolving = hints.length;
  let minAge = null;
  
  while (resolving--) {
    const { maxAge } = hints[resolving];
    if (minAge === null || maxAge < minAge) {
      minAge = maxAge;
    }
  }
  
  return minAge;
}

function isNil(value) {
  return value === undefined || value === null;
}