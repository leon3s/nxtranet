import React, {FormEvent} from 'react';
import ButtonLoading from '../ButtonLoading';
import * as Inputs from './Inputs';
import * as Style from './style';

const defaultValue: Record<string, any> = {
  Number: '',
  String: '',
  Icon: '',
  Color: '#000000',
  ArrayString: [],
  Relation: '',
};

export type ReformSchema = {
  key: string;
  title: string;
  isLabelEnabled?: boolean;
  description?: string;
  isDescriptionEnabled?: boolean;
  type: "Number" | "String" | "Icon" | "Color" | "ArrayString" | "Relation"
  options?: any;
};

export type ReformProps = {
  data?: any;
  schema: ReformSchema[];
  isButtonCancelEnabled?: boolean;
  onCancel?: () => void;
  submitTitle?: string;
  errors?: Record<string, string> | null;
  onSubmit?: (d: any) => void | Promise<void>;
  isButtonLoadingResolving?: boolean;
  hideButtons?: boolean;
  onChange?: (data: any) => void;
};

type ReformState = {
  data: any;
  dataPtr: any;
}

type OnChange = (key: string) => (data: any) => void;

function Input(schema: ReformSchema, onChange: OnChange, data: any = {}, errors: Record<string, string> = {}) {
  const Comp = Inputs[schema.type];
  if (!Comp) {
    return (
      'Input type error: ' + schema.type
    );
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
  );
}

export default class Reform
  extends React.PureComponent<ReformProps, ReformState> {

  state = {
    data: this.props.schema.reduce((acc, schema) => {
      acc[schema.key] = (this.props.data && this.props.data[schema.key]) || defaultValue[schema.type];
      return acc;
    }, {} as Record<string, string>),
    dataPtr: this.props.data,
  };

  static defaultProps = {
    errors: {},
  };

  static getDerivedStateFromProps(props: ReformProps, state: ReformState) {
    if (!state.data) {
      return {
        ...state,
        dataPtr: props.data,
        data: props.schema.reduce((acc, schema) => {
          acc[schema.key] = (props.data && props.data[schema.key]) || defaultValue[schema.type];
          return acc;
        }, {} as Record<string, string>)
      };
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
        };
      }
      return {
        ...state,
        dataPtr: props.data,
        data: props.data,
      };
    }
    return state;
  }

  onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  onClickCreate = async () => {
    if (this.props.onSubmit) {
      await this.props.onSubmit(this.state.data);
      this.setState({
        data: null,
        dataPtr: null,
      });
    }
  };

  onChange = (key: string) => (val: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [key]: val,
      },
    }, () => {
      this.props.onChange && this.props.onChange(this.state.data);
    });
  };

  onClickCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (this.props.onCancel) this.props.onCancel();
  };

  componentWillUnmount() {
    console.log('REFORM UMOUNT');
  }

  render() {
    const {
      schema,
      submitTitle,
      errors,
      hideButtons,
      isButtonCancelEnabled,
      isButtonLoadingResolving,
    } = this.props;
    const {
      data,
    } = this.state;
    return (
      <Style.Container>
        <Style.Form onSubmit={this.onSubmit}>
          {schema.map((schem) => Input(schem, this.onChange, data, errors || {}))}
          {!hideButtons ? <Style.ButtonContainer>
            {isButtonCancelEnabled ?
              <ButtonLoading
                colorType='danger'
                isResolving={false}
                onClick={this.onClickCancel}
              >
                Cancel
              </ButtonLoading>
              : <Style.HiddenDiv />
            }
            <ButtonLoading
              onClick={this.onClickCreate}
              isResolving={isButtonLoadingResolving}
            >
              {submitTitle || "Submit"}
            </ButtonLoading>
          </Style.ButtonContainer> : null}
        </Style.Form>
      </Style.Container>
    );
  }
}
