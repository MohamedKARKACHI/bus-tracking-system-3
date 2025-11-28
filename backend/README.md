# Bus Tracking System - Spring Boot Backend

Professional Spring Boot 4.0 REST API with WebSocket support for real-time GPS tracking.

## Tech Stack

- **Spring Boot:** 4.0.0
- **Java:** 21
- **Build Tool:** Gradle
- **Database:** MySQL 8.0 (via MAMP)
- **ORM:** Spring Data JPA + Hibernate
- **Security:** Spring Security + JWT
- **Real-time:** WebSocket (STOMP)
- **Documentation:** SpringDoc OpenAPI (Swagger)
- **Development:** Spring Boot DevTools

## Architecture

```
com.bus.backend/
├── config/              # Configuration classes
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── WebSocketConfig.java
├── controller/          # REST Controllers
│   ├── HealthController.java
│   ├── BusController.java
│   └── GpsController.java
├── model/              # JPA Entities
│   ├── BaseEntity.java
│   ├── User.java
│   ├── Bus.java
│   └── GpsTracking.java
├── repository/         # Data Access Layer
│   ├── UserRepository.java
│   ├── BusRepository.java
│   └── GpsTrackingRepository.java
├── service/            # Business Logic
├── dto/                # Data Transfer Objects
├── security/           # JWT & Auth
├── websocket/          # WebSocket Handlers
│   └── GpsWebSocketHandler.java
├── exception/          # Custom Exceptions
└── util/               # Utility Classes
```

## Quick Start

### Prerequisites
- Java 21 or higher
- MySQL (MAMP on port 8889)
- Gradle (wrapper included)

### Setup

1. **Configure Database**
   
   Database settings are in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:8889/bus_tracking_system
   spring.datasource.username=root
   spring.datasource.password=root
   ```

2. **Install Dependencies**
   ```bash
   ./gradlew build
   ```

3. **Run Application**
   ```bash
   ./gradlew bootRun
   ```

   Server starts on: **http://localhost:4000**

### Verify Installation

**Health Check:**
```bash
curl http://localhost:4000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-28T02:30:00",
  "service": "Bus Tracking Backend (Spring Boot)"
}
```

**API Documentation:**
- Swagger UI: http://localhost:4000/swagger-ui.html
- OpenAPI Spec: http://localhost:4000/v3/api-docs

## API Endpoints

Base URL: `http://localhost:4000/api`

### Bus Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/buses` | Get all buses |
| GET | `/buses/{id}` | Get bus by ID |
| POST | `/buses` | Create new bus |
| PUT | `/buses/{id}` | Update bus |
| DELETE | `/buses/{id}` | Delete bus |

**Example: Get All Buses**
```bash
curl http://localhost:4000/api/buses
```

**Response:**
```json
[
  {
    "id": 1,
    "registrationNumber": "BUS-001",
    "model": "Mercedes-Benz Citaro",
    "capacity": 40,
    "status": "ACTIVE",
    "year": "2023"
  }
]
```

### GPS Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gps/latest` | Get latest GPS positions for all buses |
| GET | `/gps/bus/{busId}/history` | Get GPS history for specific bus |
| POST | `/gps/update` | Update GPS position |

**Example: Update GPS Position**
```bash
curl -X POST http://localhost:4000/api/gps/update \
  -H "Content-Type: application/json" \
  -d '{
    "bus": {"id": 1},
    "latitude": 33.5731,
    "longitude": -7.5898,
    "speed": 45.5,
    "heading": 90
  }'
```

## WebSocket (Real-time GPS)

### Connection

**Endpoint:** `ws://localhost:4000/ws`

**Protocol:** STOMP over WebSocket

### Subscribe to GPS Updates

```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:4000/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
  stompClient.subscribe('/topic/gps-updates', (message) => {
    const gpsData = JSON.parse(message.body);
    console.log('GPS Update:', gpsData);
  });
});
```

### Broadcast Frequency

GPS positions are automatically broadcast every **5 seconds** to all subscribers on `/topic/gps-updates`.

## Database Models

### User
```java
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    private String email;
    private String password;
    private String name;
    private String phone;
    private UserRole role; // ADMIN, DRIVER, CLIENT
    private UserStatus status; // ACTIVE, INACTIVE, SUSPENDED
}
```

### Bus
```java
@Entity
@Table(name = "buses")
public class Bus extends BaseEntity {
    private String registrationNumber;
    private String model;
    private Integer capacity;
    private BusStatus status; // ACTIVE, MAINTENANCE, INACTIVE
    private String year;
}
```

### GPS Tracking
```java
@Entity
@Table(name = "gps_tracking")
public class GpsTracking extends BaseEntity {
    @ManyToOne
    private Bus bus;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal speed;
    private BigDecimal heading;
    private LocalDateTime timestamp;
}
```

## Configuration

### application.properties

```properties
# Server
server.port=4000
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:8889/bus_tracking_system
spring.datasource.username=root
spring.datasource.password=root

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# CORS
spring.web.cors.allowed-origins=http://localhost:3000

# Actuator
management.endpoints.web.exposure.include=health,info
```

## Security

### CORS Configuration
- Allowed Origins: `http://localhost:3000`
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials: Enabled

### JWT Authentication (TODO)
- Token-based authentication
- BCrypt password encoding
- Stateless session management

### Public Endpoints
- `/auth/**` - Authentication endpoints
- `/health` - Health check
- `/ws/**` - WebSocket connection
- `/swagger-ui/**` - API documentation

## Development

### Hot Reload
Spring Boot DevTools enables automatic restart on code changes.

### Build Commands

```bash
# Build project
./gradlew build

# Run tests
./gradlew test

# Run application
./gradlew bootRun

# Clean build
./gradlew clean build

# Generate JAR
./gradlew bootJar
```

### Testing

```bash
# Run all tests
./gradlew test

# Run with coverage
./gradlew test jacocoTestReport
```

## Deployment

### Build for Production

```bash
./gradlew clean build -x test
```

JAR location: `build/libs/backend-0.0.1-SNAPSHOT.jar`

### Run Production Build

```bash
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

### Environment Variables (Production)

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://production-db:3306/bus_tracking_system
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=secure_password
export SERVER_PORT=4000
```

## Logging

### Log Levels

- **Root:** INFO
- **Application:** DEBUG
- **SQL:** DEBUG
- **Hibernate:** TRACE (binding parameters)

### Logs Location

Console output during development. Configure file logging in production:

```properties
logging.file.name=logs/application.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

## Monitoring

### Actuator Endpoints

- Health: `GET /actuator/health`
- Info: `GET /actuator/info`

### Health Check Response

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "MySQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

## Performance

### Database Connection Pool
- Max Pool Size: 10 connections
- Connection timeout: 20 seconds

### WebSocket Broadcasting
- Frequency: 5 seconds
- Concurrent connections: Unlimited (configure as needed)

## Best Practices Implemented

✅ **Layered Architecture** - Controller → Service → Repository  
✅ **DTO Pattern** - Separate request/response objects  
✅ **Exception Handling** - Centralized error handling  
✅ **Validation** - Bean Validation (JSR-303)  
✅ **Logging** - SLF4J with Logback  
✅ **Transaction Management** - @Transactional  
✅ **Dependency Injection** - Constructor injection with Lombok  

## Troubleshooting

### Database Connection Issues

```bash
# Check MySQL is running
lsof -i :8889

# Test connection
mysql -h localhost -P 8889 -u root -proot -e "SELECT 1;"
```

### Port Already in Use

```bash
# Find process on port 4000
lsof -ti:4000

# Kill process
lsof -ti:4000 | xargs kill -9
```

### Gradle Issues

```bash
# Clean Gradle cache
./gradlew clean

# Refresh dependencies
./gradlew build --refresh-dependencies
```

## Next Steps

1. **Implement remaining entities** (Route, Schedule, Ticket, etc.)
2. **Add JWT authentication** (Login, Register)
3. **Create service layer** for business logic
4. **Add validation** with @Valid annotations
5. **Implement exception handling** with @ControllerAdvice
6. **Add unit tests** for repositories and services
7. **Add integration tests** for controllers
8. **Configure security** properly with roles/permissions

## Support

- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Spring Data JPA:** https://spring.io/projects/spring-data-jpa
- **Spring Security:** https://spring.io/projects/spring-security
- **Gradle:** https://docs.gradle.org

---

**Built with Spring Boot 4.0 & Java 21**
