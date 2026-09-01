const fs = require('fs');
const path = require('path');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
let data = '';

data += '--' + boundary + '\r\n';
data += 'Content-Disposition: form-data; name="name"\r\n\r\n';
data += 'TestCatImage\r\n';

data += '--' + boundary + '\r\n';
data += 'Content-Disposition: form-data; name="image"; filename="test.png"\r\n';
data += 'Content-Type: image/png\r\n\r\n';
data += 'fake image content\r\n';

data += '--' + boundary + '--\r\n';

fetch('http://localhost:5000/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary
  },
  body: data
}).then(res => res.json()).then(console.log).catch(console.error);
