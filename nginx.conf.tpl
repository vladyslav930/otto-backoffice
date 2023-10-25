{# base config comes from base docker image #}
{% extends "nginx.conf.base.tpl" %}

{% set path_prefix = PATH_PREFIX -%}

{% block api_locations %}
{% endblock %}

{% block custom_locations %}
location {{ path_prefix }}/ping {
  access_log /dev/null;
  add_header Content-Type text/plain;
  return 200 "pong";
}
{% endblock %}
