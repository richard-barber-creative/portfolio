---
layout: page
title: About
permalink: /about/
---
{% if site.data.portfolio.about_page.profile_image_url and site.data.portfolio.about_page.profile_image_url != "" %}
<img class="profile-image" src="{{ site.data.portfolio.about_page.profile_image_url | relative_url }}" alt="Portrait of Richard Barber">
{% endif %}

# {{ site.data.portfolio.about_page.title }}

{% for paragraph in site.data.portfolio.about_page.bio_paragraphs %}
{{ paragraph }}

{% endfor %}
