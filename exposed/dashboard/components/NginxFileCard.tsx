import type {NginxSiteAvailable} from '@nxtranet/headers';
import Link from 'next/link';
import React from 'react';
import {
  IconFile
} from '~/styles/icons';
import LoadingBackground from './LoadingBackground';
import * as Style from './NginxFileCard.s';

type NginxFileCardProps = {
  data?: NginxSiteAvailable | null;
  onClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
};

export default function NginxFileCard(props: NginxFileCardProps) {
  const {data, onClick} = props;
  if (!data) {
    return (
      <Style.NginxFileCardContainer>
        <LoadingBackground />
        <Style.NginxFileCardIcon>
          <IconFile
            size={50}
          />
        </Style.NginxFileCardIcon>
        <Style.NginxFileCardDescription>
          <Style.NginxFileCardTitleContainer>
            <Style.NginxFileCardTitle>
              project name
            </Style.NginxFileCardTitle>
            <Style.NginxFileCardSubtitle
            >
              github_username/project_name
            </Style.NginxFileCardSubtitle>
          </Style.NginxFileCardTitleContainer>
        </Style.NginxFileCardDescription>
      </Style.NginxFileCardContainer>
    );
  }
  return (
    <Link
      shallow
      passHref
      href={`/dashboard/nginx/files/${data.name}`}
    >
      <Style.NginxFileCardContainer
        onClick={onClick}
      >
        <Style.NginxFileCardIcon>
          <IconFile
            size={50}
          />
        </Style.NginxFileCardIcon>
        <Style.NginxFileCardDescription>
          <Style.NginxFileCardTitleContainer>
            <Style.NginxFileCardTitle>
              {data.name}
            </Style.NginxFileCardTitle>
          </Style.NginxFileCardTitleContainer>
        </Style.NginxFileCardDescription>
      </Style.NginxFileCardContainer>
    </Link>
  );
}
