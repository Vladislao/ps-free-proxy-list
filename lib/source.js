const request = require('request');
const promisify = require('js-promisify');
const SourceCore = require('proxy-supervisor').SourceCore;
const cheerio = require('cheerio');

const protocol = str => (str === 'yes' ? 'https://' : 'http://');

const Source = class Source extends SourceCore {
  constructor({ interval = 5 * 60 * 1000 } = {}) {
    super();

    this.interval = interval;
    this._timeout = null;

    this.start();
  }

  /*
    Use only in case you need to stop monitoring manually.

    Monitor is started automatically on creation and can work
    with empty list of listeners.
  */
  start() {
    if (this._timeout) return;
    if (this.interval < 0) this.interval = 5 * 60 * 1000;

    const self = this;
    function endless() {
      self.load().then(() => {
        if (self._timeout) self._timeout = setTimeout(endless, self.interval);
      });
    }
    this._timeout = setTimeout(endless, this.interval);
  }

  stop() {
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = null;
  }

  /*
    Loads new proxies. Returns promise, which resolves into an array of proxies.
  */
  load() {
    const options = { uri: 'http://free-proxy-list.net/', method: 'GET' };
    return promisify(request, [options])
      .then((res) => {
        const $ = cheerio.load(res.body);
        const addresses = $('#proxylisttable > tbody > tr')
          .map((i, el) => protocol($(el.children[6]).text()) + $(el.children[0]).text() + ':' + $(el.children[1]).text())
          .get();

        if (addresses.length === 0) return [];
        // drop them from listeners
        this.listeners.forEach((listener) => {
          listener.add(addresses);
        });

        return addresses;
      });
  }

};

/**
 * Export default singleton.
 *
 * @api public
 */
let instance = null;
module.exports = () => {
  if (instance === null) instance = new Source();
  return instance;
};

/**
 * Expose constructor.
 */
module.exports.Source = Source;
