import {defineAction} from '~/utils/redux';
import {createAction} from '~/utils/redux';

import type {State} from '../reducers';

const COUNTER_INC = defineAction('COUNTER_INC');

export const setCounter = createAction<[
  number
], State, number>(
  COUNTER_INC,
  (counter) => counter,
);

const DEFINES = {
  COUNTER_INC,
};

export default DEFINES;
