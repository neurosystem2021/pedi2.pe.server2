module.exports = {
  apps : [{
    name: 'api-pedi2',
    script: 'index.js',
    exec_mode: 'fork',
    instances: 'max', // O el número de instancias que desees
    env: {
      NODE_ENV: 'production'
    },
    env_production : {
      NODE_ENV: 'production'
    },
    // ... otras opciones
    args: '--key /etc/letsencrypt/live/pedi2.pe/cert.pem --cert /etc/letsencrypt/live/pedi2.pe/chain.pem'
  }]
};
