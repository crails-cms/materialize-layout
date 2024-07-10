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

npm install

node_modules/.bin/webpack
cp node_modules/@materializecss/materialize/dist/js/materialize.js build/javascripts/materialize.js
cp javascripts/editor.js build/javascripts/editor.js
cp stylesheets/ghpages-materialize.css build/sass/ghpages-materialize.css

node_modules/.bin/sass -I "node_modules/@materializecss" -s compressed "stylesheets/layout.scss" > build/sass/layout.css
node_modules/.bin/sass -I "node_modules/@materializecss" -s  compressed "stylesheets/admin.scss"  > build/sass/admin.css

crails-builtin-assets \
  --inputs "build/javascripts" "build/sass" \
  --output "lib/assets" \
  --classname "PluginAssets" \
  --compression "gzip" \
  --uri-root "/cms/plugins/materialize-layout/assets/"
