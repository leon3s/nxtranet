import type {NginxSiteAvaible} from '@nxtranet/headers';
import type TCodeEditor from '@uiw/react-textarea-code-editor';
import "@uiw/react-textarea-code-editor/dist.css";
import dynamic from "next/dynamic";
import React, {useState} from 'react';
import {FiEdit2} from 'react-icons/fi';
import Accordion from '~/components/Shared/Accordion';
import * as AccordionStyle from '~/styles/accordionLine';
import * as Style from './style';

type NginxCardProps = {
  data: NginxSiteAvaible;
  isVisible?: boolean;
  onClick: (data: NginxSiteAvaible) => void;
  onUpdateNginxSiteAvaible: (name: string, content: string) => void;
}

const CodeEditor = dynamic(
  async (): Promise<typeof TCodeEditor> => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
);

export default function NginxCard(props: NginxCardProps) {
  const {
    data,
    isVisible,
  } = props;

  const [content, setContent] = useState(data.content);

  function onClick() {
    props.onClick(data);
  }

  function updateNginxSiteAvaible() {
    props.onUpdateNginxSiteAvaible(props.data.name, content);
  }

  return (
    <AccordionStyle.AccordionContainer>
      <Accordion
        onClick={onClick}
        isVisible={isVisible}
        title={
          <AccordionStyle.AccordionTitle>
            {data.name}
          </AccordionStyle.AccordionTitle>
        }
        content={
          <AccordionStyle.AccordionContent>
            <Style.NginxCardContent>
              <Style.NginxCardActionsRelative>
                <Style.NginxCardActions>
                  <Style.NginxCardAction>
                    <Style.NginxCardActionButton
                      isActive={props.data.content !== content}
                      onClick={updateNginxSiteAvaible}
                    >
                      <FiEdit2 size={10} />
                    </Style.NginxCardActionButton>
                  </Style.NginxCardAction>
                </Style.NginxCardActions>
              </Style.NginxCardActionsRelative>
              <Style.CodeEditorWrapper>
                <CodeEditor
                  value={content}
                  language="nginx"
                  placeholder="Please enter nginx config"
                  onChange={(evn) => {setContent(evn.target.value.trim())}}
                />
              </Style.CodeEditorWrapper>
            </Style.NginxCardContent>
          </AccordionStyle.AccordionContent>
        }
      />
    </AccordionStyle.AccordionContainer>
  )
}
