/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \jest.config.js
 * Project: @nxtranet/nxtsock
 * Created Date: Monday, 15th November 2021 12:01:18 pm
 * Author: leone
 * -----
 * Last Modified: Wed Feb 02 2022
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["./tests"],
};