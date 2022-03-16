import React from 'react';

import * as Style from './TestBage.s';

export type TestBageProps = {
  type: 'passing' | 'failling';
}

const TestBage = (props: TestBageProps) => (
  <Style.TestBageContainer
  >
    <Style.TestBageText>
      test
    </Style.TestBageText>
    <Style.TestBageStatusIcon
      type={props.type}
    >
      <Style.TestBageText>
        {props.type}
      </Style.TestBageText>
    </Style.TestBageStatusIcon>
  </Style.TestBageContainer>
);

export default TestBage;
