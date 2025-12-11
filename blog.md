---
title: Blog
layout: page
permalink: /blog/
---

<div class="blog-hero">
  <span class="blog-hero__divider" aria-hidden="true"></span>
  <h1 class="blog-hero__title">DEEBOT’S BLOG!</h1>
  <span class="blog-hero__divider" aria-hidden="true"></span>
  <p class="blog-hero__intro">Welcome to my digital notebook where I share thoughts, tutorials, and discoveries from my journey in technology and design.</p>
</div>

## Recent Posts

{% if site.posts.size > 0 %}
  <div class="post-list post-list--with-excerpts">
    {% for post in site.posts %}
      {% include post-card.html post=post show_excerpt=true %}
    {% endfor %}
  </div>
{% else %}
  <div class="empty-state">
    <p>$ find _posts/ -name "*.md" | wc -l</p>
    <p>0</p>
    <br>
    <p>No posts found. Content is loading... Check back soon!</p>
  </div>
{% endif %}

## Topics I Write About

```bash
$ grep -r "topics" blog_content.txt
```

- **Web Development**: Frontend and backend technologies, best practices
- **Student Life**: Experiences studying in Germany, university insights  
- **Career**: Working at dSPACE, internships, job search tips
- **Tools & Workflow**: Developer productivity, cool tools I discover
- **Learning**: Tutorials, guides, and resources I find helpful
- **Technology**: Latest trends, framework comparisons, industry insights

## $ echo "Stay Connected"

Want to stay updated with my latest posts? 
- [RSS Feed](/feed.xml) 
- [GitHub](https://github.com/DheiryaBhatt)
- [Follow on social media](/contact/)

---

*Have a topic suggestion or want to collaborate on content? [Let me know](/contact/)!*
