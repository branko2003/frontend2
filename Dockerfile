# Usa la imagen oficial de Node como base
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para la instalación de dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todos los archivos al contenedor
COPY . .

# Construye la aplicación React
RUN npm run build

# Comando para iniciar la aplicación en producción
CMD ["npm", "start"]