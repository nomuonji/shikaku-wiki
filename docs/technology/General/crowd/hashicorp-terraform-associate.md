---
title: "HashiCorp Terraform Associate"
---

# HashiCorp Terraform Associate（004）

## 資格の対象
Terraform Associateは、Infrastructure as Codeの基本を理解し、Terraformの設定・計画・適用を扱えることを示す初級認定です。クラウドやデータセンターの構成をコードで管理する担当者、手作業の構築を再現可能な変更手順にしたい開発・運用チームに向きます。認定を取っても、実際のクラウド設計、安全な状態管理、チームでのレビュー経験を証明するわけではありません。

## 現行試験と学習範囲
2026年9月24日にHashiCorp公式情報で確認した現行試験はTerraform Associate 004です。Terraform 1.12を基準に、ワークフロー、構成記述、状態管理、変数や出力、モジュール、プロバイダー、依存関係、plan/applyの扱いに加え、HCP Terraformの機能を扱います。試験版003用の教材は、試験範囲や新しい機能の差があり得るため、そのまま004対策とみなさず公式Study GuideのObjectivesに照合してください。

公式の準備案内は、基本的なターミナル操作とオンプレミスまたはクラウドのアーキテクチャ経験を前提知識として推奨しています。実技課題の代わりとなる選択式試験でも、設定ファイルやCLIの出力を読めないと判断問題に対応しづらくなります。小さな検証用ディレクトリでinit、validate、planを実行し、変更前後の差分とstateの意味を確認します。

特に、resource間の暗黙の依存とdepends_on、create_before_destroy、workspaceとHCP Terraform project、ephemeral valuesやwrite-only argumentsなどの役割を区別します。各機能の名前だけでなく、どの情報をstateに残すべきか、変更を適用する前に何を確認するかを説明できるようにします。秘密情報をコードへ直書きしないことや、stateの保護も実務上の重要点です。

## 受験前に確認すること
公式資格ページで現行試験版、試験時間、受験方式、地域別料金、認定の有効期間と更新条件を確認してください。ベンダーやクラウドのサービス名称変更を含むため、古いブログ記事の出題項目や価格を現在の条件と混ぜないようにします。

## 公式情報
- [HashiCorp Certification：Terraform Associate](https://developer.hashicorp.com/certifications/infrastructure-automation)
- [Terraform Associate 004 Study Guide](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-study-004)

更新日：2026年9月24日（004版・Terraform 1.12と試験範囲を確認）
