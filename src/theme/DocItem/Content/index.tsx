import React, {type ReactNode} from 'react';
import DocItemContent from '@theme-original/DocItem/Content';
import QualificationRelated from '@site/src/components/QualificationRelated';
import type {Props} from '@theme/DocItem/Content';

export default function DocItemContentWrapper({
  children,
  ...props
}: Props): ReactNode {
  return (
    <DocItemContent {...props}>
      {children}
      <QualificationRelated />
    </DocItemContent>
  );
}
