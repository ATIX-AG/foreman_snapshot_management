 locales['foreman_snapshot_management'] = locales['foreman_snapshot_management'] || {}; locales['foreman_snapshot_management']['de'] = {
  "domain": "foreman_snapshot_management",
  "locale_data": {
    "foreman_snapshot_management": {
      "": {
        "Project-Id-Version": "foreman_snapshot_management 2.0.2",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2019-10-22 11:54+0000",
        "Last-Translator": "Markus Bucher <bucher@atix.de>, 2021",
        "Language-Team": "German (https://www.transifex.com/foreman/teams/114/de/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "de",
        "Plural-Forms": "nplurals=2; plural=(n != 1);",
        "lang": "de",
        "domain": "foreman_snapshot_management",
        "plural_forms": "nplurals=2; plural=(n != 1);"
      },
      "List all snapshots": [
        "Alle Snapshots auflisten"
      ],
      "Name of this snapshot": [
        "Name dieses Snapshots"
      ],
      "Description of this snapshot": [
        "Beschreibung dieses Snapshots"
      ],
      "Create a snapshot": [
        "Einen Snapshot erstellen"
      ],
      "Whether to include the RAM state in the snapshot": [
        "Ob auch der aktuelle Hauptspeicherstand im Snapshot gespeichert werden soll"
      ],
      "Whether to include the Quiesce state in the snapshot": [
        ""
      ],
      "Update a snapshot": [
        "Snapshot aktualisieren"
      ],
      "Delete a snapshot": [
        "Snapshot löschen"
      ],
      "Revert Host to a snapshot": [
        "Host auf einen Snapshot zurücksetzen"
      ],
      "Error occurred while creating Snapshot: %s": [
        "Beim Erzeugen des Snaphosts ist ein Fehler aufgetreten: %s"
      ],
      "Error occurred while removing Snapshot: %s": [
        "Beim Löschen des Snapshots ist ein Fehler aufgetreten: %s"
      ],
      "VM successfully rolled back.": [
        "Die VM wurde erfolgreich zurückgesetzt."
      ],
      "Error occurred while rolling back VM: %s": [
        "Beim Zurücksetzen der VM ist ein Fehler aufgetreten: %s"
      ],
      "Failed to update Snapshot: %s": [
        "Das Aktualisieren des Snapshots ist fehlgeschlagen: %s"
      ],
      "Error occurred while creating Snapshot for:%s": [
        "Beim Erzeugen des Snapshots ist ein Fehler aufgetreten: %s"
      ],
      "Created %{snapshots} for %{num} %{hosts}": [
        "%{snapshots} für %{num} %{hosts} erstellt"
      ],
      "Snapshot": [
        "Snapshot",
        "Snapshots"
      ],
      "host": [
        "Host",
        "Hosts"
      ],
      "No hosts were found with that id, name or query filter": [
        "Keine Hosts wurden mit dieser Kennung, Name oder Abfrage-Filter gefunden"
      ],
      "Something went wrong while selecting hosts - %s": [
        "Fehler beim Auswählen der Hosts – %s"
      ],
      "No capable hosts found.": [
        "Kein unterstützter Host gefunden."
      ],
      "Create Snapshot": [
        "Snapshot erstellen"
      ],
      "Name must contain at least 2 characters starting with alphabet. Valid characters are A-Z a-z 0-9 _": [
        "Der Name muss aus mindestens 2 Zeichen bestehen und mit einem Buchstaben beginnen. Gültige Zeichen: A-Z a-z 0-9 _"
      ],
      "Unable to create Proxmox Snapshot": [
        "Proxmox Snapshot konnte nicht erstellt werden"
      ],
      "Unable to remove Proxmox Snapshot": [
        "Proxmox Snapshot konnte nicht gelöscht werden"
      ],
      "Unable to revert Proxmox Snapshot": [
        "Proxmox Snapshot konnte nicht wiederhergestellt werden"
      ],
      "Snapshot name cannot be changed": [
        "Der Name des Snapshots kann nicht geändert werden"
      ],
      "Unable to update Proxmox Snapshot": [
        "Proxmox Snapshot konnte nicht aktualisiert werden"
      ],
      "Unable to create VMWare Snapshot with Quiesce. Check Power and VMWare Tools status.": [
        ""
      ],
      "Unable to create VMWare Snapshot. Cannot set both Memory and Quiesce options.": [
        ""
      ],
      "Unable to create VMWare Snapshot": [
        "VMWare Snapshot konnte nicht erstellt werden"
      ],
      "Unable to remove VMWare Snapshot": [
        "VMWare Snapshot konnte nicht gelöscht werden"
      ],
      "Unable to revert VMWare Snapshot": [
        "VMWare Snapshot konnte nicht wiederhergestellt werden"
      ],
      "Unable to update VMWare Snapshot": [
        "VMWare Snapshot konnte nicht aktualisiert werden"
      ],
      "No capable hosts selected": [
        "Keine unterstützten Hosts ausgewählt"
      ],
      "Description": [
        "Beschreibung"
      ],
      "Snapshot Mode": [
        ""
      ],
      "Select Snapshot Mode between mutually exclusive options, 'Memory' (includes RAM) and 'Quiesce'.": [
        ""
      ],
      "Loading Snapshots information ...": [
        "Lade Snapshot Informationen ..."
      ],
      "Snapshots": [
        "Snapshots"
      ],
      "Successfully removed Snapshot \\\"%s\\\" from host %s": [
        "Snapshot \\\"%s\\\" erfolgreich von Host %s entfernt."
      ],
      "Successfully updated Snapshot \\\"%s\\\"": [
        "Snapshot \\\"%s\\\" erfolgreich aktualisiert."
      ],
      "Error occurred while updating Snapshot: %s": [
        "Fehler beim Aktualisieren des Snapshots: %s"
      ],
      "Successfully rolled back Snapshot \\\"%s\\\" on host %s": [
        "Snapshot \\\"%s\\\" erfolgreich auf Host %s zurückgesetzt."
      ],
      "Memory": [
        ""
      ],
      "Quiesce": [
        ""
      ],
      "Snapshot successfully created!": [
        "Snapshot erfolgreich erzeugt!"
      ],
      "Name": [
        "Name"
      ],
      "Create Snapshot for %s": [
        "Snapshot anlegen für %s"
      ],
      "N/A": [
        "N/A"
      ],
      "Action": [
        "Aktion"
      ],
      "Failed to load snapshot list": [
        "Fehler beim Laden der Snapshotliste"
      ],
      "edit entry": [
        "Eintrag bearbeiten"
      ],
      "Rollback to \\\"%s\\\"?": [
        "\\\"%s\\\" wirklich wiederherstellen?"
      ],
      "Rollback": [
        "Wiederherstellen"
      ],
      "Delete Snapshot \\\"%s\\\"?": [
        "\\\"%s\\\" wirklich löschen?"
      ],
      "Delete": [
        "Löschen"
      ],
      "Foreman-plugin to manage snapshots in a virtual-hardware environments.": [
        "Ein Foremanplugin, welches Snapshots in Umgebungen mit virtueller Hardware nutzbar macht."
      ],
      "Include RAM": [
        "RAM einbeziehen"
      ]
    }
  }
};