#pragma once
#include <crails/cms/views/style.hpp>

class PluginStyle : public Crails::Cms::Style
{
  typedef Crails::Cms::ClassList ClassList;
  typedef Crails::Cms::Menu Menu;

  SINGLETON_IMPLEMENTATION(PluginStyle, Crails::Cms::Style)
public:
  ClassList menu_wrapper_classes(Menu::Direction) const override { return {"nav-wrapper"}; }
  ClassList menu_heading_classes() const override { return {"brand-logo"}; }
  ClassList menu_classes() const override { return {"hide-on-med-and-down"}; }
  ClassList menu_item_classes() const override { return {}; }
  ClassList menu_active_item_classes() const override { return {"active"}; }
  ClassList menu_link_classes() const override { return {"waves-effect"}; }
  ClassList menu_item_with_children_classes() const override { return {}; }
  ClassList menu_children_classes() const override { return {"dropdown-content"}; }
  ClassList form_classes() const override { return {}; }
  ClassList form_group_classes() const override { return {"input-field"}; }
  ClassList button_classes() const override { return {"btn", "waves-effect"}; }
  ClassList active_button_classes() const override { return button_classes() - "btn" + "btn-flat"; }
  ClassList confirm_button_classes() const override { return button_classes() + "green"; }
  ClassList danger_button_classes() const override { return button_classes() + "red"; }
  ClassList button_group_classes() const override { return {"btn-group"}; }
  ClassList small_button_classes() const override { return {"btn-small", "waves-effect"}; }
  ClassList table_classes() const override { return {"striped", "responsive-table"}; }
  ClassList modal_classes() const override { return {"modal"}; }
  ClassList modal_content_classes() const override { return {"modal-content"}; }
  ClassList modal_controls_classes() const override { return {"modal-footer"}; }
  ClassList badge_classes() const override { return {"new", "badge"}; }
  ClassList collection_classes() const override { return {"collection"}; }
  ClassList collection_item_classes() const override { return {"collection-item"}; }

  std::string render_menu(const Crails::Cms::Menu& menu, Crails::Cms::Menu::Direction direction, const Crails::Cms::ClassList& classlist, const std::string& header) const override;

  std::string javascript_on_content_loaded() const override;
};
