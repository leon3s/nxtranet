/*
 *  ___   _   _ |  _|_ __  _     
 *  |__) [_] |_ |<  |_ |  [_] |\|
 * 
 * File: \style\themes\utils.ts
 * Project: org
 * Created Date: Tuesday, 26th October 2021 7:11:11 am
 * Author: leone
 * -----
 * Last Modified: Tue Oct 26 2021
 * Modified By: leone
 * -----
 * Copyright (c) 2021 docktron
 * -----
 */

import type {Theme} from './default';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
  }
}
