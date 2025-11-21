#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
#define WIFI_SSID "YourSchoolWiFi"
#define WIFI_PASSWORD "YourPassword"
#define WIFI_TIMEOUT 20000  // 20 seconds

// API Server Configuration
#define API_SERVER "http://192.168.1.100:5000"
#define API_ENDPOINT_ATTENDANCE "/api/attendance/mark"
#define API_ENDPOINT_ANALYTICS "/api/analytics/process"
#define API_ENDPOINT_EMERGENCY "/api/emergency/alert"

// Device Configuration
#define DEVICE_ID "WATCH_001"
#define STUDENT_ID "STU_2024_001"

// Pin Definitions
#define I2C_SDA 21
#define I2C_SCL 22
#define BTN_EMERGENCY 0
#define BTN_SELECT 15
#define BTN_BACK 2
#define BATTERY_PIN 34

// Display Configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

// Sensor Thresholds
#define HEART_RATE_MIN 50
#define HEART_RATE_MAX 120
#define FOCUS_MOVEMENT_THRESHOLD 5
#define DISTRACTION_THRESHOLD 10

// Power Management
#define SLEEP_TIMEOUT 120000  // 2 minutes
#define BATTERY_LOW_THRESHOLD 20  // 20%

// NFC Configuration
#define NFC_IRQ 4
#define NFC_RESET 3

// Timing
#define SENSOR_READ_INTERVAL 2000  // 2 seconds
#define DISPLAY_UPDATE_INTERVAL 1000  // 1 second
#define SERVER_SYNC_INTERVAL 30000  // 30 seconds

// Debug
#define DEBUG_MODE true
#define SERIAL_BAUD 115200

#endif
