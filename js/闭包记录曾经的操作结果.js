const memoize = (fn, hasher) => {
    // hasher 是计算 key 值的方法函数。
    const cache = new Map()
    return key => {
        const address = '' + (hasher ? hasher.apply(this, key) : key)
        const cachedResult = cache.get(address)
        if (cachedResult !== undefined) return cachedResult
        const result = fn(value)
        cache.set(address, result)
        return result
    }
}
