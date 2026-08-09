---
layout: page
title: Contact
permalink: /contact/
---
# {{ site.data.portfolio.contact_page.title }}

{{ site.data.portfolio.contact_page.introductory_text }}

<dl class="contact-list">
  <dt>Email</dt>
  <dd><a href="mailto:{{ site.data.portfolio.contact_page.email_address }}">{{ site.data.portfolio.contact_page.email_address }}</a></dd>

  <dt>Phone</dt>
  <dd><a href="tel:{{ site.data.portfolio.contact_page.phone_number | remove: ' ' }}">{{ site.data.portfolio.contact_page.phone_number }}</a></dd>

  <dt>Location</dt>
  <dd>{{ site.data.portfolio.contact_page.location }}</dd>
</dl>

<p>
  <a class="btn btn-primary" href="{{ '/assets/documents/richard-barber-cv.pdf' | relative_url }}" download>Download CV (PDF)</a>
</p>
