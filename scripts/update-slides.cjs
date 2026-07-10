const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

// 1. Remove Wedding Slide
const weddingSlideRegex = /\{\s*tag:\s*"CAPTURE YOUR LOVE STORY"[\s\S]*?\]\s*\},\s*/;
content = content.replace(weddingSlideRegex, '');

// 2. Change Studios Slide Image
content = content.replace(
  '"https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=600&q=80"',
  '"https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=800&q=80"'
);

// 3. Change Models Slide Image
content = content.replace(
  '"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"',
  '"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80"'
);

fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf8');
console.log('Successfully updated HomePage.jsx');
