# Bus Tracking System - Backend Spring Boot

## Description
Backend REST API pour le système de suivi de bus en temps réel, développé avec Spring Boot 3.2.

## Technologies utilisées
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** avec JWT
- **Spring Data JPA**
- **Spring WebSocket** pour le temps réel
- **MySQL** via MAMP
- **Lombok** pour réduire le boilerplate
- **Maven** pour la gestion des dépendances

## Structure du projet

```
backend/
├── src/main/java/com/bustracking/
│   ├── BusTrackingApplication.java     # Point d'entrée
│   ├── config/                         # Configurations
│   │   ├── SecurityConfig.java         # Sécurité Spring
│   │   ├── CorsConfig.java             # Configuration CORS
│   │   └── WebSocketConfig.java        # WebSocket/STOMP
│   ├── controller/                     # Contrôleurs REST
│   │   ├── AuthController.java
│   │   ├── BusController.java
│   │   ├── GpsController.java
│   │   ├── RouteController.java
│   │   ├── ScheduleController.java
│   │   ├── IncidentController.java
│   │   ├── MessageController.java
│   │   ├── TicketController.java
│   │   ├── UserController.java
│   │   └── WebSocketController.java
│   ├── dto/                            # Data Transfer Objects
│   │   ├── request/                    # DTOs de requête
│   │   └── response/                   # DTOs de réponse
│   ├── entity/                         # Entités JPA
│   │   ├── User.java
│   │   ├── Driver.java
│   │   ├── Bus.java
│   │   ├── Route.java
│   │   ├── RouteStop.java
│   │   ├── Schedule.java
│   │   ├── Ticket.java
│   │   ├── GpsTracking.java
│   │   ├── Incident.java
│   │   └── Message.java
│   ├── repository/                     # Repositories JPA
│   ├── service/                        # Services métier
│   ├── security/                       # Composants sécurité
│   │   ├── JwtService.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   ├── exception/                      # Gestion des exceptions
│   └── scheduler/                      # Tâches planifiées
└── src/main/resources/
    └── application.yml                 # Configuration
```

## Prérequis

- Java 17+
- Maven 3.8+
- MAMP avec MySQL
- Port 4000 disponible

## Installation

1. **Cloner le projet**
```bash
cd backend
```

2. **Configurer la base de données**
- Démarrer MAMP
- Créer la base de données `bus_tracking_system`

3. **Configurer l'application**
Modifier `src/main/resources/application.yml` si nécessaire :
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:8889/bus_tracking_system
    username: root
    password: root
```

4. **Compiler et lancer**
```bash
mvn clean install
mvn spring-boot:run
```

## API Endpoints

### Authentication
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/register` | Inscription |

### Buses
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/buses` | Liste des bus |
| GET | `/api/buses/{id}` | Détails d'un bus |
| POST | `/api/buses` | Créer un bus |
| PUT | `/api/buses/{id}` | Modifier un bus |
| DELETE | `/api/buses/{id}` | Supprimer un bus |

### GPS Tracking
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/gps/latest` | Dernières positions |
| GET | `/api/gps/bus/{id}/history` | Historique GPS |
| POST | `/api/gps/update` | Mise à jour position |

### Routes
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/routes` | Liste des routes |
| GET | `/api/routes/{id}` | Détails d'une route |
| POST | `/api/routes` | Créer une route |
| PUT | `/api/routes/{id}` | Modifier une route |
| DELETE | `/api/routes/{id}` | Supprimer une route |

### Users
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users` | Liste des utilisateurs |
| GET | `/api/users/{id}` | Détails d'un utilisateur |
| POST | `/api/users` | Créer un utilisateur |
| PUT | `/api/users/{id}` | Modifier un utilisateur |
| DELETE | `/api/users/{id}` | Supprimer un utilisateur |

## WebSocket

Connexion STOMP: `ws://localhost:4000/ws`

### Topics
- `/topic/gps-updates` - Mises à jour GPS de tous les bus
- `/topic/bus/{busId}` - Mises à jour d'un bus spécifique
- `/topic/messages/{userId}` - Messages en temps réel

### Messages entrants
- `/app/gps/update` - Envoyer une mise à jour GPS

## Sécurité

- Authentification JWT
- Tokens valides 7 jours
- Endpoints publics: `/api/auth/**`, `/health`
- Tous les autres endpoints nécessitent un token Bearer

## Exemple d'utilisation

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Récupérer les bus (authentifié)
```bash
curl http://localhost:4000/api/buses \
  -H "Authorization: Bearer <token>"
```

## Licence
MIT
