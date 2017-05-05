const { expect, spy } = require('chai');
const balancer = require('proxy-supervisor').balancer;
const source = require('../../lib/source');

const Source = source.Source;

describe('Source', () => {
  it('should expose singleton instance', () => {
    expect(typeof source).to.be.eql('function');

    const instance = source();
    instance.stop();

    expect(instance).to.be.instanceof(Source);

    const instance2 = source();
    expect(instance2).to.be.equal(instance);
  });

  it('should be started after creation', (done) => {
    const crawler = new Source({ interval: 0 });
    crawler.load = () => Promise.resolve([]);

    const load = spy.on(crawler, 'load');

    setTimeout(() => {
      crawler.stop();

      expect(load).to.be.spy;
      expect(load).to.have.been.called();
      done();
    }, 30);
  });

  it('should check periodically even if empty', (done) => {
    const crawler = new Source({ interval: 0 });
    crawler.load = () => Promise.resolve([]);

    const load = spy.on(crawler, 'load');

    setTimeout(() => {
      crawler.stop();

      expect(load).to.be.spy;
      expect(load).to.have.been.called.gt(2);
      done();
    }, 30);
  });

  describe('.load()', () => {
    it('should return list of proxies', () => {
      const crawler = new Source();
      crawler.stop();

      return crawler.load().then((proxies) => {
        expect(proxies).to.be.not.empty;
        expect(proxies.length).to.be.equal(300);
      });
    });

    it('should work with multiple listeners', () => {
      const crawler = new Source();
      crawler.stop();

      const listener1 = balancer()
        .subscribe(crawler);
      const listener2 = balancer()
        .subscribe(crawler);
      const listener3 = balancer()
        .subscribe(crawler);

      const add1 = spy.on(listener1, 'add');
      const add2 = spy.on(listener2, 'add');
      const add3 = spy.on(listener3, 'add');

      return crawler.load().then((arr) => {
        expect(arr.length).to.be.eql(300);

        expect(add1).to.have.been.called();
        expect(add2).to.have.been.called();
        expect(add3).to.have.been.called();

        expect(listener1.proxies.size).to.be.eql(300);
        expect(listener2.proxies.size).to.be.eql(300);
        expect(listener3.proxies.size).to.be.eql(300);
      });
    });
  });
});
