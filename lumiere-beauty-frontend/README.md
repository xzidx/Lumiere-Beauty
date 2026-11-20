# Lumiere Beauty – Backend API

A RESTful backend API for Lumiere Beauty, a multi-brand cosmetics shop. Developed using Spring Boot and PostgreSQL for Brief 15 – WMAD G3 2026.

## Technologies

- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Maven
- Postman

## Features

- User Management
- Product Management
- Brand Management
- Category Management
- Address Management
- Cart Management
- Order Management
- Payment Management

## Project Structure

```text
src/main/java/com/lumiere/lumiere_beauty/
├── controller/
├── model/
├── repository/
└── service/

src/main/resources/
└── application.properties
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/xzidx/Lumiere-Beauty.git
cd lumiere-beauty-backend
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named:

```sql
CREATE DATABASE lumiere_beauty;
```

Update your `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lumiere_beauty
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3. Run the Application

```bash
./mvnw spring-boot:run
```

The API will be available at:

`http://localhost:8080`

## API Endpoints

Base URL: `http://localhost:8080/api`

| Module | Endpoint |
|---|---|
| Users | `/users` |
| Products | `/products` |
| Brands | `/brands` |
| Categories | `/categories` |
| Addresses | `/addresses` |
| Carts | `/carts` |
| Orders | `/orders` |
| Payments | `/payments` |

Available HTTP methods depend on each controller:

- `GET` – Retrieve data
- `POST` – Create data
- `PUT` – Update data
- `DELETE` – Delete data

## Postman API Testing

Postman is used to test the API endpoints and verify their responses.

The Postman Collection and testing screenshots are provided below.

- **Postman Collection/Testing Evidence:** `https://docs.google.com/document/d/1iyTcMrETUvsf67PJ8H_Qfm4417rI-WZ1JjuN3l8igTc/edit?usp=sharing`


## Project Information

| Detail | Description |
|---|---|
| Assignment | Brief 15 – Backend API for a Cosmetics Shop |
| Class | WMAD G3 2026 |
| Company | Flash Solution |
| Client | Kim MinJuu |
| Project | Lumiere Beauty |

## Author

WMAD G3 2026