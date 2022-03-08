import React from 'react';
import api from '~/api';
import Description from './Description';
import ItemRounded from './ItemRounded';
import Modal from './Modal';
import * as Style from './ModalRelationLink.s';
import ModalTitle from './ModalTitle';

export type ModalRelationLinkProps = {
  isVisible: boolean;
  onClickCancel: () => void;
  onClickItem: (item: any) => void;
  value: any[];
  title: string;
  description: string;
  icon: React.ReactElement | React.ReactChildren;
  options: {
    path: string;
    displayKey: string;
    returnKey: string;
    key: string;
  }
}

type ModalRelationLinkState = {
  data: any[];
}

export class ModalRelationLink extends
  React.PureComponent<ModalRelationLinkProps, ModalRelationLinkState> {

  state = {
    data: [],
  };

  componentDidMount() {
    this.prepare();
  }

  componentDidUpdate(prevProps: ModalRelationLinkProps) {
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
        });
        return !exists;
      }),
    });
  };

  generateOnClickItem = (item: any) => {
    return () => {
      this.props.onClickItem(item);
    };
  };

  render() {
    const {
      options,
      isVisible,
      title,
      description,
      icon,
      onClickCancel,
    } = this.props;
    const {data} = this.state;
    return (
      <Modal
        isVisible={isVisible}
        title={
          <ModalTitle
            title={title}
            icon={icon}
          />
        }
      >
        <Style.Container>
          <Description>
            {description}
          </Description>
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
            colorType='danger'
            onClick={onClickCancel}
          >
            Cancel
          </Style.Cancel>
        </Style.Container>
      </Modal>
    );
  }
}
