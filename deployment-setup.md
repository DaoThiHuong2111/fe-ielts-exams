# Hướng dẫn cấu hình GitHub Actions Deploy

## 1. Cấu hình GitHub Secrets

Trong repository GitHub của bạn, vào **Settings > Secrets and variables > Actions** và thêm các secrets sau:

### Required Secrets:
- `VPS_HOST`: Địa chỉ IP hoặc domain của VPS Ubuntu
- `VPS_USERNAME`: Username để SSH vào VPS (thường là `ubuntu` hoặc `root`)
- `VPS_SSH_KEY`: Private SSH key để kết nối VPS
- `VPS_PORT`: Port SSH (mặc định là 22)

### Ví dụ:
```
VPS_HOST=192.168.1.100
VPS_USERNAME=ubuntu
VPS_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNza...
-----END OPENSSH PRIVATE KEY-----
VPS_PORT=22
```

## 2. Chuẩn bị VPS Ubuntu

### Cài đặt các dependency cần thiết:

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2 globally
sudo npm install pm2 -g

# Cài đặt Nginx (tùy chọn)
sudo apt install nginx -y

# Tạo thư mục cho ứng dụng
sudo mkdir -p /var/www/fe-ielts-exams
sudo chown -R $USER:$USER /var/www/fe-ielts-exams
```

### Cấu hình SSH Key:

```bash
# Tạo SSH key pair trên máy local
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key lên VPS
ssh-copy-id username@your-vps-ip

# Hoặc thêm manual vào ~/.ssh/authorized_keys trên VPS
```

## 3. Cấu hình Nginx (Tùy chọn)

Tạo file cấu hình Nginx:

```bash
sudo nano /etc/nginx/sites-available/fe-ielts-exams
```

Nội dung file:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt site:

```bash
sudo ln -s /etc/nginx/sites-available/fe-ielts-exams /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Test Deployment

1. Push code lên branch `staging`
2. Kiểm tra Actions tab trong GitHub repository
3. Kiểm tra ứng dụng tại `http://your-vps-ip:3001`

## 5. Các lệnh hữu ích trên VPS

```bash
# Kiểm tra trạng thái PM2
pm2 status

# Xem logs
pm2 logs fe-ielts-exams-staging

# Restart ứng dụng
pm2 restart fe-ielts-exams-staging

# Stop ứng dụng
pm2 stop fe-ielts-exams-staging

# Xem monitoring
pm2 monit
```

## 6. Troubleshooting

### Nếu deployment fail:
1. Kiểm tra GitHub Actions logs
2. SSH vào VPS và chạy: `pm2 logs fe-ielts-exams-staging`
3. Kiểm tra quyền truy cập thư mục: `ls -la /var/www/fe-ielts-exams`

### Nếu ứng dụng không start:
1. Kiểm tra Node.js version: `node --version`
2. Kiểm tra dependencies: `npm list`
3. Chạy manual: `cd /var/www/fe-ielts-exams && npm start`