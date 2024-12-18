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
│   │       ├── devices.js
│   │       └── geofences.js
│   ├── db_schema.sql
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

4. Set up the database schema:
   - Connect to your MySQL database
   - Run the SQL commands in `backend/db_schema.sql`

5. Start the server:
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
2. Use the `backend/db_schema.sql` file to create the necessary tables. You can run this file using a MySQL client or the MySQL command line tool:

   ```
   mysql -h your_host -u your_user -p your_database < backend/db_schema.sql
   ```

### Device Setup

#### ESP32

1. Open the `device_code/esp32/esp32_gnss.ino` file in the Arduino IDE.
2. Install the required libraries:
   - TinyGPS++
   - TinyGSM
   - ArduinoJson
3. Update the following in the code:
   - APN settings for your cellular provider
   - `server` variable with your backend server's IP address or domain
   - `port` variable with your backend server's port (default is 3000)
   - `deviceId` variable with a unique ID for this device
4. Flash the code to your ESP32 device.

#### Cortex-M4

1. Set up your Cortex-M4 development environment (e.g., STM32CubeIDE).
2. Import the `device_code/cortex_m4/cortex_m4_gnss.c` file into your project.
3. Install and configure the required libraries:
   - STM32 HAL
   - LwIP
   - minmea
4. Update the following in the code:
   - `SERVER_IP` macro with your backend server's IP address or domain
   - `SERVER_PORT` macro with your backend server's port (default is 3000)
   - `DEVICE_ID` macro with a unique ID for this device
5. Compile and flash the code to your Cortex-M4 device.

## Deployment

### Frontend Deployment (Netlify)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Connect your repository to Netlify:
   - Sign up or log in to [Netlify](https://www.netlify.com/)
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `build`

3. Environment Variables:
   - In Netlify dashboard, go to Site settings > Build & deploy > Environment
   - Add any required environment variables

The site will automatically deploy when you push changes to your repository.

Note: The frontend is configured to handle client-side routing through the `netlify.toml` configuration file.

## Features

- Real-time device tracking
- Historical data visualization
- Geofencing capabilities
- Geofence alert configuration
- Support for both ESP32 and Cortex-M4 based GNSS devices

## Geofencing

The application supports geofencing:
- Create circular geofences by drawing on the map
- Edit existing geofences
- Delete geofences
- View all current geofences

## Geofence Alerts

The application now supports configurable geofence alerts:
- Configure alerts for specific devices and geofences
- Set up alerts for when a device enters an "entering" geofence or exits an "exiting" geofence
- Manage alert configurations through the Alert Configuration page

To use the geofence alert feature:
1. Navigate to the Alert Configuration page using the navbar
2. Select a device from the dropdown list
3. Select a geofence from the dropdown list
4. The system will automatically check if the selected device's last known position triggers an alert for the selected geofence
5. If an alert is triggered, it will be displayed on the page

Note: The current implementation checks for alerts based on the device's last known position. For real-time alerts, you would need to implement a more sophisticated system that continuously monitors device positions and triggers alerts as they occur.

## Note

This project is a basic implementation and may require additional security measures and optimizations for production use. Always follow best practices for security when deploying web applications and IoT devices.

## Troubleshooting

If you encounter any issues with device connectivity:
1. Ensure your backend server is running and accessible from the internet.
2. Verify that the server IP/domain and port in the device code match your backend setup.
3. Check that your devices have an active internet connection.
4. Verify that the API endpoints in the backend match those used in the device code.

For issues with geofence alerts:
1. Ensure that the geofences table is properly set up in your database.
2. Check that devices are regularly updating their positions in the database.
3. Verify that the geofence checking logic in the AlertConfiguration component is working correctly.
4. Make sure the frontend is correctly fetching and displaying device and geofence data.