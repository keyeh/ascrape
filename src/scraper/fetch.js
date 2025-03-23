import { FileSystemCache, NodeFetchCache } from 'node-fetch-cache';

const fetch = NodeFetchCache.create({
    cache: new FileSystemCache({
        // Only cache responses with a 2xx status code
        shouldCacheResponse: (response) => response.ok,
        // Specify where to keep the cache. If undefined, '.cache' is used by default.
        // If this directory does not exist, it will be created.
        // cacheDirectory: '/my/cache/directory/path',
        // Time to live. How long (in ms) responses remain cached before being
        // automatically ejected. If undefined, responses are never
        // automatically ejected from the cache.
        ttl: undefined,
    }),
});
export default fetch;
