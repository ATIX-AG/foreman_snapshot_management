 locales['foreman_snapshot_management'] = locales['foreman_snapshot_management'] || {}; locales['foreman_snapshot_management']['fr'] = {
  "domain": "foreman_snapshot_management",
  "locale_data": {
    "foreman_snapshot_management": {
      "": {
        "Project-Id-Version": "foreman_snapshot_management 2.0.2",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2019-10-22 11:54+0000",
        "Last-Translator": "Amit Upadhye <aupadhye@redhat.com>, 2022",
        "Language-Team": "French (https://www.transifex.com/foreman/teams/114/fr/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "fr",
        "Plural-Forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;",
        "lang": "fr",
        "domain": "foreman_snapshot_management",
        "plural_forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;"
      },
      "List all snapshots": [
        "Liste de tous les instantanés"
      ],
      "Name of this snapshot": [
        "Nom de cet instantané"
      ],
      "Description of this snapshot": [
        "Description de cet instantané"
      ],
      "Create a snapshot": [
        "Créer un instantané"
      ],
      "Whether to include the RAM state in the snapshot": [
        "Inclure ou non l'état de la RAM dans l'instantané"
      ],
      "Whether to include the Quiesce state in the snapshot": [
        "Si l'état de repos doit être inclus dans l'instantané."
      ],
      "Update a snapshot": [
        "Mise à jour d'un instantané"
      ],
      "Delete a snapshot": [
        "Supprimer un instantané"
      ],
      "Revert Host to a snapshot": [
        "Revenir à un instantané de l'hôte"
      ],
      "Error occurred while creating Snapshot: %s": [
        "Une erreur s'est produite lors de la création de l’instantané : %s"
      ],
      "Error occurred while removing Snapshot: %s": [
        "Une erreur s'est produite lors de la suppression de l’instantané : %s"
      ],
      "VM successfully rolled back.": [
        "La VM a été reprise avec succès."
      ],
      "Error occurred while rolling back VM: %s": [
        "Une erreur s'est produite lors de la reprise de la VM : %s"
      ],
      "Failed to update Snapshot: %s": [
        "Échec de la mise à jour de l’instantané : %s"
      ],
      "Error occurred while creating Snapshot for:%s": [
        "Une erreur s'est produite lors de la création de l’instantané : %s"
      ],
      "Created %{snapshots} for %{num} %{hosts}": [
        "Créé %{snapshots} pour %{num} %{hosts}"
      ],
      "Snapshot": [
        "Instantané",
        "Instantanés",
        "Instantanés"
      ],
      "host": [
        "hôte",
        "hôtes",
        "hôtes"
      ],
      "No hosts were found with that id, name or query filter": [
        "Aucun hôte trouvé avec cet ID, ce nom ou filtre de requête"
      ],
      "Something went wrong while selecting hosts - %s": [
        "Une erreur s'est produite lors de la sélection des hôtes - %s"
      ],
      "No capable hosts found.": [
        "Aucun hôte capable n'a été trouvé."
      ],
      "Create Snapshot": [
        "Créer un instantané"
      ],
      "Name must contain at least 2 characters starting with alphabet. Valid characters are A-Z a-z 0-9 _": [
        "Le nom doit contenir au moins 2 caractères commençant par l'alphabet. Les caractères valides sont A-Z a-z 0-9 _"
      ],
      "Unable to create Proxmox Snapshot": [
        "Impossible de créer un instantané de Proxmox"
      ],
      "Unable to remove Proxmox Snapshot": [
        "Impossible de supprimer l’instantané de Proxmox"
      ],
      "Unable to revert Proxmox Snapshot": [
        "Impossible de rétablir l’instantané de Proxmox"
      ],
      "Snapshot name cannot be changed": [
        "Le nom de l’instantané ne peut pas être modifié"
      ],
      "Unable to update Proxmox Snapshot": [
        "Impossible de mettre à jour l’instantané de Proxmox"
      ],
      "Unable to create VMWare Snapshot with Quiesce. Check Power and VMWare Tools status.": [
        "Impossible de créer un instantané VMWare avec Quiesce. Vérifiez l'état de l'alimentation et des outils VMWare."
      ],
      "Unable to create VMWare Snapshot. Cannot set both Memory and Quiesce options.": [
        "Impossible de créer un instantané VMWare. Impossible de définir les options Mémoire et Quiesce."
      ],
      "Unable to create VMWare Snapshot": [
        "Impossible de créer un instantané VMWare"
      ],
      "Unable to remove VMWare Snapshot": [
        "Impossible de supprimer l’instantané VMWare"
      ],
      "Unable to revert VMWare Snapshot": [
        "Impossible de rétablir l’instantané VMWare"
      ],
      "Unable to update VMWare Snapshot": [
        "Impossible de mettre à jour l’instantané VMWare"
      ],
      "No capable hosts selected": [
        "Aucun hôte capable sélectionné"
      ],
      "Description": [
        "Description"
      ],
      "Snapshot Mode": [
        ""
      ],
      "Select Snapshot Mode between mutually exclusive options, 'Memory' (includes RAM) and 'Quiesce'.": [
        ""
      ],
      "Loading Snapshots information ...": [
        "Chargement des informations sur les instantanés ..."
      ],
      "Snapshots": [
        "Instantanés"
      ],
      "Successfully removed Snapshot \\\"%s\\\" from host %s": [
        "L’instantané \\\"%s\\\" a été supprimé de l'hôte. %s"
      ],
      "Successfully updated Snapshot \\\"%s\\\"": [
        "La mise à jour de l’instantané \\\"%s\\\" a réussi."
      ],
      "Error occurred while updating Snapshot: %s": [
        "Une erreur s'est produite lors de la mise à jour de l’instantané : %s"
      ],
      "Successfully rolled back Snapshot \\\"%s\\\" on host %s": [
        "L’instantané \\\"%s\\\" sur l'hôte %s a été retiré avec succès. "
      ],
      "Memory": [
        ""
      ],
      "Quiesce": [
        ""
      ],
      "Snapshot successfully created!": [
        "L’instantané a été créé avec succès."
      ],
      "Name": [
        "Nom"
      ],
      "Create Snapshot for %s": [
        "Créer un instantané pour %s"
      ],
      "N/A": [
        "Sans objet"
      ],
      "Action": [
        "Action"
      ],
      "Failed to load snapshot list": [
        "Échec du chargement de la liste des instantanés"
      ],
      "edit entry": [
        "Modifier la saisie"
      ],
      "Rollback to \\\"%s\\\"?": [
        "Retour à \\\"%s\\\" ?"
      ],
      "Rollback": [
        "Rollback"
      ],
      "Delete Snapshot \\\"%s\\\"?": [
        "Supprimer l'instantané \\\"%s\\\" ?"
      ],
      "Delete": [
        "Supprimer"
      ],
      "Foreman-plugin to manage snapshots in a virtual-hardware environments.": [
        "Plugin Foreman pour gérer les instantanés dans un environnement de matériel virtuel."
      ],
      "Include RAM": [
        "Inclure la RAM"
      ]
    }
  }
};