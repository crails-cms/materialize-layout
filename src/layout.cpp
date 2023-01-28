#include "layout.hpp"
#include "lib/assets.hpp"
#include "style.hpp"
#include <iostream>

MaterializeLanding::MaterializeLanding()
{
  name = "materialize";
  type = Crails::Cms::ComponentLayoutType;
  component_layout_name = "MaterialLandingLayoutEditor";
  stylesheets.push_back("https://fonts.googleapis.com/icon?family=Material+Icons");
  stylesheets.push_back(PluginAssets::layout_css);
  editor_stylesheets.push_back("https://fonts.googleapis.com/icon?family=Material+Icons");
  editor_stylesheets.push_back(PluginAssets::admin_css);
  editor_javascripts.push_back(PluginAssets::editor_js);
}

void MaterializeLanding::use_admin_style() const
{
  PluginStyle::singleton::initialize();
}
