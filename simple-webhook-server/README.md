# 🎣 Simple Webhook Server

Webhook server đơn giản với Express.js để tự động deploy từ GitHub.

## ✨ **Tính năng**

- ✅ Express.js server đơn giản  
- ✅ GitHub webhook signature verification
- ✅ Tự động Docker deployment
- ✅ Health check endpoint
- ✅ Basic logging

## 🚀 **Setup**

### 1. Cài đặt:
```bash
cd simple-webhook-server
npm install
```

### 2. Cấu hình:
```bash
cp .env.example .env
nano .env
```

### 3. File .env:
```env
PORT=3122
HOST=0.0.0.0
WEBHOOK_SECRET=your-super-secret-key-here
TARGET_BRANCH=staging
PROJECT_PATH=/var/www/fe-ielts-exams
```

## 🎯 **WEBHOOK_SECRET**

Đây là khóa bí mật để xác thực GitHub webhook:

### Tạo secret key:
```bash
# Tạo random key 32 ký tự
openssl rand -hex 32
# Hoặc
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Setup GitHub Webhook:
1. Vào **Repository > Settings > Webhooks**
2. **Add webhook**:
   - **Payload URL**: `https://your-domain.com/webhook`
   - **Content type**: `application/json`
   - **Secret**: Paste secret key từ .env
   - **Events**: Chọn `push`
   - **Active**: ✅

## 🏃 **Chạy server**

### Development:
```bash
npm run dev
```

### Production:
```bash
npm start
```

### Docker:
```bash
docker-compose up -d
```

## 📡 **API Endpoints**

### GET `/` - Server info
```json
{
  "name": "Simple Webhook Server",
  "status": "running",
  "config": {
    "targetBranch": "staging",
    "projectPath": "/var/www/fe-ielts-exams"
  }
}
```

### GET `/health` - Health check
```json
{
  "status": "healthy", 
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### POST `/webhook` - GitHub webhook
- Nhận push events từ GitHub
- Verify HMAC signature
- Deploy nếu push vào target branch

## 🔄 **Deployment Process**

1. **GitHub push** → Webhook gửi request
2. **Verify signature** → HMAC-SHA256 check
3. **Check branch** → Chỉ deploy target branch  
4. **Git pull** → Pull latest code
5. **Docker deploy**:
   - `docker-compose down`
   - `docker-compose build --no-cache`
   - `docker-compose up -d`
6. **Cleanup** → Remove old images

## 🐛 **Debug**

### Test webhook locally:
```bash
# Start server
npm start

# Test health check
curl http://localhost:3122/health

# Check logs
# Server sẽ log tất cả activities ra console
```

### GitHub webhook delivery:
- Vào **Settings > Webhooks** 
- Click webhook URL
- Xem **Recent Deliveries** để debug

## 📝 **VPS Setup**

### 1. Copy files lên VPS:
```bash
scp -r simple-webhook-server/ user@your-vps:/home/user/
```

### 2. Trên VPS:
```bash
cd simple-webhook-server
npm install
cp .env.example .env
nano .env  # Chỉnh sửa config

# Start với PM2
npm install -g pm2
pm2 start server.js --name "webhook-server"
pm2 save
pm2 startup
```

### 3. Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /webhook {
        proxy_pass http://localhost:3122;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 **Security**

- HMAC signature verification ngăn fake requests
- Chỉ process target branch
- Basic input validation
- Không hardcode secrets trong code

Đơn giản và hiệu quả! 🎉