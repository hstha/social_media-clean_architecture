/**
 * get the key's value of an obj
 * @param {T} obj object like value
 * @param {K} key key of that object
 * @returns value present in key of the object
 */
export const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];

/**
 * sets the value of the given object in its key
 * @param {T} obj object like value
 * @param {K} key key of that object
 * @param {T[K]} value value that need to be stored in obj[key]
 * @returns given object
 */
export const setKeyValue = <T, K extends keyof T>(obj: T, key: K, value: T[K]): T => {
  obj[key] = value;
  return obj;
};

/**
 * strigfy and parse the given data
 * @param {T} value data whose clone needs to be processed
 * @returns deep clone of the given object
 */
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));