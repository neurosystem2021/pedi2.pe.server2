const fs = require('fs');
const https = require('https');
const { iniciar } = require('./index');  // Importa la app de Express

// Opciones del certificado SSL de Let's Encrypt
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/pedi2.pe/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/pedi2.pe/fullchain.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/pedi2.pe/chain.pem'),
};

// Crear servidor HTTPS utilizando la aplicación Express ya configurada
const server = https.createServer(options, app);

// Definir el puerto HTTPS en el que se levantará el servidor
const port = 5000;

// Iniciar el servidor HTTPS
server.listen(port, () => {
  console.log(`Servidor HTTPS corriendo en el puerto ${port}`);
});
