import Link from 'next/link';
import React from 'react';
import * as Style from './style';

type InfoRowProps = {
  label: string;
  value: string | number;
  href?: string;
  target?: string;
}

export default function InfoRow(props: InfoRowProps) {
  const {
    href,
    label,
    value,
    target,
  } = props;
  return (
    <Style.ContainerLine>
      <Style.ContainerTitle>
        {label}
      </Style.ContainerTitle>
      {href ? <Link
        passHref
        href={href}
      >
        <Style.ContainerValueLink
          target={target}
        >
          {value}
        </Style.ContainerValueLink>
      </Link>
        : <Style.ContainerValue>
          {value}
        </Style.ContainerValue>
      }
    </Style.ContainerLine>
  )
}
