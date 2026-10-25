

export const ROTATE_REFRESH_TOKEN_SCRIPT = `
    local now = tonumber(ARGV[4])
    local requestedTokenTtl = tonumber(ARGV[3])
    local currentTokenHash = ARGV[1]
    local replacementTokenHash = ARGV[2]
    local familyPrefix = ARGV[5]
    local tokenPrefix = ARGV[6]
    local userPrefix = ARGV[7]

    local activeTokenJson = redis.call('GET', KEYS[1])

    if activeTokenJson then
        local storedToken = cjson.decode(activeTokenJson)
        local familyKey = familyPrefix .. storedToken.familyId
        local familyJson = redis.call('GET', familyKey)

        if not familyJson then
            redis.call('DEL', KEYS[1])
            return {0}
        end

        local familyTtlMilliseconds = redis.call('PTTL', familyKey)

        if familyTtlMilliseconds <= 0 then
            redis.call('DEL', KEYS[1])
            redis.call('DEL', familyKey)
            return {0}
        end

        local familyTtlSeconds = math.ceil(familyTtlMilliseconds / 1000)
        local tokenTtlSeconds = math.min(requestedTokenTtl, familyTtlSeconds)
        local userKey = userPrefix .. storedToken.userId

        redis.call('DEL', KEYS[1])
        redis.call('SET', KEYS[3], storedToken.familyId, 'EX', familyTtlSeconds)
        redis.call('ZREM', userKey, currentTokenHash)
        redis.call('ZREMRANGEBYSCORE', userKey, 0, now)

        redis.call(
            'SET',
            KEYS[2],
            cjson.encode({
                userId = storedToken.userId,
                familyId = storedToken.familyId,
            }),
            'EX',
            tokenTtlSeconds
        )

        local tokenFamily = cjson.decode(familyJson)
        tokenFamily.currentTokenHash = replacementTokenHash
        redis.call('SET', familyKey, cjson.encode(tokenFamily), 'KEEPTTL')

        redis.call('ZADD', userKey, now + tokenTtlSeconds * 1000, replacementTokenHash)
        redis.call('EXPIRE', userKey, tokenTtlSeconds)

        return {1, storedToken.userId}
    end

    local familyId = redis.call('GET', KEYS[3])

    if not familyId then
        return {0}
    end

    local familyKey = familyPrefix .. familyId
    local familyJson = redis.call('GET', familyKey)

    if familyJson then
        local tokenFamily = cjson.decode(familyJson)

        if tokenFamily.currentTokenHash then
            redis.call('DEL', tokenPrefix .. tokenFamily.currentTokenHash)
            redis.call(
                'ZREM',
                userPrefix .. tokenFamily.userId,
                tokenFamily.currentTokenHash
            )
        end

        redis.call('DEL', familyKey)
    end

    return {2}
`;