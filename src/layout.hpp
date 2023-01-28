#pragma once
#include <crails/cms/views/layout.hpp>

struct MaterializeLanding : public Crails::Cms::Layout
{
  MaterializeLanding();

  void use_admin_style() const override;
};
