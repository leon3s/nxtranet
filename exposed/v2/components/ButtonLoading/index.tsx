import React from 'react';
import {PuffLoader} from 'react-spinners';

import Button from '~/components/Button';

import * as Style from './style';

type ButtonLoadingProps = {
  className?: string;
  colorType?: string;
  isResolving?: boolean;
  children?: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

type ButtonLoadingState = {
  isLoading: boolean;
};

export default class ButtonLoading
  extends React.PureComponent<ButtonLoadingProps, ButtonLoadingState> {
  static defaultProps = {
    colorType: '',
  };

  state = {
    isLoading: false,
  };

  onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const onClick = this.props.onClick(e);
    if (onClick instanceof Promise) {
      this.setState({
        isLoading: true,
      });
      if (this.props.isResolving) {
        onClick.then(() => {
          this.setState({
            isLoading: false,
          });
        });
      }
      onClick.catch(() => {
        if (this) {
          this.setState({
            isLoading: false,
          });
        }
      });
    }
  };

  render() {
    const {
      isLoading,
    } = this.state;
    const {
      children,
      className,
    } = this.props;
    return (
      <Button
        className={className}
        disabled={isLoading}
        onClick={this.onClick}
      >
        {isLoading ?
          <Style.SpinnerContainer>
            <PuffLoader
              size={4}
            />
          </Style.SpinnerContainer>
          :
          `${children}`
        }
      </Button>
    );
  };
}
