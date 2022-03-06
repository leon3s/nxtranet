import React from 'react';

import * as Style from './style';

type TextProps = {
  className?: string;
  children: string | string[];
}

const Text = React.memo<TextProps>(function Text(props) {
  return (
    <Style.Text
      className={props.className}
    >
      {props.children}
    </Style.Text>
  );
});

export default Text;
