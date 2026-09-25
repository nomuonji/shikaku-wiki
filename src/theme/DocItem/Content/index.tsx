import React, {type ReactNode} from 'react';
import DocItemContent from '@theme-original/DocItem/Content';
import QualificationRelated from '@site/src/components/QualificationRelated';
import QualificationQuickFacts from '@site/src/components/QualificationQuickFacts';
import QualificationStructuredData from '@site/src/components/QualificationStructuredData';
import type {Props} from '@theme/DocItem/Content';

export default function DocItemContentWrapper({
  children,
  ...props
}: Props): ReactNode {
  return (
    <DocItemContent {...props}>
      <QualificationStructuredData />
      <QualificationQuickFacts />
      {children}
      <QualificationRelated />
    </DocItemContent>
  );
}
