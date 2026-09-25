---
title: "RHCE（Red Hat Certified Engineer in Ansible）"
description: "2026年のRed Hat認定体系ではRHCE in Ansibleは現行RHCSAとEX294合格が要件です。Ansible実技試験、学習範囲、3年のcurrent期間を公式情報から整理します。"
---

# RHCE（Red Hat Certified Engineer in Ansible）

## 概要

RHCEはRed Hatの上位システム管理者認定として知られてきましたが、**2026年の現行認定体系では分野がより明確に分かれています。**

このページでは、現在の**Red Hat Certified Engineer in Ansible（RHCE in Ansible）**を扱います。

RHCE in Ansibleは、Linuxのシステム管理能力を土台に、Ansible Automation Platformを使って複数システムの設定・運用を自動化できることを証明する認定です。

## 2026年の認定要件

RHCE in Ansibleを取得するには、次の両方が必要です。

1. **現行のRHCSA（Red Hat Certified System Administrator）認定**
2. **EX294：Red Hat Certified Advanced System Administrator in Ansible Examへの合格**

Red Hatの現行制度では、EX294単体に合格した場合でも「Red Hat Certified Advanced System Administrator in Ansible」という単独認定が付与されます。

現行RHCSAを持つ人がEX294に合格すると、RHCE in Ansibleの要件を満たします。

## EX294の試験形式

| 項目 | 内容 |
| --- | --- |
| 試験コード | EX294 |
| 方式 | Performance-based（実技） |
| 主技術 | Red Hat Ansible Automation Platform |
| 主な作業 | Playbook作成・システム設定自動化 |
| 外部インターネット | 利用不可 |
| 評価 | 指定された最終状態を満たすかで評価 |

選択肢から答えを選ぶ試験ではありません。

複数の実機相当システムを使い、Ansibleを設定し、Playbookを作成・実行して、指定されたシステム状態を実現します。

## 学習範囲

### RHCSA相当のシステム管理

- 基本ツール
- 稼働中システムの運用
- ストレージ
- ファイルシステム
- ユーザー・グループ
- セキュリティ
- シェルスクリプトの基礎

### Ansible

- Inventory
- Module
- Variable / Fact
- Loop / Condition
- Play / Playbook
- Error handling
- ansible.cfg
- Role
- Ansible Content Collections
- Template
- Ansible Vault

### システム管理の自動化

Playbookを使って次のようなRHCSAレベルの作業を自動化します。

- パッケージ
- サービス
- Firewall
- ファイルシステム
- ストレージ
- ユーザー・グループ
- スケジュール
- セキュリティ

設定は再起動後も維持される必要があります。

## 「RHCE」の名称に注意

Red Hatの2026年認定体系には、**RHCE in Ansible**とは別に**RHCE in Enterprise Linux**もあります。

Enterprise Linux側は、RHCSA（EX200）に加え、別の上級試験EX342を要件とする認定として案内されています。

古い記事で単に「RHCE = EX294」と説明されている場合は、現在の認定体系でどのRHCEを指しているか確認してください。

## 認定のcurrent期間

Red Hat認定資格は、取得後**3年間 current（現行）**として扱われます。

一定の上位認定や再認定試験に合格すると、RHCSA・RHCEのcurrent期限を延長できます。

## 難易度・勉強時間目安

Red Hatは標準勉強時間を設定していません。

EX294は実技試験のため、「Ansibleの文法を知っている」だけでは不十分です。

- Inventoryから複数ノードを扱う
- Playbookをゼロから組む
- Role / Collectionを利用する
- エラーを切り分ける
- 再起動後にも要件を満たす

といった一連の作業を時間内に実行できるよう、実機環境で反復することが重要です。

## 公式情報

- [RHCE in Ansible（Red Hat）](https://www.redhat.com/en/services/certification/red-hat-certified-engineer-in-ansible)
- [EX294 試験概要](https://www.redhat.com/ja/services/training/ex294-red-hat-certified-engineer-rhce-exam-red-hat-enterprise-linux-9)
- [Red Hat認定一覧](https://www.redhat.com/ja/services/certifications)
- [認定資格の更新](https://www.redhat.com/ja/services/certification/renewal)

（確認日: 2026-09-25）
