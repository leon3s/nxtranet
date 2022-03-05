import type {Theme} from './default';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
  }
}
