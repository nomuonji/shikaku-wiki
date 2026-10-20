---
title: "AWS認定の選び方"
sidebar_label: "AWS認定の選び方"
description: "クラウド未経験か基礎ありか、共通言語・設計・開発・運用・セキュリティ・データ/AIのどれを先に示すかで、現行のAWS認定から最初と次の候補を選ぶ固定ハブ。2026年秋のSAP・DVA・MLA試験切替日を含む。"
verified_at: "2026-10-21"
official_url: "https://aws.amazon.com/jp/certification/"
credential_type: "民間資格"
qualification_status: "active"
---

# AWS認定を経験と職務で選ぶ

AWS認定は一列の難易度表ではなく、何を示す資格かで分かれます。このページは、2026年10月21日に確認した [AWS Certification公式一覧](https://aws.amazon.com/certification/) と [日本語の認定トップ](https://aws.amazon.com/jp/certification/) を正本に、最初の1つと次の1つを選ぶための判断面です。試験コード、料金、出題比率、予約条件は各試験ページが優先です。

資格を取っても、就職、年収、実務能力は保証されません。公式ページが示すのは、その試験が検証する知識と推奨経験です。

## 2026年秋の試験切替（SAP・DVA・MLA）

2026年秋に Solutions Architect – Professional (SAP)、Developer – Associate (DVA)、Machine Learning Engineer – Associate (MLA) の試験が新バージョンへ切り替わります。旧版で今受けるか新版を待つか、既存教材をそのまま使えるかを判断するための比較です。出題細目の完全ガイドは2026年10月27日以降に公開予定のため、ここでは日程のみを一次情報から記載し、詳細な出題範囲は捏造しません。

| 試験 | 新バージョン | 登録開始 | GA（一般提供） | 旧版に関する注意 | 公式確認先 |
| --- | --- | --- | --- | --- | --- |
| Solutions Architect – Professional | SAP-C03 | 2026年10月27日 | 2026年11月17日 | 旧SAP-C02の最終日は各公式で確認 | [AWS日本語告知](https://aws.amazon.com/jp/blogs/news/september-2026-new-offerings/) |
| Developer – Associate | DVA-C03 | 2026年10月27日 | 2026年12月1日 | 公式間で旧DVA-C02最終日が相違（英語ブログは11/30、日本語個別ページは12/1）。断定せず予約画面を最終確認 | [AWS日本語告知](https://aws.amazon.com/jp/blogs/news/september-2026-new-offerings/) / [英語原文](https://aws.amazon.com/blogs/training-and-certification/september-2026-new-offerings/) / [Developer個別](https://aws.amazon.com/jp/certification/certified-developer-associate/) |
| Machine Learning Engineer – Associate | MLA-C02 | （告知参照） | 2027年1月14日 | 日本語では旧MLA-C01が継続する場合あり。最新を確認 | [AWS日本語告知](https://aws.amazon.com/jp/blogs/news/september-2026-new-offerings/) |

SAP-C03とDVA-C03は2026年10月27日から登録開始です。予約時は必ず公式の試験予約画面で最新の最終日とバージョンを確認してください。価格・在庫・出題詳細は確認日とチャネルにより変動するため断定しません。

## 先に分けること

- クラウド未経験、または非技術職で共通言語が必要なら、Foundationalが最初の候補です。
- すでにクラウドまたはオンプレミスITの基礎があるなら、Foundationalを必須にせず、職務に合うAssociateを最初の候補にできます。
- 廃止・改称済みの名称は現行資格として扱いません。SysOps Administrator – Associateは現行一覧では CloudOps Engineer – Associate です。Machine Learning – Specialtyは現行一覧にありません。Advanced Networking – Specialtyは2026年12月31日に終了予定と公式一覧が案内しています。

## 経験×目的の判断表

| 経験 | 目的 | 最初の候補 | 先に必要な基礎 | 次の一手 | 公式確認先 |
| --- | --- | --- | --- | --- | --- |
| クラウド未経験 | 共通言語（営業、企画、調達、管理） | AWS Certified Cloud Practitioner | クラウドの用語、責任共有、料金の読み方 | 職務が決まったら下のAssociateへ。未経験のままProfessionalやSpecialtyへ進まない | [Cloud Practitioner](https://aws.amazon.com/jp/certification/certified-cloud-practitioner/) |
| 基礎あり | 共通言語だけを先に示す | Cloud Practitioner、または AIの共通言語なら AWS Certified AI Practitioner | クラウドまたはAIの基本用語 | 設計・開発・運用・データへ進むなら対応するAssociate | [AI Practitioner](https://aws.amazon.com/certification/certified-ai-practitioner/) |
| 基礎あり | 設計 | AWS Certified Solutions Architect – Associate | AWSまたはオンプレミスITの経験。深いコーディングは必須ではないと公式が説明 | 複数システムの設計を示すなら Solutions Architect – Professional（2026年秋にSAP-C03へ切替予定） | [SAA](https://aws.amazon.com/jp/certification/certified-solutions-architect-associate/) |
| 基礎あり | 開発 | AWS Certified Developer – Associate | アプリケーションの開発・テスト・デプロイ・デバッグ | 生成AIアプリの実装を示すなら Generative AI Developer – Professional。2026年秋にDVA-C03へ切替 | [Developer](https://aws.amazon.com/certification/certified-developer-associate/) |
| 基礎あり | 運用 | AWS Certified CloudOps Engineer – Associate | ワークロードのデプロイ、管理、運用 | 開発と運用の接続を示すなら DevOps Engineer – Professional | [CloudOps](https://aws.amazon.com/certification/certified-cloudops-engineer-associate/) |
| 基礎あり | セキュリティ | 先に設計か運用のAssociateを検討し、AWS上の保護経験があるなら AWS Certified Security – Specialty | 公式はITセキュリティ5年とAWSワークロード保護2年以上を対象者として説明 | Specialtyは補完であり、最初の1枚にはしない | [Security Specialty](https://aws.amazon.com/jp/certification/certified-security-specialty/) |
| 基礎あり | データ / AI | データ基盤なら Data Engineer – Associate。ML実装なら Machine Learning Engineer – Associate（2026年秋以降MLA-C02へ切替予定）。AIの基礎用語なら AI Practitioner | データライフサイクル、またはML/生成AIの基本概念 | 生成AIの実装なら Generative AI Developer – Professional。ビジネス判断なら AI Business Strategist（Beta） | [Data Engineer](https://aws.amazon.com/certification/certified-data-engineer-associate/) / [ML Engineer](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) |

Beta試験と「Coming soon」の更新は、合格後の扱いが変わることがあります。申し込み前に公式ページの状態を見てください。

## サイト内で読める個別ページ

内部リンクは、現行、公式URL、270日以内の確認日、本文の事実境界を個別に満たすページだけです。確認日は2026年10月21日です。

- [AWS認定クラウドプラクティショナー](/docs/technology/General/aws-cloud-practitioner/): Foundational。CLF-C02、90分・65問、有効期間3年。
- [AWS認定ソリューションアーキテクト アソシエイト](/docs/technology/General/aws-nintei-solution-architect-associate/): 設計向けAssociate。公式は150 USD、65問、試験時間130分。
- [AWS Certified Security – Specialty](/docs/technology/General/aws-security-specialty/): セキュリティ制御の設計・実装。公式は170分、300 USD、対象はITセキュリティ5年とAWS保護2年以上。

Developer、CloudOps、Data Engineer、AI Practitioner、Machine Learning Engineer、Professional各試験の個別ページは、このサイトではまだsource-readyではないためリンクしません。公式一覧から直接確認してください。

## 戻し方

この判断面が誤分類や制度変更で使えなくなった場合は、このページと個別ページに追加した導線だけを削除します。既存の個別ページURLは残します。
