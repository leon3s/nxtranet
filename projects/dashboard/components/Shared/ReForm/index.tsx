/*
 * Filename: c:\Users\leone\Documents\code\nextranet\projects\dashboard\components\Shared\ReForm\index.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Wednesday, October 27th 2021, 5:10:49 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import React, { FormEvent } from 'react';

import * as Style from './style';

import * as Inputs from './Inputs';
import ButtonLoading from '../ButtonLoading';

const defaultValue: Record<string, any> = {
  Number: '',
  String: '',
  Icon: '',
  Color: '#000000',
  ArrayString: [],
  Relation: '',
};

export type               ReformSchema = {
  key:                    string;
  title:                  string;
  isLabelEnabled?:        boolean;
  description?:            string;
  isDescriptionEnabled?:  boolean;
  type:                   "Number" | "String" | "Icon" | "Color" | "ArrayString" | "Relation"
  options?:               any;
};

export type               ReformProps = {
  data?:                  any;
  schema:                 ReformSchema[];
  isButtonCancelEnabled?: boolean;
  onCancel?:              ( ) => void;
  submitTitle?:           string;
  onSearch?:              (term:string) => void;
  errors?:                Record<string, string>;
  onSubmit?:              (d:any) => void | Promise<void>;
};

type                      ReformState = {
  data:                   any;
  dataPtr:                any;
}

type OnChange = (key:string) => (data:any) => void;

function Input(schema: ReformSchema, onChange:OnChange, data: any = {}, errors: Record<string, string> = {}) {
  const Comp = Inputs[schema.type];
  if (!Comp) {
    return (
      'Input type error: ' + schema.type
    )
  }
  if (typeof schema.isLabelEnabled === 'undefined') {
    schema.isLabelEnabled = true;
  }
  return (
    <Style.InputLine
      key={schema.key}
    >
      {schema.isLabelEnabled ?
      <Style.InputTitle
        htmlFor={schema.key}
      >
        {schema.title}
      </Style.InputTitle>
      : null}
      {schema.isDescriptionEnabled ?
      <Style.InputDescription>
        {schema.description}
      </Style.InputDescription>
      : null}
      <Comp
        name={schema.key}
        value={data[schema.key]}
        options={schema.options}
        onChange={onChange(schema.key)}
      />
      <Style.InputError
        isVisible={!!errors[schema.key]}
      >
        {errors[schema.key]}
      </Style.InputError>
    </Style.InputLine>
  )
}

export default class Reform
  extends React.PureComponent<ReformProps, ReformState> {
  state = {
    data: this.props.data,
    dataPtr: this.props.data,
  }

  static getDerivedStateFromProps(props:ReformProps, state: ReformState) {
    if (!state.data) {
      return {
        ...state,
        dataPtr: props.data,
        data: props.schema.reduce((acc, schema) => {
          acc[schema.key] = (props.data && props.data[schema.key]) || defaultValue[schema.type];
          return acc;
        }, {} as Record<string, string>)
      }
    }
    if ((props.data !== state.dataPtr)) {
      if (!props.data) {
        return {
          ...state,
          dataPtr: props.data,
          data: props.schema.reduce((acc, schema) => {
            acc[schema.key] = (props.data && props.data[schema.key]) || defaultValue[schema.type];
            return acc;
          }, {} as Record<string, string>)
        }
      }
      return {
        ...state,
        dataPtr: props.data,
        data: props.data,
      }
    }
    return state;
  }

  onSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  onClickCreate = async () => {
    if (this.props.onSubmit) {
      await this.props.onSubmit(this.state.data);
      this.setState({
        data: null,
        dataPtr: null,
      });
    }
  }

  onChange = (key:string) => (val:any) => {
    this.setState({
      data: {
        ...this.state.data,
        [key]: val,
      },
    });
  }

  onClickCancel = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (this.props.onCancel) this.props.onCancel();
  }

  render() {
    const {
      schema,
      submitTitle,
      errors,
      isButtonCancelEnabled,
    } = this.props;
    const {
      data,
    } = this.state;
    console.log('errors !', {errors});
    return (
      <Style.Container>
        <Style.Form onSubmit={this.onSubmit}>
          {schema.map((schem) => Input(schem, this.onChange, data, errors))}
          <Style.ButtonContainer>
            {isButtonCancelEnabled ?
              <Style.ButtonCancel onClick={this.onClickCancel} >
                Cancel
              </Style.ButtonCancel>
            : <Style.HiddenDiv />}
            <ButtonLoading
              onClick={this.onClickCreate}
              title={submitTitle || "Submit"}
            />
          </Style.ButtonContainer>
        </Style.Form>
      </Style.Container>
    )
  }
}
