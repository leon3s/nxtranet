import type {NginxSiteAvailable} from '@nxtranet/headers';
import dynamic from 'next/dynamic';
import React, {useState} from 'react';
import {IconSave} from '~/styles/icons';
import ActionBar, {ActionWrapper} from './ActionBar';
import type CodeEditor from './CodeEditor';
import LoadingBackground from './LoadingBackground';
import * as Style from './NginxFile.s';

const DynamicAceEditor = dynamic(
  async (): Promise<typeof CodeEditor> => import("./CodeEditor")
    .then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingBackground />,
  }
);

export type NginxFileProps = {
  data: NginxSiteAvailable;
  onSave: (data: NginxSiteAvailable) => void;
}

export default function NginxFile(props: NginxFileProps) {
  const {data} = props;
  const [value, setValue] = useState<string>(data.content);

  function onChange(newValue: string) {
    setValue(newValue);
  }

  function onSave() {
    props.onSave({
      name: data.name,
      content: value,
    });
  }

  return (
    <Style.NginxFileContainer>
      <Style.ActionsHeader>
        <ActionWrapper
          isVisible={value !== data.content}
        >
          <ActionBar actions={[
            {
              title: 'Delete',
              icon: () => <IconSave size={12} />,
              fn: onSave,
            }
          ]} />
        </ActionWrapper>
      </Style.ActionsHeader>
      <DynamicAceEditor
        mode="nginx"
        width='100%'
        height='calc(100vh - 220px)'
        value={value}
        onChange={onChange}
        name={`editor_${data.name}`}
        editorProps={{$blockScrolling: true}}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true
        }}
      />
    </Style.NginxFileContainer>
  );
}
