import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import api from '~/api';
import type {State} from '~/redux/reducers';
import type {Dispatch} from '~/utils/redux';
import type InputProps from './props';
import * as Style from './style';

const actions = {};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch)

type InputRelationMultipleState = {
  data: any[];
  value: any[];
}

class InputRelationMultiple extends
  React.PureComponent<InputProps, InputRelationMultipleState> {

  state: InputRelationMultipleState = {
    data: [],
    value: this.props.value || [],
  }

  async componentDidMount() {
    console.log(this.props);
    const {options} = this.props;
    if (!options) return;
    const res = await api.get<any[]>(options.path);

    this.setState({
      data: res.data.filter((d) => {
        const exists = this.state.value.find((v) => {
          if (v[options.returnKey] === d[options.returnKey]) {
            return true;
          }
          return false;
        })
        return !exists;
      }),
    });
  }

  generateOnRemoveItem = (item: any) => {
    const {options} = this.props;
    return () => {
      const id = item[options.returnKey];
      this.setState({
        value: this.state.value.filter((d) => {
          return d[options.returnKey] !== id;
        }),
        data: [
          ...this.state.data,
          item,
        ]
      });
      if (options.onRemoveItem) {
        options.onRemoveItem(item);
      }
    }
  }

  generateAddItem = (item: any) => {
    const {options} = this.props;
    return () => {
      const id = item[options.returnKey];
      this.setState({
        data: this.state.data.filter((d) => {
          return d[options.returnKey] !== id;
        }),
        value: [
          ...this.state.value,
          item,
        ]
      });
      if (options.onAddItem) {
        options.onAddItem(item);
      }
    }
  }

  render(): React.ReactNode {
    const {data, value} = this.state;
    const {options} = this.props;
    if (!options) return 'Options must be specified for Relation Input';
    return (
      <Style.InputMultipleContainer>
        <Style.InputMultipleLine>
          {value.map((val: any, i: number) => {
            const key = val[options.key] || `input-multiple-${i}`;
            if (options.render) {
              return options.render(val, key);
            }
            return (
              <Style.InputMultipleItem
                key={key}
                title="remove"
              >
                <Style.InputMultipleItemOverlay onClick={this.generateOnRemoveItem(val)}>
                </Style.InputMultipleItemOverlay>
                <Style.InputMultipleItemTitle>
                  {val[options.displayKey]}
                </Style.InputMultipleItemTitle>
              </Style.InputMultipleItem>
            )
          })}
        </Style.InputMultipleLine>
        <Style.InputMultipleLine>
          {data.map((d: any, i: number) => {
            const key = d[options.key] || `input-multiple-${i}`
            if (options.render) {
              return options.render(d, key);
            }
            return (
              <Style.InputMultipleItem
                title="add"
                key={key}
              >
                <Style.InputMultipleItemOverlay onClick={this.generateAddItem(d)}>
                </Style.InputMultipleItemOverlay>
                <Style.InputMultipleItemTitle>
                  {d[options.displayKey]}
                </Style.InputMultipleItemTitle>
              </Style.InputMultipleItem>
            )
          })}
        </Style.InputMultipleLine>
      </Style.InputMultipleContainer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputRelationMultiple);
