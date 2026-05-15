---
title: Blog
layout: page
permalink: /blog/
---

# $ ls -la _posts/

Welcome to my digital notebook where I share thoughts, tutorials, and discoveries from my journey in technology and design.

## Recent Posts

{% if site.posts.size > 0 %}
  <div class="post-list">
    {% for post in site.posts %}
      <article class="post-preview">
        <h3><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h3>
        <div class="post-meta">
          <time>{{ post.date | date: "%B %-d, %Y" }}</time>
          {% if post.readingtime %}
            <span> • {{ post.readingtime }}</span>
          {% endif %}
          {% if post.tags.size > 0 %}
            <span> • 
              {% for tag in post.tags %}
                <span class="tag">#{{ tag }}</span>{% unless forloop.last %} {% endunless %}
              {% endfor %}
            </span>
          {% endif %}
        </div>
        {% if post.excerpt %}
          <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 200 }}</p>
        {% endif %}
        <a href="{{ post.url | relative_url }}" class="read-more">Read more →</a>
      </article>
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