import type {NginxSiteAvailable} from '@nxtranet/headers';
import React from 'react';
import * as Style from './NginxFile.s';


export type NginxFileProps = {
  data: NginxSiteAvailable;
}

export default function NginxFile(props: NginxFileProps) {
  const {data} = props;
  return (
    <Style.NginxFileContainer>
      <Style.NginxCardTitle>
        {data.name}
      </Style.NginxCardTitle>
    </Style.NginxFileContainer>
  );
}
