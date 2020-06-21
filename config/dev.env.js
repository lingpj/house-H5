'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  shop_front_api: '"/bs"',
  pay_bs:'"/pay_bs"',
  on: '"/on"',
})
