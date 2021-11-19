import React from 'react';

import {PuffLoader} from 'react-spinners';

import {ButtonDefault} from '~/styles/buttons';
import * as Style from './style';

type ButtonLoadingProps = {
  title: string;
  className?: string;
  onClick: () => void | Promise<void>
};

type ButtonLoadingState = {
  isLoading: boolean;
};

export default class ButtonLoading
  extends React.PureComponent<ButtonLoadingProps, ButtonLoadingState> {
    state = {
      isLoading: false,
    }

    onClick = () => {
      const onClick = this.props.onClick();
      if (onClick instanceof Promise) {
        this.setState({
          isLoading: true,
        });
        onClick.then(() => {
          if (this) {
            this.setState({
              isLoading: false,
            });
          }
        });
      }
    }

    render() {
      const {
        isLoading
      } = this.state;
      const {
        title,
        className
      } = this.props;
      return (
        <ButtonDefault
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
          `${title}`
          }
        </ButtonDefault>
      );
    }
  }
