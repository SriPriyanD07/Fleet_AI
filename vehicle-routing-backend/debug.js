console.log('Starting debug...');
try {
  console.log('Trying to import express...');
  const express = require('express');
  console.log('Express imported successfully');
  const app = express();
  
  app.get('/', (req, res) => {
    console.log('Received request at /');
    res.send('Hello World!');
  });
  
  const PORT = 3002;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Try opening http://localhost:3002 in your browser');
  });
} catch (error) {
  console.error('Error occurred:', error);
}
