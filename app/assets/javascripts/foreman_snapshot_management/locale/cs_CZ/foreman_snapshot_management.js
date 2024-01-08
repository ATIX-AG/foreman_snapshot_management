 locales['foreman_snapshot_management'] = locales['foreman_snapshot_management'] || {}; locales['foreman_snapshot_management']['cs_CZ'] = {
  "domain": "foreman_snapshot_management",
  "locale_data": {
    "foreman_snapshot_management": {
      "": {
        "Project-Id-Version": "foreman_snapshot_management 2.0.2",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2019-10-22 11:54+0000",
        "Last-Translator": "Pavel Borecki <pavel.borecki@gmail.com>, 2021",
        "Language-Team": "Czech (Czech Republic) (https://www.transifex.com/foreman/teams/114/cs_CZ/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "cs_CZ",
        "Plural-Forms": "nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;",
        "lang": "cs_CZ",
        "domain": "foreman_snapshot_management",
        "plural_forms": "nplurals=4; plural=(n == 1 && n % 1 == 0) ? 0 : (n >= 2 && n <= 4 && n % 1 == 0) ? 1: (n % 1 != 0 ) ? 2 : 3;"
      },
      "List all snapshots": [
        "Vypsat všechny zachycené stavy"
      ],
      "Name of this snapshot": [
        "Název tohoto zachyceného stavu"
      ],
      "Description of this snapshot": [
        ""
      ],
      "Create a snapshot": [
        "Pořídit zachycený stav"
      ],
      "Whether to include the RAM state in the snapshot": [
        "Zda v zachyceném stavu uložit i obsah operační paměti"
      ],
      "Whether to include the Quiesce state in the snapshot": [
        ""
      ],
      "Update a snapshot": [
        "Aktualizovat zachycený stav"
      ],
      "Delete a snapshot": [
        "Smazat zachycený stav"
      ],
      "Revert Host to a snapshot": [
        "Vrátit stroj do podoby ze zachyceného stavu"
      ],
      "Error occurred while creating Snapshot: %s": [
        "Při pořizování zachyceného stavu došlo k chybě: %s"
      ],
      "Error occurred while removing Snapshot: %s": [
        "Při odebírání zachyceného stavu došlo k chybě: %s"
      ],
      "VM successfully rolled back.": [
        ""
      ],
      "Error occurred while rolling back VM: %s": [
        ""
      ],
      "Failed to update Snapshot: %s": [
        "Zachycený stav se nepodařilo aktualizovat: %s"
      ],
      "Error occurred while creating Snapshot for:%s": [
        ""
      ],
      "Created %{snapshots} for %{num} %{hosts}": [
        "Vytvořeno %{snapshots} pro %{num} %{hosts}"
      ],
      "Snapshot": [
        "Zachycený stav",
        "Zachycené stavy",
        "Zachycených stavů",
        "Zachycené stavy"
      ],
      "host": [
        "",
        ""
      ],
      "No hosts were found with that id, name or query filter": [
        "Pro takový identifikátor, název nebo dotazovací filtr nebyly nalezeni žádní hostitelé"
      ],
      "Something went wrong while selecting hosts - %s": [
        "Při vybírání strojů se něco pokazilo – %s"
      ],
      "No capable hosts found.": [
        "Nenalezeny žádné schopné stroje."
      ],
      "Create Snapshot": [
        "Pořídit zachycený stav"
      ],
      "Name must contain at least 2 characters starting with alphabet. Valid characters are A-Z a-z 0-9 _": [
        ""
      ],
      "Unable to create Proxmox Snapshot": [
        "Nedaří se pořídit Proxmox zachycený stav"
      ],
      "Unable to remove Proxmox Snapshot": [
        "Nedaří se odebrat Proxmox zachycený stav"
      ],
      "Unable to revert Proxmox Snapshot": [
        "Nedaří se vrátit do podoby v Proxmox zachyceném stavu"
      ],
      "Snapshot name cannot be changed": [
        "Název zachyceného stavu není možné změnit"
      ],
      "Unable to update Proxmox Snapshot": [
        "Nedaří se aktualizovat Proxmox zachycený stav"
      ],
      "Unable to create VMWare Snapshot with Quiesce. Check Power and VMWare Tools status.": [
        ""
      ],
      "Unable to create VMWare Snapshot. Cannot set both Memory and Quiesce options.": [
        ""
      ],
      "Unable to create VMWare Snapshot": [
        "Nedaří se pořídit VMWare zachycený stav"
      ],
      "Unable to remove VMWare Snapshot": [
        "VMWare zachycený stav se nedaří odebrat"
      ],
      "Unable to revert VMWare Snapshot": [
        ""
      ],
      "Unable to update VMWare Snapshot": [
        "VMWare zachycený stav se nedaří zaktualizovat"
      ],
      "No capable hosts selected": [
        ""
      ],
      "Description": [
        "Popis"
      ],
      "Snapshot Mode": [
        ""
      ],
      "Select Snapshot Mode between mutually exclusive options, 'Memory' (includes RAM) and 'Quiesce'.": [
        ""
      ],
      "Loading Snapshots information ...": [
        "Načítání informací o zachycených stavech…"
      ],
      "Snapshots": [
        "Zachycené stavy"
      ],
      "Successfully removed Snapshot \\\"%s\\\" from host %s": [
        ""
      ],
      "Successfully updated Snapshot \\\"%s\\\"": [
        ""
      ],
      "Error occurred while updating Snapshot: %s": [
        ""
      ],
      "Successfully rolled back Snapshot \\\"%s\\\" on host %s": [
        ""
      ],
      "Memory": [
        ""
      ],
      "Quiesce": [
        ""
      ],
      "Snapshot successfully created!": [
        ""
      ],
      "Name": [
        "Název"
      ],
      "Create Snapshot for %s": [
        ""
      ],
      "N/A": [
        "Není"
      ],
      "Action": [
        "Akce"
      ],
      "Failed to load snapshot list": [
        ""
      ],
      "edit entry": [
        ""
      ],
      "Rollback to \\\"%s\\\"?": [
        ""
      ],
      "Rollback": [
        ""
      ],
      "Delete Snapshot \\\"%s\\\"?": [
        ""
      ],
      "Delete": [
        "Smazat"
      ],
      "Foreman-plugin to manage snapshots in a virtual-hardware environments.": [
        "Zásuvný modul do Foreman pro správu zachycených stavů v prostředí virtuálního hardware."
      ],
      "Include RAM": [
        "Včetně oper. paměti"
      ]
    }
  }
};