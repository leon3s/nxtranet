import React from 'react';

import * as Style from './style';

type TitleProps = {
  children: string | string[];
}

const Title = React.memo<TitleProps>(function Title(props) {
  return (
    <Style.Title>
      {props.children}
    </Style.Title>
  );
});

export default Title;
