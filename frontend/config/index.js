'use strict';

const path = require('path');

module.exports = {
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  },
  get isServer() {
    return process.env.SERVER === 'true';
  }
};