/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \utils\contextQuery.ts
 * Project: dashboard
 * Created Date: Sunday, 31st October 2021 9:42:34 pm
 * Author: leone
 * -----
 * Last Modified: Sun Oct 31 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import type { GetServerSidePropsContext } from 'next';

export function extract(key:string, ctx: GetServerSidePropsContext): string {
  let val = ctx.query[key];
  if (val instanceof Array) {
    val = val[0];
  }
  if (!val) {
    const error = new Error(`Query ${key} not is empty`);
    throw error;
  }
  return val;
}
