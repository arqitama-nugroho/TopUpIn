const _origFetch = window.fetch;

const keyPromise = fetch('http://localhost:3000/api/key')
  .then(r => r.json())
  .then(d => d.key || '');

window.fetch = function (url, opts) {
  return keyPromise.then(apiKey => {
    opts = opts || {};
    opts.headers = Object.assign({ 'x-api-key': apiKey }, opts.headers);
    return _origFetch(url, opts);
  });
};
