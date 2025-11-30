#!/bin/bash

# Security Test Suite for Bus Tracking System
# Run this script to test all security measures

BASE_URL="http://localhost:3000"
BACKEND_URL="http://localhost:4000"

echo "🔐 Security Test Suite - Bus Tracking System"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name="$1"
    local command="$2"
    local expected_status="$3"
    
    echo -n "Testing: $name... "
    
    response=$(eval "$command")
    status=$(echo "$response" | tail -n 1)
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status)"
        ((FAILED++))
    fi
}

echo "📝 1. Authentication Tests"
echo "-----------------------------------"

# Test 1: Login without credentials
test_endpoint \
    "Login without email/password" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST $BASE_URL/api/auth/login -H 'Content-Type: application/json' -d '{}'" \
    "400"

# Test 2: Login with invalid credentials
test_endpoint \
    "Login with invalid credentials" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST $BASE_URL/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"fake@fake.com\",\"password\":\"wrongpass\"}'" \
    "401"

# Test 3: SQL Injection attempt in login
test_endpoint \
    "SQL Injection in login" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST $BASE_URL/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@test.com'\\'' OR '\''1'\''='\''1\",\"password\":\"anything\"}'" \
    "401"

# Test 4: Weak password registration
test_endpoint \
    "Weak password registration" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST $BASE_URL/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@test.com\",\"password\":\"123\",\"firstName\":\"Test\",\"lastName\":\"User\"}'" \
    "400"

# Test 5: Invalid email format
test_endpoint \
    "Invalid email format" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST $BASE_URL/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"notanemail\",\"password\":\"Test123!\",\"firstName\":\"Test\",\"lastName\":\"User\"}'" \
    "400"

echo ""
echo "🔒 2. Authorization Tests"
echo "-----------------------------------"

# Test 6: Access buses without token
test_endpoint \
    "Access buses without authentication" \
    "curl -s -o /dev/null -w '%{http_code}' $BASE_URL/api/buses" \
    "401"

# Test 7: Access drivers without token
test_endpoint \
    "Access drivers without authentication" \
    "curl -s -o /dev/null -w '%{http_code}' $BASE_URL/api/drivers" \
    "401"

# Test 8: Access with invalid token
test_endpoint \
    "Access with invalid token" \
    "curl -s -o /dev/null -w '%{http_code}' -H 'Authorization: Bearer invalid_token_here' $BASE_URL/api/buses" \
    "401"

echo ""
echo "⚡ 3. Rate Limiting Tests"
echo "-----------------------------------"

echo -n "Testing: Login rate limiting (6 attempts)... "
RATE_LIMIT_FAILED=0
for i in {1..6}; do
    status=$(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE_URL/api/auth/login -H 'Content-Type: application/json' -d "{\"email\":\"test$i@test.com\",\"password\":\"wrong$i\"}")
    if [ $i -le 5 ]; then
        if [ "$status" != "401" ]; then
            RATE_LIMIT_FAILED=1
        fi
    else
        if [ "$status" = "429" ]; then
            echo -e "${GREEN}✓ PASSED${NC} (Rate limit triggered on attempt 6)"
            ((PASSED++))
        else
            echo -e "${RED}✗ FAILED${NC} (Expected 429 on attempt 6, got $status)"
            ((FAILED++))
        fi
    fi
done

echo ""
echo "🛡️ 4. XSS Protection Tests"
echo "-----------------------------------"

# Test 9: XSS in registration
test_endpoint \
    "XSS in first name" \
    "curl -s -o /dev/null -w '%{http_code}' -X POST $BASE_URL/api/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"xss@test.com\",\"password\":\"Test123!\",\"firstName\":\"<script>alert(1)</script>\",\"lastName\":\"User\"}'" \
    "400"

echo ""
echo "🔐 5. CSRF Protection Tests"
echo "-----------------------------------"

# Test 10: Backend CSRF token
echo -n "Testing: Backend CSRF protection... "
csrf_response=$(curl -s -c /tmp/cookies.txt $BACKEND_URL/api/health)
if grep -q "XSRF-TOKEN" /tmp/cookies.txt; then
    echo -e "${GREEN}✓ PASSED${NC} (CSRF token present)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (CSRF token not found in cookies)"
    ((FAILED++))
fi
rm -f /tmp/cookies.txt

echo ""
echo "📊 6. Security Headers Tests"
echo "-----------------------------------"

# Test 11-15: Security headers
headers=$(curl -s -I $BASE_URL)

echo -n "Testing: X-Frame-Options header... "
if echo "$headers" | grep -iq "X-Frame-Options"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

echo -n "Testing: X-Content-Type-Options header... "
if echo "$headers" | grep -iq "X-Content-Type-Options"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

echo -n "Testing: Content-Security-Policy header... "
if echo "$headers" | grep -iq "Content-Security-Policy"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

echo ""
echo "=============================================="
echo "📈 Test Results Summary"
echo "=============================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All security tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some security tests failed. Please review.${NC}"
    exit 1
fi
