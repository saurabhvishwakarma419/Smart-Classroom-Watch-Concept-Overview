# Smart Classroom Watch - Testing Suite

Comprehensive test suite covering firmware, backend, mobile apps, and integration testing.

## Running Tests

### Firmware Tests
```bash
cd tests/firmware/
pio test
```

### Backend Tests
```bash
cd tests/backend/
npm test
# or
pytest
```

### Mobile Tests
```bash
cd tests/mobile/
npm test
```

### Integration Tests
```bash
cd tests/integration/
npm test
```

### Run All Tests
```bash
./run_all_tests.sh
```

## Test Coverage Requirements
- Firmware: >80%
- Backend: >85%
- Mobile: >75%
- Integration: All critical paths

## CI/CD Integration
Tests run automatically on:
- Pull requests
- Merge to main branch
- Pre-deployment
- 
