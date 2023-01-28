cmake_minimum_required(VERSION 3.0)

project(materialize_layout_plugin)

find_package(PkgConfig)
pkg_check_modules(CRAILS_CMS REQUIRED libcrails-cms>=2.0.0)

include_directories(${CRAILS_CMS_INCLUDE_DIRS} .)

file(GLOB plugin_files
  src/*.cpp
  lib/*.cpp
  lib/renderers/*.cpp
  lib/renderers/html/*.cpp)

add_library(materialize_layout SHARED ${plugin_files})
set_property(TARGET materialize_layout PROPERTY ENABLE_EXPORTS ON)
target_link_libraries(materialize_layout ${CRAILS_CMS_LIBRARIES})
