# 🔐 Security Implementation Guide

## Overview
This document outlines all security measures implemented in the Bus Tracking System.

## ✅ Implemented Security Features

### 1. **Authentication & Authorization**

#### JWT Token Security
- **Strong JWT Secret**: Auto-generated 512-bit secret key stored in `.env.local`
- **Token Expiration**: 7 days (configurable in `lib/auth.ts`)
- **Required Environment Variable**: Application fails to start without `JWT_SECRET`
- **Token Verification**: All protected routes verify JWT signatures

#### Password Security
- **Hashing**: bcrypt with 10 rounds (industry standard)
- **Validation Requirements**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- **No Weak Passwords**: Registration rejects simple passwords

#### Role-Based Access Control (RBAC)
```typescript
// Admin-only routes
GET/POST /api/drivers     → Admin only
GET/POST /api/buses       → Admin only (POST)

// Admin + Client routes
GET/POST /api/tickets     → Admin + Client

// All authenticated users
GET/POST /api/messages    → All authenticated
GET /api/buses            → All authenticated
```

### 2. **Input Validation & Sanitization**

#### Zod Schema Validation
- **Email Format**: Validated against RFC 5322 standard
- **Phone Numbers**: International format validation
- **XSS Prevention**: Sanitization removes `<>`, `javascript:`, event handlers
- **Type Safety**: TypeScript + Zod ensure type correctness

#### SQL Injection Prevention
- **Parameterized Queries**: All database queries use prepared statements
- **No String Concatenation**: MySQL2 pool handles escaping automatically

### 3. **Rate Limiting**

#### Login Endpoint
- **Limit**: 5 attempts per IP per 15 minutes
- **Response**: HTTP 429 with `Retry-After` header
- **Key**: IP address-based tracking

#### Registration Endpoint
- **Limit**: 10 registrations per IP per hour
- **Prevents**: Mass account creation

#### General API Endpoints
- **Limit**: 100 requests per IP per 15 minutes
- **Configurable**: Via environment variables

### 4. **CSRF Protection**

#### Backend (Spring Boot)
```java
// Cookie-based CSRF tokens
.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .ignoringRequestMatchers("/ws/**", "/health")
)
```
- **Token Repository**: Cookie-based with SameSite protection
- **Excluded Endpoints**: WebSocket, health checks
- **Cookie Attributes**: HttpOnly=false (for frontend access), Secure (production)

### 5. **Security Headers**

All API responses include:
```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
Permissions-Policy: geolocation=(self), microphone=(), camera=()
```

Production only:
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 6. **CORS Configuration**

```java
// Backend allows only localhost:3000
.allowedOrigins("http://localhost:3000")
.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
.allowCredentials(true)
```

**Production**: Update to production domain in `CorsConfig.java`

### 7. **Error Handling**

#### User Enumeration Prevention
```typescript
// Same error message for invalid email or password
return NextResponse.json(
  { error: 'Invalid credentials' },
  { status: 401 }
)
```

#### Information Disclosure Prevention
- Generic error messages to clients
- Detailed errors only in server logs
- No stack traces in production

## 🔧 Configuration

### Environment Variables

#### Required (.env.local)
```bash
# Generate with: openssl rand -base64 64
JWT_SECRET=<your-secure-secret-here>

DATABASE_HOST=localhost
DATABASE_PORT=8889
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=bus_tracking_system
```

#### Optional
```bash
RATE_LIMIT_WINDOW_MS=900000          # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5
```

### Production Checklist

- [ ] Generate strong `JWT_SECRET` (64+ characters)
- [ ] Update CORS origins to production domain
- [ ] Enable HTTPS/TLS
- [ ] Set secure cookie attributes
- [ ] Update database credentials
- [ ] Enable production CSP headers
- [ ] Configure rate limiting for production load
- [ ] Set up monitoring and alerts
- [ ] Review and update security headers
- [ ] Enable database connection pooling limits

## 🧪 Testing Security

### Run Automated Tests
```bash
# Make executable
chmod +x test-security.sh

# Run all security tests
./test-security.sh
```

### Manual Tests

#### 1. Authentication Tests
```bash
# Invalid credentials
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fake@test.com","password":"wrong"}'
# Expected: 401 Unauthorized

# SQL Injection attempt
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com'\'' OR '\''1'\''='\''1","password":"anything"}'
# Expected: 401 Unauthorized

# Weak password
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123","firstName":"Test","lastName":"User"}'
# Expected: 400 Bad Request with validation errors
```

#### 2. Authorization Tests
```bash
# Access without token
curl http://localhost:3000/api/buses
# Expected: 401 Unauthorized

# Access with invalid token
curl -H "Authorization: Bearer fake_token" http://localhost:3000/api/buses
# Expected: 401 Unauthorized
```

#### 3. Rate Limiting Tests
```bash
# Brute force login (run 6 times)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@test.com\",\"password\":\"wrong$i\"}"
done
# Expected: First 5 return 401, 6th returns 429 (Too Many Requests)
```

#### 4. XSS Prevention Tests
```bash
# XSS in registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"xss@test.com","password":"Test123!","firstName":"<script>alert(1)</script>","lastName":"User"}'
# Expected: 400 Bad Request (validation error)
```

#### 5. CSRF Tests
```bash
# Check for CSRF token
curl -c cookies.txt http://localhost:4000/api/health
cat cookies.txt | grep XSRF-TOKEN
# Expected: XSRF-TOKEN cookie present
```

## 🛡️ Middleware Architecture

### Request Flow
```
Client Request
    ↓
Security Headers Middleware
    ↓
Rate Limiting Middleware
    ↓
Input Validation Middleware (validateRequest)
    ↓
Authentication Middleware (requireAuth)
    ↓
Authorization Middleware (requireRole)
    ↓
Route Handler
    ↓
Security Headers Added to Response
    ↓
Client Response
```

### Usage Examples

#### Protected Route (Admin Only)
```typescript
import { withAuth } from '@/lib/middleware/auth'
import { withSecurityHeaders } from '@/lib/middleware/security-headers'

const handler = async (request: AuthenticatedRequest) => {
  const user = request.user! // TypeScript knows user exists
  // ... handler logic
}

export const GET = withSecurityHeaders(
  withAuth(handler, { roles: ['admin'] })
)
```

#### Rate-Limited Login
```typescript
import { loginRateLimit } from '@/lib/middleware/rate-limit'
import { validateRequest, loginSchema } from '@/lib/middleware/validation'
import { withSecurityHeaders } from '@/lib/middleware/security-headers'

const loginHandler = async (request: NextRequest, data: LoginData) => {
  // ... login logic
}

export const POST = withSecurityHeaders(
  loginRateLimit()(
    validateRequest(loginSchema)(loginHandler)
  )
)
```

## 📊 Security Audit Log

| Date | Change | Reason |
|------|--------|--------|
| 2025-11-29 | Added JWT_SECRET requirement | Prevent weak default secrets |
| 2025-11-29 | Implemented password validation | Enforce strong passwords |
| 2025-11-29 | Added rate limiting | Prevent brute force attacks |
| 2025-11-29 | Enabled CSRF protection | Prevent cross-site request forgery |
| 2025-11-29 | Added security headers | Defense in depth |
| 2025-11-29 | Implemented RBAC | Proper access control |
| 2025-11-29 | Added input sanitization | Prevent XSS attacks |

## 🚨 Known Limitations

1. **Session Management**: Currently stateless JWT (no session invalidation)
   - **Mitigation**: Short token expiration (7 days)
   - **Future**: Implement token blacklist or refresh tokens

2. **Rate Limiting Storage**: In-memory (lost on restart)
   - **Mitigation**: Acceptable for development
   - **Future**: Use Redis for production

3. **CSRF for API**: Currently using cookie-based tokens
   - **Note**: Consider moving to custom headers for pure API

4. **Password Reset**: Not yet implemented
   - **Future**: Add secure password reset flow

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Spring Security Docs](https://spring.io/projects/spring-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/security)

## 🆘 Incident Response

If a security vulnerability is discovered:

1. **Assess Impact**: Determine affected systems and data
2. **Patch Immediately**: Deploy fix to production
3. **Notify Users**: If data breach, notify affected users
4. **Document**: Update this document with lessons learned
5. **Review**: Conduct security audit of similar code patterns

## 📞 Security Contacts

- **Development Team**: [Your Team Email]
- **Security Lead**: [Security Contact]
- **Incident Reporting**: [Security Incident Email]
