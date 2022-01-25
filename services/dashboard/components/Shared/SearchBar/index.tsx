import React from 'react';

import {debounceTime, distinctUntilChanged, map, Subject} from 'rxjs';

import * as Style from './style';

interface ISearchBarProps {
  placeholder?:string;
  defaultValue:string;
  onSearch:(value:string) => void;
}

export default class SearchBar extends React.PureComponent<ISearchBarProps> {
  state = {
    value: this.props.defaultValue || '',
  }

  sub = new Subject<string>();

  onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    this.setState({
      value,
    }, () => this.sub.next(this.state.value));
  }

  componentDidMount() {
    this.sub.pipe(
      map(s => s.trim()),
      distinctUntilChanged(),
      debounceTime(750),
    ).subscribe((term) => {
      this.props.onSearch(term);
    });
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  render() {
    const {
      placeholder,
    } = this.props;
    return (
      <Style.Container>
        <Style.SearchInput
          type="text"
          value={this.state.value}
          onChange={this.onChange}
          placeholder={placeholder}
        />
      </Style.Container>
    )
  }
}