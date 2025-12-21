# Node.js 20 sürümünü kullan (Vite için uyumlu en güncel sürüm)
FROM node:20-alpine

WORKDIR /app

# Paket listesini kopyala
COPY package.json package-lock.json ./

# Önce temiz kurulum yap, sonra Tailwind v3 uyumlu paketleri zorla yükle
RUN npm install
RUN npm install -D tailwindcss@3.4.17 postcss autoprefixer

# Proje dosyalarını kopyala
COPY . .

# Vite'ı dışarıya açmak için host ayarı
ENV HOST=0.0.0.0

# Uygulamayı başlat
CMD ["npm", "run", "dev", "--", "--host"]