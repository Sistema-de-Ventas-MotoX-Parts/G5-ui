#  Estructura y Capas del Proyecto

El sistema **MotoX Parts** fue desarrollado siguiendo una arquitectura por capas, permitiendo una clara separación de responsabilidades entre la interfaz de usuario, la lógica de negocio y el acceso a los datos. Este enfoque facilita el mantenimiento, la escalabilidad y la reutilización del código.

---

## Capa de Presentación (Frontend)

La capa de presentación está desarrollada utilizando **Angular** y **Tailwind CSS**.

### Funciones principales

* Mostrar información al usuario de manera dinámica.
* Gestionar formularios de carga y edición.
* Realizar validaciones básicas de datos.
* Consumir servicios REST del backend.
* Administrar la visualización de productos y categorías.

### Tecnologías utilizadas

* Angular
* TypeScript
* Tailwind CSS
* HTML5
* CSS3

---

##  Capa de Lógica de Negocio (Backend)

La lógica de negocio está implementada con **Spring Boot**, donde se procesan las solicitudes realizadas por el frontend y se aplican las reglas del sistema.

### Funciones principales

* Procesar solicitudes HTTP.
* Gestionar operaciones CRUD.
* Validar reglas de negocio.
* Coordinar la comunicación con la base de datos.
* Exponer servicios REST para el frontend.

---

## Capa de Acceso a Datos

La persistencia de datos se realiza mediante **Spring Data JPA**, permitiendo una interacción sencilla y eficiente con la base de datos.

### Funciones principales

* Guardar registros.
* Consultar información.
* Actualizar datos existentes.
* Eliminar registros.

### Repositorios

```java
public interface ProductRepository
        extends JpaRepository<Product, Long> {
}
```

```java
public interface CategoryRepository
        extends JpaRepository<Category, Long> {
}
```

---

# Modelo de Datos

## Categoría

Representa la clasificación de los productos dentro del sistema.

### Atributos

| Campo       | Descripción                 |
| ----------- | --------------------------- |
| id          | Identificador único         |
| nombre      | Nombre de la categoría      |
| descripcion | Descripción de la categoría |

---

## Producto

Representa un artículo comercializado por MotoX Parts.

### Atributos

| Campo       | Descripción                   |
| ----------- | ----------------------------- |
| id          | Identificador único           |
| nombre      | Nombre del producto           |
| descripcion | Descripción del producto      |
| precio      | Precio de venta               |
| stock       | Cantidad disponible           |
| imagenUrl   | URL de la imagen del producto |
| categoria   | Categoría asociada            |

---

# Flujo de Funcionamiento

El sistema sigue el siguiente flujo de comunicación:

1. El usuario realiza una acción desde la interfaz web.
2. Angular envía una solicitud HTTP al backend.
3. El Controller recibe la petición.
4. El Service procesa la lógica de negocio.
5. El Repository interactúa con la base de datos.
6. El backend devuelve una respuesta.
7. Angular actualiza la interfaz de usuario.

## Diagrama de Flujo

```text
Usuario
   │
   ▼
Angular (Frontend)
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Base de Datos
```

---

#  Beneficios de la Arquitectura

* Separación clara de responsabilidades.
* Código más organizado y mantenible.
* Escalabilidad para futuras funcionalidades.
* Fácil integración entre frontend y backend.
* Reutilización de componentes y servicios.
* Facilita la implementación de nuevas características como autenticación, reportes y gestión de usuarios.
