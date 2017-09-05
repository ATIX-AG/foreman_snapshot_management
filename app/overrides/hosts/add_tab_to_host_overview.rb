# Add a Snapshots tab in the view of a host
Deface::Override.new(virtual_path: 'hosts/show',
                     name: 'add_host_snapshot_tab',
                     insert_bottom: 'ul',
                     partial: 'foreman_snapshot_management/hosts/snapshots_tab')

# Load content of Snapshots tab
Deface::Override.new(virtual_path: 'hosts/show',
                     name: 'add_host_snapshots_tab_content',
                     insert_bottom: 'div#myTabContent',
                     partial: 'foreman_snapshot_management/hosts/snapshots_tab_content')
