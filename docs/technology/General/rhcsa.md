---
title: "RHCSA（Red Hat Certified System Administrator）"
description: "RHCSAのEX200実技試験、RHEL 10対応範囲、学習項目、推奨前提をRed Hatの現行公式情報から整理します。"
---

# RHCSA（Red Hat Certified System Administrator）

## 概要

RHCSAは、Red Hatが認定するRed Hat Enterprise Linux（RHEL）のシステム管理者向け資格です。取得には**RHCSA Exam（EX200）**に合格する必要があります。

特徴は、選択肢から答えを選ぶ知識試験ではなく、実際のシステム上で管理作業を行う**performance-based exam（実技型試験）**であることです。

現在のEX200は**Red Hat Enterprise Linux 10**をベースにしています。

## 試験詳細

| 項目 | 内容 |
| --- | --- |
| 資格区分 | ベンダー認定資格 |
| 実施団体 | Red Hat |
| 試験コード | EX200 |
| 試験方式 | Performance-based（実技） |
| 対象OS | Red Hat Enterprise Linux 10 |
| 合格後 | RHCSA認定 |
| 上位資格との関係 | RHCEへの基礎資格 |

試験では、外部インターネットや手元の資料に頼るのではなく、指定された環境内でシステム管理タスクを完成させる能力が評価されます。

## 学習範囲・試験目標

公式Exam Objectivesでは、主に次の実務タスクが示されています。

### 基本ツール

- シェルで正しいコマンドを実行
- 入出力リダイレクト
- grep・正規表現
- SSHによるリモート操作
- ファイル・ディレクトリ・リンク・権限管理
- システムドキュメントの利用

### システム管理

- RPM / Flatpakによるソフトウェア管理
- シンプルなシェルスクリプト
- 起動・停止・サービス・プロセス管理
- ログ・systemdの操作
- パーティション、LVM、ファイルシステム
- NFS・autofs
- IPv4 / IPv6・名前解決・firewalld
- ユーザー・グループ・権限管理
- SSH鍵認証
- SELinuxの設定

設定は再起動後も維持される必要があり、「コマンドを知っている」だけでなく、動作する状態まで仕上げる力が必要です。

## 受験前提

Red Hatは、次のいずれかを受講または同等レベルの経験を持つことを前提として案内しています。

- Red Hat System Administration I（RH124）+ II（RH134）
- RHCSA Rapid Track（RH199）
- それらに相当するRHELシステム管理の実務経験

講座受講そのものを一律の受験資格として必須化しているわけではありませんが、Exam Objectivesを自力で実行できることが重要です。

## 難易度・勉強時間目安

Red Hatは一律の標準勉強時間を公表していません。Linux経験がほぼない人と、日常的にRHELを運用している人では必要な準備量が大きく異なります。

RHCSAでは実際に設定を完成させる必要があるため、動画や本を見るだけでなく、RHEL環境で手を動かし、Exam Objectivesの各タスクを資料なしで再現できる状態を目標にします。

## 公式情報

- [RHCSA 公式ページ（Red Hat）](https://www.redhat.com/en/services/certification/rhcsa)
- [RHCSA Exam EX200](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam)

（確認日: 2026-09-25）
