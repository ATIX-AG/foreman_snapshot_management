Rails.application.routes.draw do
  constraints(host_id: %r{[^\/]+}) do
    resources :hosts, only: [] do
      resources :snapshots, module: 'foreman_snapshot_management' do
        member do
          put :revert
        end
      end
    end
  end
end
