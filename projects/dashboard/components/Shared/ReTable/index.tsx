/*
 * Filename: c:\Users\leone\Documents\code\nextranet\dashboard\components\Shared\ReTable\index.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Tuesday, October 26th 2021, 5:09:32 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import React from 'react';

import {IoMdSettings} from 'react-icons/io';

import * as HeaderSearchStyle from '~/styles/headerSearch';

import * as Style from './style';

export type     RetableData = {
  [key:string]: any;
}

export type     RetableSchemaItem = {
  key:          string;
  title:        string;
  type:         "string"|"number"|"date";
  transform?:   (item:any) => string | React.ReactChildren | JSX.Element;
}

export type     RetableAction = {
  title:        string;
  key:          string;
  fn:           (...args:any[]) => void;
  transform?:   (item:any) => string | React.ReactChildren | JSX.Element;
}

interface         RetableProps {
  data:           RetableData;
  actions?:       RetableAction[];
  schema:         RetableSchemaItem[];
  onClickCreate?: () => void;
}

function generateTitle(schema: RetableSchemaItem[]) {
  return (
    <Style.Line>
      {schema.map(({title, key}) => (
        <Style.Cell
          key={`title-${key}`}
          schemaLength={schema.length}
        >
          {title}
        </Style.Cell>
      ))}
      <Style.ActionCell isHidden />
    </Style.Line>
  )
}

function generateActionClick(d:any, fn: (...args:any[]) => void) {
  return function actionClick() {
    fn(d);
  }
}

export default function ReTable(props: RetableProps) {
  const {
    data,
    schema,
    actions,
    onClickCreate,
  } = props;
  return (
    <Style.Container>
      {onClickCreate ?
      <Style.HeaderContainer>
        <HeaderSearchStyle.Header>
          <HeaderSearchStyle.SearchBar
            placeholder="Search.."
            />
          <HeaderSearchStyle.CreateButton onClick={props.onClickCreate}>
            Create
          </HeaderSearchStyle.CreateButton>
        </HeaderSearchStyle.Header>
        </Style.HeaderContainer>
      : null}
      <Style.Content>
        {generateTitle(schema)}
        {data.map((d: any) => (
          <Style.Line
            key={d.id}
          >
            {schema.map(({key, transform}) => {
              return (
                <Style.Cell
                  key={`${key}-${d.id}`}
                  schemaLength={schema.length}
                >
                  {transform ? transform(d) : d[key]}
                </Style.Cell>
              )
            })}
            <Style.ActionCell
              isHidden={!actions}
              actionsLength={actions?.length || 0}
            >
              {actions ?
                <Style.ActionList>
                  <Style.ActionItem>
                    <IoMdSettings
                      size={18}
                    />
                  </Style.ActionItem>
                  {actions.map((action) => (
                    <Style.ActionItem
                      isEnabled={true}
                      title={action.title}
                      key={`${action.key}-${d.id}`}
                      onClick={generateActionClick(d, action.fn)}
                    >
                      {action.transform ? action.transform(d) : action.title}
                    </Style.ActionItem>
                  ))}
                </Style.ActionList>
              : null}
            </Style.ActionCell> 
          </Style.Line>
        ))}
      </Style.Content>
    </Style.Container>
  )
}
