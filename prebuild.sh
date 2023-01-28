#!/bin/sh

crails templates build \
  -r html \
  -i views \
  -t Crails::HtmlTemplate \
  -z crails/html_template.hpp \
  -n PluginHtmlRenderer \
  -p \.html$ \
  -v

mkdir -p build/javascripts
mkdir -p build/sass

webpack
cp javascripts/editor.js build/javascripts/editor.js

node_modules/.bin/sass -s compressed "stylesheets/layout.scss" > build/sass/layout.css
node_modules/.bin/sass -s compressed "stylesheets/admin.scss"  > build/sass/admin.css

crails-builtin-assets \
  --inputs "build/javascripts" "build/sass" \
  --output "lib/assets" \
  --classname "PluginAssets" \
  --compression "gzip" \
  --uri-root "/cms/plugins/materialize-layout/assets/"
