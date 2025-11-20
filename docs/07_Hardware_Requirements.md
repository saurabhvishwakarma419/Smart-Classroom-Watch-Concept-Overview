# Hardware Requirements ⚙️

The Smart Classroom Watch integrates advanced hardware components to ensure accurate sensing, seamless connectivity, and reliable performance. Below are the essential hardware elements that power the system.

 ## 🔌 Microcontroller Unit
### Recommended Options:

ESP32 / ESP8266

Dual-core processor

Built-in WiFi + Bluetooth

Ideal for real-time IoT operations

### Alternatives:

Arduino Nano 33 IoT

Arduino MKR WiFi 1010
Both support wireless communication and are compatible with wearable applications.

## 🩺 Sensors
 Heart Rate Sensor

 MAX30102 or equivalent optical pulse oximeter

 Measures heart rate + blood oxygen level

 Accelerometer/Gyroscope

MPU6050 or MPU9250

Enables precise motion detection & activity tracking

### Temperature Sensor

DS18B20 or integrated sensor

Supports basic body temperature monitoring

## 📡 Communication Modules
### NFC/RFID Module

 PN532 or MFRC522

Used for fast, contactless attendance

### Bluetooth Module

Built-in ESP32 BLE or external HC-05 / HC-06

### WiFi Module

Integrated ESP32 WiFi or ESP8266 as a standalone

### GPS Module (Optional)

NEO-6M for advanced student location tracking

## 🖥 Display Options
OLED Display

0.96" or 1.3"

Ideal for showing notifications, time, alerts, basic text

E-Ink Display (Alternative)

Excellent for battery efficiency

Suitable for low-power designs

## 🔋 Power Management
Rechargeable Battery

300–500mAh LiPo

Supports 1–2 days of usage

### Charging Circuit

TP4056 USB charging module

### Voltage Regulator

AMS1117 or equivalent for stable power delivery

## 🔘 Input Controls

Capacitive Touch Sensors or physical buttons

Dedicated SOS Button for emergency alerts

Ensures easy and reliable user interaction

## ⌚ Enclosure
Watch Casing

Durable, water-resistant plastic or silicone body

Wrist Strap

Adjustable silicone or fabric band

Comfortable for all-day wear

## 🏫 Classroom Infrastructure
NFC/RFID Readers

Installed at classroom entrances

Capture attendance instantly as students walk in

## Gateway Devices (Optional)

### Raspberry Pi or similar Mini-PCs

For local processing or data aggregation

### Power Supply

USB chargers or power banks

Ensure reliable charging stations for classroom devices
