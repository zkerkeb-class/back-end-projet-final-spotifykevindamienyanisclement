const { authenticate } = require('../src/controllers/auth.controller');
const assert = require('assert');

describe('Authentication Controller', () => {
    it('should authenticate a user with valid credentials', () => {
        const credentials = { username: 'testuser', password: 'testpass' };
        const result = authenticate(credentials);
        assert.strictEqual(result.success, true);
    });

    it('should not authenticate a user with invalid credentials', () => {
        const credentials = { username: 'testuser', password: 'wrongpass' };
        const result = authenticate(credentials);
        assert.strictEqual(result.success, false);
    });
});
