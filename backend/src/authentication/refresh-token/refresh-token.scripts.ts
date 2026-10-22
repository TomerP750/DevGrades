

export const REPLACE_REFRESH_TOKEN_SCRIPT = `
    local storedUserId = redis.call('GET', KEYS[1])

    if not storedUserId or storedUserId ~= ARGV[1] then
        return 0
    end

    redis.call('DEL', KEYS[1])
    redis.call('ZREM', KEYS[3], ARGV[2])
    redis.call('ZREMRANGEBYSCORE', KEYS[3], 0, ARGV[6])

    redis.call('SET', KEYS[2], ARGV[1], 'EX', ARGV[4])
    redis.call('ZADD', KEYS[3], ARGV[5], ARGV[3])
    redis.call('EXPIRE', KEYS[3], ARGV[4])

    return 1
`;