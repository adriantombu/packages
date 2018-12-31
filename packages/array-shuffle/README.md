Yet Another Array Shuffle Package
=================================

[![npm version](https://badge.fury.io/js/%40adriantombu%2Farray-shuffle.svg)](https://badge.fury.io/js/%40adriantombu%2Farray-shuffle) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A package that... well... shuffles the values of an array. Yup. That's all. All in 206 bytes of code.

### How to use it

* Install the library first with `yarn add @adriantombu/array-shuffle`
* And then import it in your script

```
const arrayShuffle = require('@adriantombu/array-shuffle')

const myRandomArray = [ "I", "believe", "I", "can", "fly"]
const myShuffledArray = arrayShuffle(myRandomArray)

[ "fly", "I", "can", "believe", "I"]
```

### How to contribute

* Clone the repository `git clone git@github.com:adriantombu/array-shuffle.git`
* Install the packages with `yarn install`
* Modify the `src/index.js` file
* When everything's done, you can send a PR \o/
