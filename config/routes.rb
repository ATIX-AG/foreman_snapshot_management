# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api, :defaults => { :format => 'json' } do
    scope '(:apiv)', :module => :v2,
                     :defaults => { :apiv => 'v2' },
                     :apiv => /v1|v2/,
                     :constraints => ApiConstraints.new(:version => 2, :default => true) do
      constraints(:host_id => /[^\/]+/) do
        resources :hosts, :only => [] do
          constraints(:id => /[^\/]+/) do
            resources :snapshots, except: [:new, :edit] do
              member do
                put :revert
              end
            end
          end
        end
      end
    end
  end

  constraints(host_id: %r{[^\/]+}) do
    resources :hosts, only: [] do
      resources :snapshots, module: 'foreman_snapshot_management', only: [:index, :create, :destroy, :update] do
        member do
          put :revert
        end
      end
    end
  end
  resources :snapshots, module: 'foreman_snapshot_management', only: [] do
    collection do
      post :select_multiple_host
      post :create_multiple_host
    end
  end
end
