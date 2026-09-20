require('dotenv').config({ path: '.env.local' });

async function testVariousPayloads() {
  const username = process.env.ICARRY_USERNAME?.trim();
  const key = process.env.ICARRY_API_KEY?.trim();

  console.log('Testing payload formats for iCarry api_login...');

  // Format 1: JSON { username, key }
  try {
    const res = await fetch('https://www.icarry.in/api_login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, key })
    });
    console.log('Format 1 (JSON):', await res.text());
  } catch (e) {
    console.error('Format 1 err:', e);
  }

  // Format 2: x-www-form-urlencoded { username, key }
  try {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('key', key);
    const res = await fetch('https://www.icarry.in/api_login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });
    console.log('Format 2 (Form URL Encoded):', await res.text());
  } catch (e) {
    console.error('Format 2 err:', e);
  }

  // Format 3: JSON with { email, api_key } or { username, api_key }
  try {
    const res = await fetch('https://www.icarry.in/api_login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, api_key: key })
    });
    console.log('Format 3 (api_key instead of key):', await res.text());
  } catch (e) {
    console.error('Format 3 err:', e);
  }
}

testVariousPayloads();
