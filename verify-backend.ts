
const BASE_URL = 'http://localhost:4000/api';

async function verifyBackend() {
    console.log('🔒 Starting Backend Security Verification...');

    try {
        // 1. Health Check
        console.log('\n1️⃣  Testing Health Endpoint (Public)...');
        try {
            const health = await fetch('http://localhost:4000/health');
            if (!health.ok) throw new Error(`Status ${health.status} `);
            const data = await health.json();
            console.log('✅ Health check passed:', data);
        } catch (error) {
            console.error('❌ Health check failed. Is the server running?', error);
            process.exit(1);
        }

        // 2. Test Protected Route WITHOUT Token
        console.log('\n2️⃣  Testing Protected Route WITHOUT Token...');
        try {
            const res = await fetch(`${BASE_URL}/buses`);
            if (res.status === 401 || res.status === 403) {
                console.log(`✅ PASSED: Access denied as expected (${res.status}).`);
            } else if (res.ok) {
                console.error('❌ FAILED: Protected route `/api/buses` was accessible without a token!');
            } else {
                console.error('❌ FAILED: Unexpected status:', res.status);
            }
        } catch (error: any) {
            console.error('❌ FAILED: Network error:', error.message);
        }

        // 3. Login to get Token
        console.log('\n3️⃣  Testing Authentication & Protected Route WITH Token...');
        const tempUser = {
            email: `test_verify_${Date.now()}@example.com`,
            password: 'password123',
            name: 'Test Verify',
            phone: '1234567890',
            role: 'admin'
        };

        let token = '';

        try {
            console.log('   Attempting to register temp admin user...');
            const regRes = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tempUser)
            });

            const regData = await regRes.json();

            if (regRes.ok) {
                token = regData.token;
                console.log('✅ Registration successful. Token obtained.');
            } else {
                // If user exists, try login
                console.log('   Registration failed (maybe exists). Trying login...');
                const loginRes = await fetch(`${BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: tempUser.email, password: tempUser.password })
                });
                const loginData = await loginRes.json();
                if (loginRes.ok) {
                    token = loginData.token;
                    console.log('✅ Login successful. Token obtained.');
                } else {
                    throw new Error(loginData.error || 'Login failed');
                }
            }
        } catch (error: any) {
            console.error('❌ Login/Registration failed. Cannot proceed with authenticated test.');
            console.error('   Error:', error.message);
            return;
        }

        // 4. Test Protected Route WITH Token
        if (token) {
            console.log('   Accessing protected route `/api/buses` with token...');
            try {
                const protectedRes = await fetch(`${BASE_URL}/buses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (protectedRes.ok) {
                    const data = await protectedRes.json();
                    console.log(`✅ PASSED: Protected route accessed successfully.`);
                    console.log(`   Data received: ${Array.isArray(data) ? data.length + ' buses' : 'Response OK'}`);
                } else {
                    console.error(`❌ FAILED: Access denied even with valid token! Status: ${protectedRes.status}`);
                }
            } catch (error: any) {
                console.error('❌ FAILED: Network error:', error.message);
            }
        }

    } catch (err: any) {
        console.error('Unexpected error during verification:', err);
    }
}

// Run (requires ts-node)
// npx ts-node verify-backend.ts
verifyBackend();
