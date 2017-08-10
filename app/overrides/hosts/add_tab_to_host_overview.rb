tab = "<%  if @host.provider == 'VMware' %>
        <li><a href='#snapshots' data-toggle='tab'><%= _('Snapshots') %></a></li>
       <% end %>"

tab_content = "<div id='snapshots' class='tab-pane'
                data-ajax-url='<%= host_snapshots_path(host_id: @host)%>'
                data-on-complete='onContentLoad'>
  <%= spinner(_('Loading Parameters information ...')) %>
</div>"

# Add a Snapshots tab in the view of a host
Deface::Override.new(virtual_path: 'hosts/show',
                     name: 'add_host_snapshot_tab',
                     insert_bottom: 'ul',
                     text: tab)

# Load content of Snapshots tab
Deface::Override.new(virtual_path: 'hosts/show',
                     name: 'add_host_snapshots_tab_content',
                     insert_bottom: 'div#myTabContent',
                     text: tab_content)
