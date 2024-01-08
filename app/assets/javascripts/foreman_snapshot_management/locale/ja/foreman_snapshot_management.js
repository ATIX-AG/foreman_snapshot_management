 locales['foreman_snapshot_management'] = locales['foreman_snapshot_management'] || {}; locales['foreman_snapshot_management']['ja'] = {
  "domain": "foreman_snapshot_management",
  "locale_data": {
    "foreman_snapshot_management": {
      "": {
        "Project-Id-Version": "foreman_snapshot_management 2.0.2",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2019-10-22 11:54+0000",
        "Last-Translator": "Amit Upadhye <aupadhye@redhat.com>, 2022",
        "Language-Team": "Japanese (https://www.transifex.com/foreman/teams/114/ja/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "ja",
        "Plural-Forms": "nplurals=1; plural=0;",
        "lang": "ja",
        "domain": "foreman_snapshot_management",
        "plural_forms": "nplurals=1; plural=0;"
      },
      "List all snapshots": [
        "全スナップショットの一覧表示"
      ],
      "Name of this snapshot": [
        "このスナップショットの名前"
      ],
      "Description of this snapshot": [
        "このスナップショットの説明"
      ],
      "Create a snapshot": [
        "スナップショットの作成"
      ],
      "Whether to include the RAM state in the snapshot": [
        "スナップショットに RAM 状態を含めるかどうか"
      ],
      "Whether to include the Quiesce state in the snapshot": [
        "スナップショットに Quiesce 状態を含めるかどうか。"
      ],
      "Update a snapshot": [
        "スナップショットの更新"
      ],
      "Delete a snapshot": [
        "スナップショットの削除"
      ],
      "Revert Host to a snapshot": [
        "ホストをスナップショットに戻す"
      ],
      "Error occurred while creating Snapshot: %s": [
        "スナップショットの作成中にエラーが発生しました: %s"
      ],
      "Error occurred while removing Snapshot: %s": [
        "スナップショットの削除中にエラーが発生しました: %s"
      ],
      "VM successfully rolled back.": [
        "VM が正常にロールバックされました。"
      ],
      "Error occurred while rolling back VM: %s": [
        "仮想マシンのロールバック中にエラーが発生しました: %s"
      ],
      "Failed to update Snapshot: %s": [
        "スナップショットの更新に失敗しました: %s"
      ],
      "Error occurred while creating Snapshot for:%s": [
        "スナップショットの作成中にエラーが発生しました: %s"
      ],
      "Created %{snapshots} for %{num} %{hosts}": [
        "%{num} 個の %{hosts} に対して %{snapshots} を作成済み"
      ],
      "Snapshot": [
        "スナップショット"
      ],
      "host": [
        "ホスト"
      ],
      "No hosts were found with that id, name or query filter": [
        "その ID、名前またはクエリーフィルターを使ってホストを見つけることができませんでした"
      ],
      "Something went wrong while selecting hosts - %s": [
        "ホストの選択中に問題が発生しました: %s"
      ],
      "No capable hosts found.": [
        "機能するホストが見つかりませんでした。"
      ],
      "Create Snapshot": [
        "スナップショットの作成"
      ],
      "Name must contain at least 2 characters starting with alphabet. Valid characters are A-Z a-z 0-9 _": [
        "名前には、アルファベットが少なくとも 2 文字含まれている必要があります。使用できる文字は A-Z a-z 0-9 _ です。"
      ],
      "Unable to create Proxmox Snapshot": [
        "Proxmox スナップショットを作成できません"
      ],
      "Unable to remove Proxmox Snapshot": [
        "Proxmox スナップショットを削除できません"
      ],
      "Unable to revert Proxmox Snapshot": [
        "Proxmox スナップショットを元に戻すことができません"
      ],
      "Snapshot name cannot be changed": [
        "スナップショット名は変更できません"
      ],
      "Unable to update Proxmox Snapshot": [
        "Proxmox スナップショットを更新できません"
      ],
      "Unable to create VMWare Snapshot with Quiesce. Check Power and VMWare Tools status.": [
        "Quiesce で VMWare スナップショットを作成できません。Power and VMWare Tools のステータスを確認してください。"
      ],
      "Unable to create VMWare Snapshot. Cannot set both Memory and Quiesce options.": [
        "VMWare スナップショットの作成ができません。Memory オプションと Quiesce オプションの両方を設定できません。"
      ],
      "Unable to create VMWare Snapshot": [
        "VMWare スナップショットを作成できません"
      ],
      "Unable to remove VMWare Snapshot": [
        "VMWare スナップショットを削除できません"
      ],
      "Unable to revert VMWare Snapshot": [
        "VMWare スナップショットを元に戻すことができません"
      ],
      "Unable to update VMWare Snapshot": [
        "VMWare スナップショットを更新できません"
      ],
      "No capable hosts selected": [
        "有効にできるホストが選択されていません"
      ],
      "Description": [
        "説明"
      ],
      "Snapshot Mode": [
        ""
      ],
      "Select Snapshot Mode between mutually exclusive options, 'Memory' (includes RAM) and 'Quiesce'.": [
        ""
      ],
      "Loading Snapshots information ...": [
        "スナップショット情報の読み込み中 ..."
      ],
      "Snapshots": [
        "スナップショット"
      ],
      "Successfully removed Snapshot \\\"%s\\\" from host %s": [
        "ホスト %s からスナップショット \\\"%s\\\" を正常に削除しました"
      ],
      "Successfully updated Snapshot \\\"%s\\\"": [
        "スナップショット \\\"%s\\\" を正常に更新しました。"
      ],
      "Error occurred while updating Snapshot: %s": [
        "スナップショットの更新中にエラーが発生しました: %s"
      ],
      "Successfully rolled back Snapshot \\\"%s\\\" on host %s": [
        "ホスト %s でスナップショット \\\"%s\\\" が正常にロールバックされました"
      ],
      "Memory": [
        ""
      ],
      "Quiesce": [
        ""
      ],
      "Snapshot successfully created!": [
        "スナップショットが正常に作成されました!"
      ],
      "Name": [
        "名前"
      ],
      "Create Snapshot for %s": [
        "%s のスナップショットの作成"
      ],
      "N/A": [
        "N/A"
      ],
      "Action": [
        "アクション"
      ],
      "Failed to load snapshot list": [
        "スナップショットリストの読み込みに失敗しました"
      ],
      "edit entry": [
        "エントリーの編集"
      ],
      "Rollback to \\\"%s\\\"?": [
        "\\\"%s\\\" へロールバックしますか ?"
      ],
      "Rollback": [
        "ロールバック"
      ],
      "Delete Snapshot \\\"%s\\\"?": [
        "スナップショット \\\"%s\\\" を削除しますか ?"
      ],
      "Delete": [
        "削除"
      ],
      "Foreman-plugin to manage snapshots in a virtual-hardware environments.": [
        "仮想ハードウェア環境でスナップショットを管理する Foreman-plugin。"
      ],
      "Include RAM": [
        "メモリーの追加"
      ]
    }
  }
};