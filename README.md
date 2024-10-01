# GNSS Device Tracker

This project is a full-stack application for tracking GNSS-enabled devices. It includes a backend server, frontend web application, and device code for ESP32 and Cortex-M4 devices.

## Project Structure

```
asset_tracker_v2/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   └── routes/
│   │       └── devices.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── device_code/
│   ├── esp32/
│   │   └── esp32_gnss.ino
│   └── cortex_m4/
│       └── cortex_m4_gnss.c
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `backend` directory with your Google Cloud MySQL database credentials:
   ```
   DB_HOST=your_google_cloud_mysql_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=gnss_device_tracker
   PORT=3000
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

### Database Setup

1. Set up a Google Cloud MySQL database.
2. Create the necessary tables using the following SQL commands:

   ```sql
   CREATE TABLE devices (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     type VARCHAR(50) NOT NULL,
     status VARCHAR(50) NOT NULL,
     last_latitude DECIMAL(10, 8),
     last_longitude DECIMAL(11, 8),
     last_seen DATETIME
   );

   CREATE TABLE device_history (
     id INT AUTO_INCREMENT PRIMARY KEY,
     device_id INT,
     latitude DECIMAL(10, 8) NOT NULL,
     longitude DECIMAL(11, 8) NOT NULL,
     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (device_id) REFERENCES devices(id)
   );
   ```

### Device Setup

#### ESP32

1. Open the `device_code/esp32/esp32_gnss.ino` file in the Arduino IDE.
2. Install the required libraries:
   - TinyGPS++
   - TinyGSM
   - ArduinoJson
3. Update the APN settings and server URL in the code.
4. Flash the code to your ESP32 device.

#### Cortex-M4

1. Set up your Cortex-M4 development environment (e.g., STM32CubeIDE).
2. Import the `device_code/cortex_m4/cortex_m4_gnss.c` file into your project.
3. Install and configure the required libraries:
   - STM32 HAL
   - LwIP
   - minmea
4. Update the server IP and port in the code.
5. Compile and flash the code to your Cortex-M4 device.

## Features

- Real-time device tracking
- Historical data visualization
- Geofencing capabilities
- Support for both ESP32 and Cortex-M4 based GNSS devices

## Note

This project is a basic implementation and may require additional security measures and optimizations for production use. Always follow best practices for security when deploying web applications and IoT devices.