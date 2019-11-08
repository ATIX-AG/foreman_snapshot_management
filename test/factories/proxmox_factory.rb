# frozen_string_literal: true

FactoryBot.define do
  factory :proxmox_resource, :class => ComputeResource do
    sequence(:name) { |n| "compute_resource#{n}" }
    organizations { [Organization.find_by(name: 'Organization 1')] }
    locations { [Location.find_by(name: 'Location 1')] }

    trait :proxmox do
      provider { 'Proxmox' }
      user { 'root@pam' }
      password { 'proxmox01' }
      url { 'https://192.168.56.101:8006/api2/json' }
    end

    factory :proxmox_cr, :class => ForemanFogProxmox::Proxmox, :traits => [:proxmox]
  end
end
