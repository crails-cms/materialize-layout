#include "style.hpp"
#include "lib/assets.hpp"
#include <crails/html_template.hpp>
#include <crails/utils/random_string.hpp>

using namespace std;
using namespace Crails;
using namespace Crails::Cms;

vector<string> PluginStyle::stylesheets() const
{
  return {
    "https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    PluginAssets::layout_css
  };
}

vector<string> PluginStyle::admin_stylesheets() const
{
  vector<string> base = stylesheets();

  base.push_back(PluginAssets::admin_css);
  return base;
}

std::string_view PluginStyle::admin_layout() const
{
  return "layouts/materialize/admin";
}

std::string_view PluginStyle::wizard_layout() const
{
  return "layouts/materialize/wizard";
}

static string render_menu_list(const Style& style, Data data, map<string,string> attributes = {});

static string render_menu_item(const Style& style, Data item)
{
  return HtmlTemplate::tag("li", {}, [&style, item]() -> string
  {
    Data children = item["children"];
    ClassList classes;
    stringstream html;
    map<string,string> attributes{
      {"href", item["href"].as<string>()},
      {"target", item["target"].as<string>()}
    };

    if (children.exists())
    {
      attributes.emplace("class", "dropdown-trigger");
      attributes.emplace("data-target", "dropdown-" + Crails::generate_random_string("abcdefg0123456789", 6));
    }
    html << HtmlTemplate::tag("a", attributes, [item]() -> string { return item["text"]; });
    if (children.exists())
    {
      html << render_menu_list(style, item["children"], {
        {"id", attributes["data-target"]},
        {"class", "dropdown-content"}
      });
    }
    return html.str();
  });
}

static string render_menu_list(const Style& style, Data data, map<string,string> attributes)
{
  auto yield = [&style, data]() -> string
  {
    stringstream html;

    data.each([&](Data item) -> bool
    {
      html << render_menu_item(style, item);
      return true;
    });
    return html.str();
  };
  auto class_it = attributes.find("class");

  if (class_it == attributes.end())
    attributes["class"] = "hide-on-med-and-down";
  return HtmlTemplate::tag("ul", attributes, yield);
}

string PluginStyle::render_menu(const Menu& menu, Menu::Direction direction, const ClassList& classlist, const string& header) const
{
  auto yield = [this, &menu, &header]() -> string
  {
    return HtmlTemplate::tag("span", {
        {"class", menu_heading_classes()}
      }, [&header]() -> string { return header; })
      + render_menu_list(*this, menu.get_data());
  };

  return HtmlTemplate::tag("nav", {
    {"class", classlist},
    {"data-name", menu.get_name()}
  }, yield);
}

string PluginStyle::section(int index, const map<string,string>& attrs, function<string()> yield) const
{
  map<string,string> section_attrs = attrs;
  string section_class = "container";

  if (section_attrs.count("class"))
    section_class += ' ' + section_attrs.at("class");
  section_attrs.insert_or_assign("class", section_class);
  return HtmlTemplate::tag("section", section_attrs, [&]() -> string
  {
    return HtmlTemplate::tag("div", {{"class","row wow animate__fadeInDown animate__1s"}}, yield);
  });
}

string PluginStyle::card(const map<string,string>& attrs, function<string()> yield) const
{
  map<string,string> card_attrs(attrs);
  string block_classes = "card-block pt-4 text-center";

  if (card_attrs.count("class"))
    card_attrs["class"] = block_classes + card_attrs["class"];
  else
    card_attrs["class"] = block_classes;
  return HtmlTemplate::tag("div", {{"class",card_classes()}}, [yield, card_attrs]() -> string
  {
    return HtmlTemplate::tag("div", card_attrs, yield);
  });
}

string PluginStyle::thumbnail(const ClassList& classes, const string& src) const
{
  return HtmlTemplate::tag("img", {
    {"src", src},
    {"class", classes + "img-avatar-circle"}
  });
}

string PluginStyle::breadcrumbs(const Crails::Cms::BreadcrumbsList& crumbs) const
{
  return "<nav style=\"text-align:center\">" +
  HtmlTemplate::tag("div", map<string,string>{{"class", menu_wrapper_classes(Cms::Menu::Horizontal)}}, [&]() -> string
  {
    return HtmlTemplate::tag("div", {{"class", "col s12"}}, [&crumbs]() -> string
    {
      string html;

      for (const auto& crumb : crumbs)
      {
        html += HtmlTemplate::tag("a", {{"class", "breadcrumb"}, {"href", crumb.first}}, [&crumb]() -> string
        {
          return crumb.second;
        });
      }
      return html;
    });
  }) + "</nav>";
}

string PluginStyle::javascript_on_content_loaded() const
{
  return
    "let elems = [];"
    "let mainForm = document.querySelector('#main-form');"
    "for (let elem of document.querySelectorAll('select')) {"
      "if (['tagPicker', 'fileTagPicker', 'userGroupPicker'].indexOf(elem.id) < 0) {"
        "M.FormSelect.init(elem, {});"
      "}"
    "}"
    "for (let elem of document.querySelectorAll('.dropdown-trigger')) {"
      "M.Dropdown.init(elem, {});"
    "}"
    "for (let elem of document.querySelectorAll('textarea')) {"
      "elem.classList.add('materialize-textarea');"
    "}"
    "for (let elem of document.querySelectorAll('[data-tooltip]')) {"
      "const tooltip = M.Tooltip.init(elem, { position: elem.dataset.tooltipPosition });"
      "elem.$tooltip = tooltip;"
    "}"
    "for (let elem of document.querySelectorAll('input[type=range]')) {"
      "M.Range.init(elem, {});"
    "}"
    "for (let elem of document.querySelectorAll('input[type=datetime-local]')) {"
      "if (elem.previousElementSibling && elem.previousElementSibling.tagName == 'LABEL') { elem.previousElementSibling.classList.add('active'); }"
    "}"
    "for (let elem of document.querySelectorAll('.input-field > label + input[type=checkbox]')) {"
      "const label = elem.previousElementSibling;"
      "const text = document.createElement('span');"
      "text.textContent = label.textContent;"
      "label.textContent = '';"
      "label.appendChild(elem);"
      "label.appendChild(text);"
      "label.style.position = 'relative';"
      "label.style.pointerEvents = 'all';"
      "label.parentElement.style.paddingBottom = '1em';"
      "label.addEventListener('click', function() { elem.checked = !elem.checked; });"
    "}"
    ;
}

string PluginStyle::javascript_on_content_unload() const
{
  return
    "let elems = [];"
    "for (let elem of document.querySelectorAll('[data-tooltip]')) {"
      "const tooltip = M.Tooltip.getInstance(elem);"
      "if (tooltip) { tooltip.destroy(); }"
    "}";
}
