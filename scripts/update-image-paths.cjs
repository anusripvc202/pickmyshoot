const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

content = content.replace(
  '"https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&w=800&q=80"',
  '"studio_gear_hero.png"'
);

content = content.replace(
  '"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80"',
  '"fashion_model_hero.png"'
);

fs.writeFileSync('src/pages/HomePage.jsx', content, 'utf8');
console.log('Successfully updated image paths in HomePage.jsx');
