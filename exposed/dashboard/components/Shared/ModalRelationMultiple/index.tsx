import React from 'react';
import api from '~/api';
import ItemRounded from '../ItemRounded';
import Modal from '../Modal';
import * as Style from './style';

type ModalRelationMultipleProps = {
  isVisible: boolean;
  onClickCancel: () => void;
  onClickItem: (item: any) => void;
  value: any[];
  title: string;
  icon: React.ReactElement | React.ReactChildren;
  options: {
    path: string;
    displayKey: string;
    returnKey: string;
    key: string;
  }
}

type ModalRelationMultipleState = {
  data: any[];
}

export class ModalRelationMultiple extends
  React.PureComponent<ModalRelationMultipleProps, ModalRelationMultipleState> {

  state = {
    data: [],
  }

  componentDidMount() {
    this.prepare();
  }

  componentDidUpdate(prevProps: ModalRelationMultipleProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      this.prepare();
    }
  }

  prepare = async () => {
    const {options, value} = this.props;
    const {data} = await api.get<any[]>(options.path);
    this.setState({
      data: data.filter((d) => {
        const exists = value.find((v) => {
          if (v[options.returnKey] === d[options.returnKey]) {
            return true;
          }
          return false;
        })
        return !exists;
      }),
    })
  }

  renderTitle = () => (
    <Style.ModalTitleContainer>
      {this.props.icon}
      <Style.ModalTitle>
        {this.props.title}
      </Style.ModalTitle>
    </Style.ModalTitleContainer>
  )

  generateOnClickItem = (item: any) => {
    return () => {
      this.props.onClickItem(item);
    }
  }

  render() {
    const {
      options,
      isVisible,
      onClickCancel,
    } = this.props;
    const {data} = this.state;
    return (
      <Modal
        isVisible={isVisible}
        title={this.renderTitle()}
      >
        <Style.Container>
          <Style.Line
            className='scroll-bar'
          >
            {data.map((d) => (
              <ItemRounded
                key={d[options.key]}
                onClick={this.generateOnClickItem(d)}
              >
                {d[options.displayKey]}
              </ItemRounded>
            ))}
          </Style.Line>
          <Style.Cancel
            onClick={onClickCancel}
          >
            Cancel
          </Style.Cancel>
        </Style.Container>
      </Modal>
    )
  }
}
