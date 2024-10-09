[![React Testing](https://github.com/ATIX-AG/foreman_snapshot_management/actions/workflows/react.yml/badge.svg)](https://github.com/ATIX-AG/foreman_snapshot_management/actions/workflows/react.yml)
[![Ruby Testing](https://github.com/ATIX-AG/foreman_snapshot_management/actions/workflows/ruby.yml/badge.svg)](https://github.com/ATIX-AG/foreman_snapshot_management/actions/workflows/ruby.yml)

# ForemanSnapshotManagement

ForemanSnapshotManagement is a Foreman plugin to manage snapshots.
As Hypervisor the following systems are supported:
- VMware vSphere
- [Proxmox](https://www.proxmox.com/)

## Features

- List existing snapshots of a virtual machine.
- Create a snapshot of a virtual machine.
- Revert existing virtual machines to a previously created snapshot.
- Remove existing snapshots of a virtual machine.

## Installation

You can install Foreman Snapshot Management plug-in using `foreman-installer`.
For more information, see [Installing the Snapshot Management Plug-in](https://docs.theforeman.org/nightly/Managing_Hosts/index-katello.html#Installing_the_Snapshot_Management_plugin_managing-hosts) in _Foreman documentation_.

## Compatibility

| Foreman Version | Plugin Version |
| --------------- | -------------- |
| >= 3.7          | >= 3.0.0       |
| >= 2.3          | >= 2.0.0       |
| 1.24            | >= 1.7.0       |
| 1.23            | >= 1.7.0       |
| 1.22            | >= 1.6.0       |
| 1.21            | >= 1.5.0       |
| 1.20            | >= 1.5.0       |
| 1.19            | >= 1.5.0       |
| 1.18            | >= 1.5.0       |
| 1.17            | >= 1.5.0       |

## Usage

You will get a new tab named "Snapshots" in the hosts page in Foreman.

Following rights are required to view snapshots:

- Snapshot Viewer
- Viewer

Following **additional** rights are required for creating, modifying, deleting and rollback:

- Snapshot Manger
- Site Manager

## API usage examples

Documentation for the api v2 endpoints provided by this Plugin can be found at `https://<your.foreman.installation>/apidoc/v2/snapshots.html`.
Some examples using `curl` and `jq` are given here.

The api user requires the same rights as a normal one.

### Environment

Environment variables used in this examples, edit to your needs.

```bash
FOREMAN="foreman.example.lan"            # fqdn or ip to foreman
AUTH="snapper:mysupersecretpassword123"  # foreman user
HOST="vm001.example.lan"                 # the servers name or id
```

### List all snapshots

```bash
curl -s -u "$AUTH" \
    -H 'Accept: application/json' \
    "https://${FOREMAN}/api/v2/hosts/${HOST}/snapshots" \
    | jq
```

```json
{
  "total": 2,
  "subtotal": 2,
  "page": 1,
  "per_page": 30,
  "search": null,
  "sort": {
    "by": null,
    "order": null
  },
  "results": [
    {
      "description": "",
      "id": "snapshot-646",
      "name": "clean",
      "created_at": "2018-10-08 08:07:30 UTC",
      "parent_id": null,
      "children_ids": [
        "snapshot-658"
      ]
    },
    {
      "description": "test",
      "id": "snapshot-658",
      "name": "test",
      "created_at": "2018-10-18 09:50:03 UTC",
      "parent_id": null,
      "children_ids": []
    }
  ]
}
```

### Show a snapshot

```bash
curl -s -u "$AUTH" \
    -H 'Accept: application/json' \
    "https://${FOREMAN}/api/v2/hosts/${HOST}/snapshots/${SNAP_ID}" \
    | jq
```

```json
{
  "description": "test",
  "id": "snapshot-658",
  "name": "test",
  "created_at": "2018-10-18 09:50:03 UTC",
  "parent_id": null,
  "children_ids": []
}
```

### Create a snapshot

```bash
curl -s -u "$AUTH" \
    -X POST \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data "{ \"name\": \"${SNAP_NAME}\", \"description\": \"${DESCRIPTION}\" }" \
    "https://${FOREMAN}/api/v2/hosts/${HOST}/snapshots" \
    | jq
```

```json
{
  "description": "A wonderful snapshot.",
  "id": null,
  "name": "wonderful",
  "created_at": null,
  "parent_id": null,
  "children_ids": []
}
```

### Delete a snapshot

```bash
curl -s -u "$AUTH" \
    -X DELETE \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    "https://${FOREMAN}/api/v2/hosts/${HOST}/snapshots/${SNAP_ID}" \
    | jq
```

```json
{
  "description": "A wonderful snapshot.",
  "id": null,
  "name": "wonderful",
  "created_at": "2018-10-19 07:03:37 UTC",
  "parent_id": null,
  "children_ids": []
}
```

### Update a snapshot

This updates only name and description, not the data.

```bash
curl -s -u "$AUTH" \
    -X PUT \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data "{ \"name\": \"${SNAP_NAME}\", \"description\": \"${DESCRIPTION}\" }" \
    "https://${FOREMAN}/api/v2/hosts/${HOST}/snapshots/${SNAP_ID}" \
    | jq
```

```json
{
  "description": "An exceptional snapshot.",
  "id": "snapshot-666",
  "name": "exceptional",
  "created_at": "2018-10-19 07:11:24 UTC",
  "parent_id": null,
  "children_ids": []
}
```

### Revert a snapshot

This request will block until the snapshot is reverted. Make sure to check your timeouts.

```bash
curl -s -u "$AUTH" \
    --max-time 600 \
    -X PUT \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    "https://${FOREMAN}/api/v2/hosts/${HOST}/snapshots/${SNAP_ID}/revert" \
    | jq
```

```json
{
  "description": "test",
  "id": "snapshot-658",
  "name": "test",
  "created_at": "2018-10-18 09:50:03 UTC",
  "parent_id": null,
  "children_ids": []
}
```

## Contributing

Fork and send a Pull Request. Thanks!

## Copyright
Copyright (c) 2024 ATIX AG - http://www.atix.de

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
