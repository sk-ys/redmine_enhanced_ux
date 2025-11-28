require_dependency File.expand_path('../lib/enhanced_ux/hooks/view_layouts_base_html_head_hook.rb', __FILE__)

Redmine::Plugin.register :redmine_enhanced_ux do
  name 'Redmine Enhanced UX plugin'
  author 'sk-ys'
  description 'This is a plugin for Redmine. This plugin improves various aspects of the user experience in Redmine.'
  version '1.1.2'
  url 'https://github.com/sk-ys/redmine_enhanced_ux'
  author_url 'https://github.com/sk-ys'
    settings default: {
        custom_issue: '1',
        custom_issue_list: '1',
        enhanced_gantt_entry_click: '1',
        custom_gantt_chart: '1',
        custom_roadmap_and_version: '1',
        custom_calendar: '1',
        custom_issue_note_list: '1',
        copy_issue_form_link_with_data: '1',
        fixed_submit_button: '1',
        fuzzy_timestamps_formatter: '1',
        issue_attributes_to_link: '1',
        scroll_to_top_or_bottom: '1',
        add_copy_button_to_the_pre_block: '1',
        enhanced_list_button: '1',
        image_insertion_modal: '1',
        insert_attachment_tag: '1',
        responsive_table_scroll: '1',
        compact_notice_bar: '1',
        direct_edit_on_issue_list: '1',
        fix_tooltip_position: '1',
        popup_anywhere: '1',
        show_only_opened_issues: '1',
        simple_menu_bar: '1',
        two_pane_mode: '1',
        auto_reload: '1',
        fixes_for_rtl_design: '1',
        local_storage_manager: '1',
      },
      partial: 'settings/enhanced_ux_settings'
end
