#include "style.hpp"
#include <crails/html_template.hpp>
#include <crails/utils/random_string.hpp>

using namespace std;
using namespace Crails;
using namespace Crails::Cms;

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

string PluginStyle::javascript_on_content_loaded() const
{
  return
    "let elems = [];"
    "for (let elem of document.querySelectorAll('select')) {"
      "if (['tagPicker', 'fileTagPicker'].indexOf(elem.id) < 0) {"
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
    ;
}
