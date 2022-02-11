/*
 * Filename: c:\Users\leone\Documents\code\docktron\org\components\Shared\ReForm\Inputs\Icon.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Wednesday, October 27th 2021, 6:35:54 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import React from 'react';

import * as Style from './style';

import type InputProps from './props';

interface         InputIconState {
  backgroundSrc?: string | null;
}

export default
class InputIcon
  extends React.PureComponent<InputProps, InputIconState> {
  ref = React.createRef<HTMLInputElement>();

  state = {
    backgroundSrc: this.props.value,
  };

  onClick = () => {
    this.ref.current?.click();
  }

  onSetFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    const {onChange} = this;
    reader.onload = function(e) {
      if (!e.target) return;
      onChange(e.target.result);
    }
    reader.readAsDataURL(file);
  }

  onChange = (data:any) => {
    this.setState({
      backgroundSrc: data,
    }, () => this.props.onChange(data));
  }

  render() {
    const {backgroundSrc} = this.state;
    return (
      <Style.InputIconContainer>
        <Style.HiddenFileInput
          ref={this.ref}
          accept=".png,.jpeg"
          onChange={this.onSetFile}
        />
        <Style.InputIconImg
          onClick={this.onClick}
          backgroundSrc={backgroundSrc}
        />
      </Style.InputIconContainer>
    )
  }
}
