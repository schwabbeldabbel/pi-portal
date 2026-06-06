Pi Portal Setup Guide on Raspberry Pi 5
This guide describes a production-style setup for an Nx monorepo with an Angular frontend and a NestJS backend on Raspberry Pi OS Lite. The frontend is built as static files and served by Nginx, while the backend is built to JavaScript and run as a persistent Node.js process with PM2.

Architecture
The target setup uses these build outputs:

Frontend: dist/web/browser

Backend: dist/api/main.js

Angular build artifacts are deployed as static files behind Nginx, and SPA routing is handled with try_files ... /index.html. NestJS is started from the compiled entry file instead of a development serve command.

Prerequisites
The Raspberry Pi should run Raspberry Pi OS Lite with network access and have Node.js and npm installed. Nginx is used to serve static files and reverse proxy API requests, and PM2 is used to keep the backend running and restore it after reboot.

Install the required packages:

bash
sudo apt update
sudo apt install -y nginx
sudo npm install -g pm2
PM2 supports saving the active process list and generating startup scripts for boot-time recovery.

Project deployment flow
The normal update flow on the Pi is:

Pull the latest repository changes.

Install dependencies.

Build frontend and backend.

Copy the frontend build to the Nginx web root.

Start or restart the backend with PM2.

Reload Nginx.

This separates development from runtime deployment, which is the standard approach for Angular static hosting and compiled NestJS execution.

Build the applications
From the monorepo root:

bash
cd ~/dein-monorepo
git pull
npm ci
npx nx build web
npx nx build api
Angular CLI and related builders write production output to the configured outputPath, and current Angular builds commonly place browser files in a browser subfolder.

Deploy the frontend
Create a directory for the frontend and copy the Angular build output into it:

bash
sudo mkdir -p /var/www/pi-portal
sudo rm -rf /var/www/pi-portal/*
sudo cp -r dist/web/browser/* /var/www/pi-portal/
Nginx serves files from the configured root directory, so this folder becomes the live frontend deployment directory.

Configure Nginx
Create a new Nginx site configuration:

bash
sudo nano /etc/nginx/sites-available/pi-portal
Use this configuration:

text
server {
    listen 80;
    server_name _;

    root /var/www/pi-portal;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
try_files $uri $uri/ /index.html; is the key SPA setting that makes Angular routes work when users refresh or directly open nested URLs. The server_name _; pattern works as a simple catch-all server block for access by IP or local hostname.

Enable the site and reload Nginx:

bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/pi-portal /etc/nginx/sites-enabled/pi-portal
sudo nginx -t
sudo systemctl reload nginx
Testing the Nginx configuration before reload is the standard safety step.

Start the backend with PM2
Because the backend build output is dist/api/main.js, start that file directly:

bash
cd ~/dein-monorepo
pm2 start dist/api/main.js --name pi-portal-api
pm2 save
Compiled NestJS applications are commonly run with node dist/main.js or the equivalent built entry file, rather than start:dev or serve. pm2 save persists the current process list so it can be restored later.

Enable backend autostart on reboot:

bash
pm2 startup
PM2 prints a sudo command after this step. Run that command exactly as shown, then save the process list again:

bash
pm2 save
Access the frontend
Once Nginx is active, the frontend is reachable from another device in the same network by using the Raspberry Pi IP address or local hostname in a browser, for example http://192.168.178.50 or often http://raspberrypi.local.

To find the Pi IP address locally:

bash
hostname -I
If Nginx listens on port 80, no explicit port is needed in the browser URL.

Verify the setup
Useful checks after deployment:

bash
systemctl status nginx
pm2 status
pm2 logs pi-portal-api
curl http://127.0.0.1:3000/api/health
curl http://127.0.0.1/api/health
The first backend curl checks NestJS directly on the local backend port, while the second checks the Nginx reverse proxy path.

Recommended frontend API usage
The frontend should call the backend via relative URLs such as /api/web/getWidgetData instead of hardcoding the Pi IP or backend port. This works cleanly with the Nginx reverse proxy and avoids environment-specific API URLs in Angular code.

Example Angular service method:

ts
getWidgetData(): Observable<FlatWidgetData[]> {
  return this.http.get<FlatWidgetData[]>('/api/web/getWidgetData');
}
Full update command sequence
For later updates, this is a practical full deployment sequence:

bash
cd ~/dein-monorepo
git pull
npm ci
npx nx build web
npx nx build api
sudo mkdir -p /var/www/pi-portal
sudo rm -rf /var/www/pi-portal/*
sudo cp -r dist/web/browser/* /var/www/pi-portal/
pm2 restart pi-portal-api || pm2 start dist/api/main.js --name pi-portal-api
pm2 save
sudo nginx -t
sudo systemctl reload nginx
This keeps the frontend and backend aligned with the latest repository state while using a production-style static frontend deployment and a persistent backend process.

Common issues
Angular routes return 404 after refresh
This usually means the Nginx server block is missing try_files $uri $uri/ /index.html;, which is required for SPA routing.

Frontend loads but API calls fail
This usually means either NestJS is not running on the expected port or the /api/ reverse proxy in Nginx is misconfigured.

Frontend files were copied from the wrong folder
If the Angular app does not load, verify that index.html exists in dist/web/browser. Recent Angular builds commonly use the browser subfolder for browser output.

Backend does not survive reboot
This usually means PM2 was started but the startup integration was not completed, or pm2 save was not run after the process was registered.