# WebServer + RestServer

Recuerden que deben ejecutar ```npm install``` para reconstruir los módulos de Node.

## Información.

Esta es una API Rest construida en NODE a través de express.js para la funcionalidad de una cafetería.

La API contiene todos los endpoint necesarios para las acciones CRUD de los siguientes modelos:

- Auth (Autenticación de usuarios).
- Categorias.
- Productos.
- Usuarios.

Para realizar el login de un usuario, se utilizó dos formas:
- JWT para la autenticación de usuarios, implementación propia de la API.
- Google SignIn para la autenticación de usuarios de forma externa.

Para el almacenamiento de información se utilizó MongoDB.

Además, se puede subir imágenes para los usuarios y productos, lo cual se hizo de dos formas:
- Guardando las imágenes en un directorio local de la aplicación.
- Guardando las imágenes en Cloudinary, esto debido a que ciertos servicios hosting como Herouku, eliminan los archivos que no corresponden al directorio del repositorio, por esto se optó por implementar otro servicio que almacene las imágenes en un servidor externo.