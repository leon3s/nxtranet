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

type InputRelationState = {
  data: any[];
  value: string;
}

class InputRelation extends
  React.PureComponent<InputProps, InputRelationState> {

  state = {
    data: [],
    value: this.props.value || '',
  }

  async componentDidMount() {
    console.log(this.props);
    const {options} = this.props;
    if (!options) return;
    const res = await api.get<any[]>(options.path);

    this.setState({
      data: res.data,
    });
  }

  onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const d = this.state.data.find(({namespace}) =>
      namespace === e.target.value
    );
    this.setState({
      value: e.target.value,
    });
    if (d) {
      this.props.onChange(d[this.props.options.returnKey]);
    }
  };

  render(): React.ReactNode {
    const {data, value} = this.state;
    const {options, name} = this.props;
    if (!options) return 'Options must be specified for Relation Input';
    return (
      <Style.InputRelationContainer>
        <Style.InputRelationSelect
          name={name}
          value={value}
          onChange={this.onChange}
        >
          {options.isAnyEnabled ? <Style.InputRelationOptions
            value=""
          >
            any
          </Style.InputRelationOptions> : null}
          {data.map((d: any) => (
            <Style.InputRelationOptions
              key={d.namespace}
              value={d.namespace}
            >
              {d[options.displayKey]}
            </Style.InputRelationOptions>
          ))}
        </Style.InputRelationSelect>
      </Style.InputRelationContainer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputRelation);
