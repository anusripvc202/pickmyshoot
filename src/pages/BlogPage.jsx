import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  X, 
  ChevronRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_BLOGS = [
  {
    id: "blog-1",
    featured: true,
    title: "Mastering Studio Lighting on a Budget",
    category: "Lighting Guide",
    date: "June 18, 2026",
    readTime: "8 min read",
    excerpt: "Professional studio lights are expensive, but you don't need a multi-million budget to capture high-key, cinematic shots. Discover how DIY softboxes, speedlights, and reflector panels can achieve commercial results.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Ananya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      role: "Studio Director"
    },
    content: [
      "Lighting is the single most important element in photography. It defines mood, establishes depth, and reveals details that make an image pop. While high-end studio strobes and complex rigging are industry standard, they are often out of financial reach for budding creators.",
      "The secret to professional lighting is not the cost of the source, but how you shape the light. In this guide, we show you how to build a fully functional lighting kit for under ₹5,000 using inexpensive speedlights, transparent shower curtains for diffusion, and foam board reflectors.",
      "Step 1: The Key Light. Position your main speedlight at a 45-degree angle from your subject. Place a large DIY translucent diffusion panel in front of it to soften the harsh beams into a wrap-around glow.",
      "Step 2: Fill Light & Bounce. Instead of buying a second strobe, use a white foam board opposite the key light to bounce soft light back into the shadows. This retains depth while avoiding dark, contrasty pockets.",
      "Step 3: Background Separation. Place a small bare flash behind the subject, pointing toward the backdrop. This creates a halo/separation outline that isolates your subject and adds immediate depth to your portraiture."
    ]
  },
  {
    id: "blog-2",
    featured: false,
    title: "Ultimate Wedding Photography Gear Guide",
    category: "Gear Reviews",
    date: "June 15, 2026",
    readTime: "6 min read",
    excerpt: "From dual-slot camera bodies to fast prime lenses and high-speed memory cards. Here is the ultimate wedding day gear checklist that professional photographers rely on.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    author: {
      name: "Vikram Malhotra",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      role: "Lead Wedding Visualist"
    },
    content: [
      "Weddings are fast-paced, high-pressure environments where missing a fraction of a second means missing a once-in-a-lifetime emotion. To stay quick and reliable, a photographer's equipment setup needs to be highly specialized and redundant.",
      "First and foremost: dual-slot camera bodies. Never shoot a wedding on a camera with a single SD card slot. If a memory card corrupts during the ceremony, backup write capability is your only safety net.",
      "Lenses are next: a fast zoom like a 24-70mm f/2.8 is the workhorse for dynamic events, but having fast primes like a 50mm f/1.2 or 85mm f/1.4 is critical for stunning, bokeh-filled bridal portraits and low-light receptions.",
      "Always carry multiple extra batteries, dual battery chargers, and color-coded memory cards to ensure you never run out of storage space or power during crucial moments."
    ]
  },
  {
    id: "blog-3",
    featured: false,
    title: "E-Commerce Product Styling Essentials",
    category: "Tutorials",
    date: "June 10, 2026",
    readTime: "5 min read",
    excerpt: "Styling products for digital sales requires precision, clean styling backdrops, and macro-detailing. Learn how to configure simple tabletop layouts for fashion, cosmetics, and jewelry.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    author: {
      name: "Pooja Reddy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      role: "Commercial Stylist"
    },
    content: [
      "E-commerce product visuals represent a contract of expectations with the customer. If the texture, color, or shape looks inaccurate, it leads to high return rates. Styling commercial products requires careful attention to detail and color balancing.",
      "Tabletop setups should utilize simple pastel backdrops or a crisp cyc wall. When shooting reflective jewelry or cosmetics, use circular polarizing filters to block glare and reflections.",
      "Props should support, not distract. Use wooden blocks, stone pedestals, or acrylic shapes to raise products, creating interesting shadows and dimensional layers.",
      "Lastly, use macro lens adapters to capture fine textures like stitching on leather or font details on cosmetics labels."
    ]
  },
  {
    id: "blog-4",
    featured: false,
    title: "Outdoor Golden Hour Portrait Techniques",
    category: "Tutorials",
    date: "June 05, 2026",
    readTime: "7 min read",
    excerpt: "Golden hour offers the most gorgeous natural lighting. We breakdown backlight positioning, focus lock tips, and white balance settings to make portraits feel warm and romantic.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80",
    author: {
      name: "Ananya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      role: "Studio Director"
    },
    content: [
      "Golden hour occurs just after sunrise and right before sunset, when the sun is low in the sky, producing soft, warm, and highly directional light.",
      "To capture gorgeous flares, shoot directly toward the sun, letting the light spill around your subject's shoulders. This creates a shimmering rim-light effect that defines silhouettes.",
      "Ensure you manually adjust your white balance to 'Cloudy' or 'Shade' (around 6000K-6500K) to enhance the warm, amber tones of the golden rays, avoiding auto-white balance which might cool down the colors.",
      "Use collapsible gold/white reflector disks to bounce key light back into your subject's face, preventing dark silhouettes."
    ]
  },
  {
    id: "blog-5",
    featured: false,
    title: "Why Studios are Shifting to Creative Cohorts",
    category: "Creative Stories",
    date: "May 28, 2026",
    readTime: "4 min read",
    excerpt: "Independent creators are moving away from dry hire rentals and joining shared collaborative cohorts. Read about this shift in the creator marketplace.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    author: {
      name: "Amit Patel",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      role: "Platform Lead"
    },
    content: [
      "Creative professionals are realizing that high real estate overheads for dry space hire is a bottleneck. By joining creative cohorts, creators share costs for high-end gear and set setups, which fosters cross-collaboration.",
      "Our stats at PickMyShoot show a 40% increase in studios offering shared memberships where photographers, stylists, and editors share equipment lists.",
      "This shift creates a rich networking pool where photographers can source models and stylists inside their workspace, significantly accelerating production times."
    ]
  }
];

const BlogPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);
  const [likedArticles, setLikedArticles] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");

  const categories = ["All", "Lighting Guide", "Gear Reviews", "Tutorials", "Creative Stories"];

  const filteredBlogs = MOCK_BLOGS.filter(blog => {
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = MOCK_BLOGS.find(b => b.featured);
  const recentBlogs = filteredBlogs.filter(b => !b.featured || selectedCategory !== "All");

  return (
    <div className="blog-page-container">
      
      {/* Back to Home Navigation */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            fontSize: '13.5px',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Header section */}
      <div className="blog-header">
        <span style={{ 
          color: 'var(--primary)', 
          fontSize: '12px', 
          fontWeight: '800', 
          textTransform: 'uppercase', 
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <Sparkles size={13} />
          PickMyShoot Editorial
        </span>
        <h1 className="blog-title">The Creator's Focus</h1>
        <p className="blog-subtitle">Photography guides, studio setup tutorials, lighting cheat sheets, and industry insights curated by top professionals.</p>
      </div>

      {/* Filter and search row */}
      <div className="blog-tags-nav">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`blog-tag-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "All" ? "📚 View All" : cat}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        <input 
          type="text" 
          placeholder="Search articles, guides..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="footer-email-input"
          style={{ paddingLeft: '40px', background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
        />
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Featured Blog (Only shown when searching "All" and query is empty) */}
      {selectedCategory === "All" && !searchQuery && featuredBlog && (
        <div className="blog-featured-card" onClick={() => setActiveArticle(featuredBlog)}>
          <div className="blog-featured-img-wrap">
            <img src={featuredBlog.image} alt={featuredBlog.title} className="blog-featured-img" />
          </div>
          <div className="blog-featured-content">
            <span className="blog-featured-tag">{featuredBlog.category}</span>
            <h2 className="blog-featured-title">{featuredBlog.title}</h2>
            <p className="blog-featured-desc">{featuredBlog.excerpt}</p>
            <div className="blog-featured-footer">
              <div className="blog-author-row">
                <img src={featuredBlog.author.avatar} alt={featuredBlog.author.name} className="blog-author-img" />
                <div className="blog-author-info">
                  <span className="blog-author-name">{featuredBlog.author.name}</span>
                  <span className="blog-author-role">{featuredBlog.author.role}</span>
                </div>
              </div>
              <span className="blog-read-more-link">
                Read Article <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="blog-card-grid">
        {recentBlogs.map((blog) => (
          <div key={blog.id} className="blog-post-card" onClick={() => setActiveArticle(blog)}>
            <div className="blog-card-img-wrap">
              <img src={blog.image} alt={blog.title} className="blog-card-img" />
              <span className="blog-card-tag">{blog.category}</span>
            </div>
            <div className="blog-card-body">
              <div className="blog-card-meta">
                <Calendar size={12} />
                <span>{blog.date}</span>
                <span className="blog-card-meta-dot" />
                <Clock size={12} />
                <span>{blog.readTime}</span>
              </div>
              <h3 className="blog-card-title">{blog.title}</h3>
              <p className="blog-card-excerpt">{blog.excerpt}</p>
              <div className="blog-card-footer">
                <div className="blog-author-row">
                  <img src={blog.author.avatar} alt={blog.author.name} className="blog-author-img" />
                  <div className="blog-author-info">
                    <span className="blog-author-name">{blog.author.name}</span>
                    <span className="blog-author-role">{blog.author.role}</span>
                  </div>
                </div>
                <span className="blog-read-more-link">
                  Read <ChevronRight size={13} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recentBlogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3>No articles found</h3>
          <p>Try searching for other terms or selecting a different category.</p>
        </div>
      )}

      {/* Blog Article Reader Modal */}
      {activeArticle && (
        <div className="profile-modal-overlay" onClick={() => setActiveArticle(null)}>
          <div className="profile-modal-body blog-reader-body" onClick={(e) => e.stopPropagation()}>
            <div className="blog-reader-img-wrap">
              <img src={activeArticle.image} alt={activeArticle.title} className="blog-reader-img" />
              <button className="blog-reader-close-btn" onClick={() => setActiveArticle(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="blog-reader-content">
              <div className="blog-reader-meta-row">
                <span className="blog-featured-tag">{activeArticle.category}</span>
                <div className="blog-card-meta">
                  <Calendar size={12} />
                  <span>{activeArticle.date}</span>
                  <span className="blog-card-meta-dot" />
                  <Clock size={12} />
                  <span>{activeArticle.readTime}</span>
                </div>
              </div>
              <h2 className="blog-reader-title">{activeArticle.title}</h2>
              
              <div className="blog-author-row" style={{ margin: '4px 0 16px' }}>
                <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="blog-author-img" />
                <div className="blog-author-info">
                  <span className="blog-author-name">{activeArticle.author.name}</span>
                  <span className="blog-author-role">{activeArticle.author.role}</span>
                </div>
              </div>

              <div className="blog-reader-text">
                {activeArticle.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Interaction Section */}
              <div className="blog-interaction-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '24px' }}>
                <button 
                  className={`primary-btn ${likedArticles[activeArticle.id] ? 'liked' : ''}`}
                  onClick={() => setLikedArticles(prev => ({...prev, [activeArticle.id]: !prev[activeArticle.id]}))}
                  style={{ background: likedArticles[activeArticle.id] ? 'var(--primary)' : 'var(--bg-app)', color: likedArticles[activeArticle.id] ? 'white' : 'var(--text-main)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content' }}
                >
                  <Heart size={16} fill={likedArticles[activeArticle.id] ? 'white' : 'none'} />
                  {likedArticles[activeArticle.id] ? 'Liked' : 'Like Article'}
                </button>

                <div className="blog-comments-section" style={{ marginTop: '30px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-main)' }}>Comments</h3>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <input 
                      type="text" 
                      placeholder="Add a comment..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-main)' }}
                    />
                    <button 
                      onClick={() => {
                        if (newComment.trim()) {
                          setComments(prev => ({
                            ...prev, 
                            [activeArticle.id]: [...(prev[activeArticle.id] || []), newComment]
                          }));
                          setNewComment("");
                        }
                      }}
                      style={{ padding: '0 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Post
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(comments[activeArticle.id] || []).map((c, i) => (
                      <div key={i} style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '13px' }}>You</span>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{c}</p>
                      </div>
                    ))}
                    {!(comments[activeArticle.id] || []).length && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>No comments yet. Be the first to share your thoughts!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogPage;
