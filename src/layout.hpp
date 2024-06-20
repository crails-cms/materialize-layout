#pragma once
#include <crails/cms/views/layout.hpp>
#include "style.hpp"

struct MaterializeLanding : public Crails::Cms::Layout
{
  MaterializeLanding();

  void use_admin_style() const override;
  const Crails::Cms::Style& get_style() const override { return style; }

  PluginStyle style;
};
