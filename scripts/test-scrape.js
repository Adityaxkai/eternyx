const axios = require('axios');

async function testScrape() {
  const url = 'https://www.instagram.com/reel/DcEg5LMhh6M/';
  console.log('Fetching Instagram page:', url);
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });
    const html = response.data;
    
    const ogVideoMatch = html.match(/<meta[^>]*property="og:video"[^>]*content="([^"]*)"/i) || html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:video"/i);
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) || html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i);
    
    console.log('OG Video Match:', ogVideoMatch ? ogVideoMatch[1] : 'null');
    console.log('OG Image Match:', ogImageMatch ? ogImageMatch[1] : 'null');
  } catch (error) {
    console.error('Error fetching/scraping:', error.message);
  }
}

testScrape();
