const rateLimit = (req, res, next) => {
  const { ip } = req;

  const rateLimitCache = {};
  const maxRequests = 8;
  const timeWindow = 60 * 1000;

  if (!rateLimitCache[ip]) {
    rateLimitCache[ip] = { requests: 1, lastRequestTime: Date.now() };
  } else {
    const { requests, lastRequestTime } = rateLimitCache[ip];
    const elapsedTime = Date.now() - lastRequestTime;

    if (elapsedTime > timeWindow) {
      rateLimitCache[ip] = { requests: 1, lastRequestTime: Date.now() };
    } else {
      if (requests >= maxRequests) {
        return res
          .status(429)
          .json({ error: "Too many requests. Try again later." });
      }

      rateLimitCache[ip].requests++;
    }
  }

  next();
};


export { rateLimit };
