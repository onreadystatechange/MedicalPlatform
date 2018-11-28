/**
 * Created by yjy on 2017/11/30.
 */
'use strict';

const EventEmitter = require('events');

class CountEmitter extends EventEmitter{}

const SingleCountEmitter = new CountEmitter();
export default SingleCountEmitter;
