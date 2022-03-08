import Link from 'next/link';
import React from 'react';
import * as Style from './InfoRow.s';

type InfoRowProps = {
  label: string;
  value: string | number | React.ReactNode;
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
  );
}
