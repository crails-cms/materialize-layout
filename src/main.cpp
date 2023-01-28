#include "layout.hpp"
#include "lib/assets.hpp"
#include "lib/renderers/plugin_html_renderer.hpp"
#include <fstream>

extern "C"
{
  Crails::BuiltinAssets* get_assets()
  {
    static PluginAssets assets;
    return &assets;
  }

  Crails::Renderer* get_html_renderer()
  {
    static PluginHtmlRenderer renderer;
    return &renderer;
  }

  Crails::Cms::Layout* create_layout()
  {
    return new MaterializeLanding();
  }
}
