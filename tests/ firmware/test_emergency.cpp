#include <unity.h>
#include "emergency.h"

void setUp(void) {
    initEmergency();
}

void tearDown(void) {
    resetEmergencyState();
}

void test_emergency_initialization(void) {
    EmergencyState state = getEmergencyState();
    TEST_ASSERT_EQUAL(NORMAL, state);
}

void test_emergency_button_detection(void) {
    // Button should be in default state
    bool pressed = isEmergencyButtonPressed();
    TEST_ASSERT_FALSE(pressed);
}

void test_emergency_alert_trigger(void) {
    bool result = triggerEmergencyAlert();
    
    if (result) {
        EmergencyState state = getEmergencyState();
        TEST_ASSERT_NOT_EQUAL(NORMAL, state);
    }
}

void test_emergency_state_reset(void) {
    triggerEmergencyAlert();
    resetEmergencyState();
    
    EmergencyState state = getEmergencyState();
    TEST_ASSERT_EQUAL(NORMAL, state);
}

void test_vibration_function(void) {
    // Should not crash
    vibrate(100);
    TEST_ASSERT_TRUE(true);
}

void setup() {
    delay(2000);
    
    UNITY_BEGIN();
    RUN_TEST(test_emergency_initialization);
    RUN_TEST(test_emergency_button_detection);
    RUN_TEST(test_emergency_alert_trigger);
    RUN_TEST(test_emergency_state_reset);
    RUN_TEST(test_vibration_function);
    UNITY_END();
}

void loop() {}
