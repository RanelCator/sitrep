## Install PM2 on Windows Server

### 1. Install Node.js

Download the latest LTS version of [Node.js](https://nodejs.org?utm_source=chatgpt.com)

After installation, verify:

```powershell
node -v
npm -v
```

---

## 2. Open PowerShell as Administrator

Press:

```txt
Start Menu → PowerShell → Run as Administrator
```

---

## 3. Install PM2 globally

Run:

```powershell
npm install pm2@latest -g
```

Verify installation:

```powershell
pm2 -v
```

---

## 4. Go to your NestJS project

Example:

```powershell
cd C:\Projects\sitrep
```

---

## 5. Install project dependencies

```powershell
npm install
```

---

## 6. Build your NestJS app

```powershell
npm run build
```

This creates:

```txt
dist/main.js
```

---

## 7. Start NestJS using PM2

```powershell
pm2 start dist/main.js --name sitrep-api
```

Example output:

```txt
[PM2] App [sitrep-api] launched
```

---

## 8. Check if app is running

```powershell
pm2 list
```

You should see:

```txt
sitrep-api   online
```

---

## 9. View logs

```powershell
pm2 logs sitrep-api
```

---

## 10. Restart app after updates

```powershell
pm2 restart sitrep-api
```

---

# Auto-start PM2 after server reboot

Install Windows startup helper:

```powershell
npm install -g pm2-windows-startup
```

Then run:

```powershell
pm2-startup install
```

Save current PM2 processes:

```powershell
pm2 save
```

Now your NestJS app should automatically start after Windows Server reboot.

---

# Common PM2 Commands

## Stop app

```powershell
pm2 stop sitrep-api
```

## Delete app from PM2

```powershell
pm2 delete sitrep-api
```

## Restart all apps

```powershell
pm2 restart all
```

## Monitor CPU/RAM

```powershell
pm2 monit
```

---

# Better Production Start (Recommended)

Instead of:

```powershell
pm2 start dist/main.js --name pgas-api
```

Create:

## `ecosystem.config.js`

```js
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
```

Start using:

```powershell
pm2 start ecosystem.config.js
```

# Clean Guide: Deploy Vite Client to IIS

## 1. Go to your client folder

```powershell
cd D:\apps\sitrep-system\Client
```

## 2. Create `.env.production`

```env
VITE_BASE=/sitrep/
VITE_API_URL=http://localhost/sitrep_api
```

## 3. Build the client

```powershell
npm install
npm run build
```

After build, you should have:

```txt
Client\dist
```

## 4. Create IIS folder

```powershell
mkdir C:\inetpub\wwwroot\sitrep
```

## 5. Copy build files to IIS

Copy everything inside:

```txt
D:\apps\sitrep-system\Client\dist
```

to:

```txt
C:\inetpub\wwwroot\sitrep
```

## 6. Add `web.config`

Create this file:

```txt
C:\inetpub\wwwroot\sitrep\web.config
```

Content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Vite SPA Fallback" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/sitrep/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## 7. Browse

Open:

```txt
http://localhost/sitrep/
```

Production routes should work:

```txt
http://localhost/sitrep/login
http://localhost/sitrep/dashboard
```

## Update client later

```powershell
cd D:\apps\sitrep-system
git pull

cd Client
npm install
npm run build
```

Then replace files inside:

```txt
C:\inetpub\wwwroot\sitrep
```

with the new contents of:

```txt
Client\dist
```
