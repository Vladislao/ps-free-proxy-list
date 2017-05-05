# ps-free-proxy-list

Source of proxies for [proxy-supervisor](https://github.com/vladislao/proxy-supervisor/)

## Installation

```bash
$ npm install ps-free-proxy-list
```

## Usage

For complete guide please visit [proxy-supervisor](https://github.com/vladislao/proxy-supervisor/#how-to-play).

## Design

  This source is responsible for collecting new proxies from [free-proxy-list.net](http://free-proxy-list.net/) and adding them to listeners.

#### new Source([options])
  * **options** *\<Object\>* Set of configurable options to set on the monitor. Can have the following fields:
  	* **interval** *\<Integer\>* Specifies how much time should pass after last check is completed. Defaults to 5 minutes.

  Source is started automatically on creation, and will trigger for the first time after specified **interval** is passed.

#### source.start()

  Starts source. Use only in case you have stopped source manually. Source is started automatically on creation and can work with empty list of listeners.

#### source.stop()

  Stops source. It will clear current timer, but already running load will be not affected.

#### source.load()
  * Returns: *\<Promise\>* A promise, which resolves into an array of received proxies. Those proxies are already added to listeners.

  Loads new proxies. This method will request html page with proxies, retrieve addresses and add then to listeners.

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

  [MIT](LICENSE)

