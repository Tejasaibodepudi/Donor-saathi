async function test() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@demo.com', password: 'password', role: 'admin' })
  });
  
  const setCookie = loginRes.headers.get('set-cookie');
  console.log('Login Set-Cookie:', setCookie);
  
  const patchRes = await fetch('http://localhost:3000/api/blood-banks/bb_3', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': setCookie
    },
    body: JSON.stringify({ verified: true })
  });
  
  console.log('Patch Status:', patchRes.status);
  const text = await patchRes.text();
  console.log('Patch Response:', text);
}

test();
