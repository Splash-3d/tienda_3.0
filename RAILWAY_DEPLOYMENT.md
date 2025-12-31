# 🚀 Guía de Despliegue en Railway - Tienda 3.0

## ⚙️ Variables de Entorno Obligatorias

En Railway.app, configura estas variables:

```env
NODE_ENV=production
JWT_SECRET=tu_secreto_super_secreto_unico_y_seguro_12345
PORT=5000
```

## 🔧 Verificación Post-Deploy

Una vez desplegado, verifica estos puntos:

### 1. **URL Principal**
- Visita: `https://tu-app.railway.app`
- ✅ Debe cargar la tienda con estética Shopify + Apple

### 2. **Panel Admin**
- Visita: `https://tu-app.railway.app/admin/login`
- Usuario: `admin@tienda.com`
- Contraseña: `admin123`
- ✅ Debe permitir login y mostrar el dashboard

### 3. **API Endpoints**
- `https://tu-app.railway.app/api/paginas` - Debe mostrar páginas
- `https://tu-app.railway.app/api/productos` - Debe mostrar productos
- ✅ Deben responder con JSON

### 4. **Funcionalidades Críticas**
- ✅ Navegación funciona
- ✅ Carrito agrega productos
- ✅ Panel admin crea/edita páginas
- ✅ Subida de imágenes funciona

## 🚨 Problemas Comunes y Soluciones

### **Error 502: Bad Gateway**
- Causa: Servidor no inició correctamente
- Solución: Revisa logs de Railway, verifica variables de entorno

### **Error 403: Forbidden**
- Causa: JWT_SECRET no configurado
- Solución: Agrega variable JWT_SECRET en Railway

### **Login no funciona**
- Causa: Token JWT inválido o expirado
- Solución: Verifica JWT_SECRET, limpia localStorage

### **Imágenes no cargan**
- Causa: Directorio uploads no creado
- Solución: El código lo crea automáticamente

### **Base de datos se reinicia**
- Causa: SQLite se resetea en cada deploy
- Solución: Considera PostgreSQL en Railway

## 📱 Acceso Móvil

Prueba en móvil:
- ✅ Responsive design funciona
- ✅ Touch interactions correctos
- ✅ Performance aceptable

## 🔒 Seguridad en Producción

- ✅ Helmet activado
- ✅ Rate limiting configurado
- ✅ CORS configurado
- ✅ JWT tokens seguros
- ⚠️ Cambiar contraseña admin por defecto

## 📊 Monitoreo

Revisa periódicamente:
- Logs de errores en Railway
- Performance de la API
- Uso de almacenamiento
- Tráfico de usuarios

## 🔄 Actualizaciones

Para actualizar la tienda:
1. Push a GitHub
2. Railway deploy automático
3. Verificar funcionalidades

---

**Importante**: La versión en Railway debe funcionar IGUAL o MEJOR que en local.
