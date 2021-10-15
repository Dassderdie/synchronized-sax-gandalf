/**
 * @param obj
 * @returns a deterministic string representation of all objects, that are deepEqual to each other
 */
export function objectToKey(obj: Object | null) {
    // See https://stackoverflow.com/a/53593328
    const allKeys: string[] = [];
    // Get all keys (worse performance than Object.keys, but in contrast works recursively + is reliable)
    JSON.stringify(obj, (key, value) => {
        allKeys.push(key);
        return value;
    });
    allKeys.sort((a, b) => a.localeCompare(b));
    return JSON.stringify(obj, allKeys);
}
