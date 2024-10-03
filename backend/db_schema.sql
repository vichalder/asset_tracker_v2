CREATE TABLE IF NOT EXISTS devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  last_latitude DECIMAL(10, 8),
  last_longitude DECIMAL(11, 8),
  last_seen DATETIME
);

CREATE TABLE IF NOT EXISTS device_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id INT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE IF NOT EXISTS geofences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  center_lat DECIMAL(10, 8) NOT NULL,
  center_lng DECIMAL(11, 8) NOT NULL,
  radius DECIMAL(10, 2) NOT NULL,
  type ENUM('entering', 'exiting') NOT NULL DEFAULT 'exiting'
);