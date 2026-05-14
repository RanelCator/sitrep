module.exports = {
  apps: [
    {
      name: 'sitrep-api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
}