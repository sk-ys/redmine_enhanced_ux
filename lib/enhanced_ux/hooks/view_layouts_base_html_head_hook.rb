module EnhancedUx
  module Hooks
    class ViewLayoutsBaseHtmlHeadHook < Redmine::Hook::ViewListener
      def view_layouts_base_html_head(context={})
        if context[:request]
          controller = context[:controller]

          path = URI.parse(context[:request].instance_variable_get(:@fullpath)).path
          tags = []

          if /\/my\/account$/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:local_storage_manager] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/account/local_storage_manager')
            end
          end

          if /\/issues\/calendar$/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:custom_calendar] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/calendars/custom_calendar')
            end
          end

          if /\/issues\/gantt$/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:enhanced_gantt_entry_click] == '1'
              tags << javascript_include_tag("gantt/enhanced_gantt_entry_click", :plugin => "redmine_enhanced_ux")
            end
            if Setting.plugin_redmine_enhanced_ux[:custom_gantt_chart] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/gantts/custom_gantt_chart')
            end
          end

          if /\/issues\/([0-9]+|new|[0-9]+\/copy|[0-9]+\/edit)\/{0,1}$/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:custom_issue] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/issues/custom_issue')
            end
          end
          if /\/issues\/[0-9]+$/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:scroll_to_top_or_bottom] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/issues/scroll_to_top_or_bottom')
            end
            if Setting.plugin_redmine_enhanced_ux[:issue_attributes_to_link] == '1'
              tags << javascript_include_tag("issues/issue_attributes_to_link", :plugin => "redmine_enhanced_ux")
            end
          end

          if /\/issues$/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:custom_issue_list] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/issues/custom_issue_list')
            end
            if Setting.plugin_redmine_enhanced_ux[:fuzzy_timestamps_formatter] == '1'
              tags << javascript_include_tag("issues/fuzzy_timestamps_formatter", :plugin => "redmine_enhanced_ux")
            end
          end

          if /\/issue_note_list$/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:custom_issue_note_list] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/issue_note_list/custom_issue_note_list')
            end
          end

          if /\/(roadmap|versions\/[0-9]+$)/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:custom_roadmap_and_version] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/versions/custom_roadmap_and_version')
            end
          end

          if Setting.plugin_redmine_enhanced_ux[:compact_notice_bar] == '1'
            tags << controller.render_to_string(partial: 'enhanced_ux/layouts/compact_notice_bar')
          end
          if Setting.plugin_redmine_enhanced_ux[:direct_edit_on_issue_list] == '1'
            tags << controller.render_to_string(partial: 'enhanced_ux/layouts/direct_edit_on_issue_list')
          end
          if Setting.plugin_redmine_enhanced_ux[:popup_anywhere] == '1'
            tags << controller.render_to_string(partial: 'enhanced_ux/layouts/popup_anywhere')
          end
          if Setting.plugin_redmine_enhanced_ux[:show_only_opened_issues] == '1'
            tags << controller.render_to_string(partial: 'enhanced_ux/layouts/show_only_opened_issues')
          end
          if Setting.plugin_redmine_enhanced_ux[:simple_menu_bar] == '1'
            tags << controller.render_to_string(partial: 'enhanced_ux/layouts/simple_menu_bar')
          end
          if Setting.plugin_redmine_enhanced_ux[:fix_tooltip_position] == '1'
            tags << javascript_include_tag("fix_tooltip_position", :plugin => "redmine_enhanced_ux")
          end

          # Wiki
          if Setting.plugin_redmine_enhanced_ux[:add_copy_button_to_the_pre_block] == '1'
            tags << controller.render_to_string(partial: 'enhanced_ux/wiki/add_copy_button_to_the_pre_block')
          end
          if Setting.plugin_redmine_enhanced_ux[:enhanced_list_button] == '1'
            tags << javascript_include_tag("wiki/enhanced_list_button", :plugin => "redmine_enhanced_ux")
          end
          if Setting.plugin_redmine_enhanced_ux[:image_insertion_modal] == '1'
            tags << controller.render_to_string(partial: 'enhanced_ux/wiki/image_insertion_modal')
          end
          if Setting.plugin_redmine_enhanced_ux[:insert_attachment_tag] == '1'
            tags << javascript_include_tag("wiki/insert_attachment_tag", :plugin => "redmine_enhanced_ux")
          end
          if Setting.plugin_redmine_enhanced_ux[:responsive_table_scroll] == '1'
            tags << javascript_include_tag("wiki/responsive_table_scroll", :plugin => "redmine_enhanced_ux")
          end

          if /\/issues(|\/new|\/[0-9]+\/copy)$/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:copy_issue_form_link_with_data] == '1'
              tags << javascript_include_tag("issues/copy_issue_form_link_with_data", :plugin => "redmine_enhanced_ux")
            end
          end

          if /(\/issues($|\/gantt)|\/roadmap|\/issue_note_list|\/calendar|\/versions\/[0-9]+$)/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:two_pane_mode] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/layouts/two_pane_mode')
            end
          end
          if /(\/issues($|\/gantt)|\/roadmap|\/issue_note_list|\/calendar|\/versions\/[0-9]+$|\/activity|\/news)/.match?(path)
            if Setting.plugin_redmine_enhanced_ux[:auto_reload] == '1'
              tags << controller.render_to_string(partial: 'enhanced_ux/layouts/auto_reload')
            end
          end

          if Setting.plugin_redmine_enhanced_ux[:fixes_for_rtl_design] == '1'
            tags << stylesheet_link_tag("global/fixes_for_rtl_design", :plugin => "redmine_enhanced_ux", media: "all")
          end

          return tags.join('')
        else
          return ''
        end
      end
    end
  end
end
