const fs = require('fs');
const https = require('https');
const app = require('./index'); // Asegúrate de que 'index.js' exporte tu app de Express o lo que estés usando

// Carga de certificados SSL
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/pedi2.pe/fullchain.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/pedi2.pe/privkey.pem')
};

// Crear servidor HTTPS
https.createServer(options, app).listen(443, () => {
  console.log('Servidor HTTPS corriendo en el puerto 443');
});
