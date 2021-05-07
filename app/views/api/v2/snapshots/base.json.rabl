# frozen_string_literal: true

object @snapshot

attributes :id, :name

node(:formatted_created_at) { |snapshot| snapshot.create_time&.httpdate }
