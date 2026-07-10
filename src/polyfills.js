// Minimal polyfills for older iOS Safari (< 15.4)

if (!Object.hasOwn) {
  Object.defineProperty(Object, 'hasOwn', {
    value: (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop),
    configurable: true,
    writable: true,
  })
}

if (typeof globalThis.structuredClone !== 'function') {
  // JSON-based fallback: enough for the plain string/number data this app stores
  globalThis.structuredClone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)))
}
