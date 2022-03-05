import React from 'react';

import * as Style from './style';

type TextProps = {
  children: string | string[];
}

const Text = React.memo<TextProps>(function Text(props) {
  return (
    <Style.Text>
      {props.children}
    </Style.Text>
  );
});

export default Text;
