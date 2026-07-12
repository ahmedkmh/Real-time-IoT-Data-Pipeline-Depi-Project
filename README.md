# Farmland: Data-Powered Sustainable Farming 🌾
[Demo Video](https://1drv.ms/v/c/0d8b4ef2efa61906/IQBWBO3Ohr4_TbYl67zOTnjOAfN0WTXOvi0FQrULSnRzxpE?e=ti5Xgt) - [Presentation](https://canva.link/66yuthekw6q3phc)

## Project Overview
**Farmland** is an end-to-end, real-time IoT and Data Analytics platform designed to empower sustainable agriculture. Developed to bridge advanced artificial intelligence and sustainable farming, this project leverages Microsoft Azure cloud services to ingest, process, and visualize agricultural telemetry. 

The platform continuously monitors both environmental conditions (temperature, humidity, air quality) and IoT device health (battery levels, CPU usage, maintenance status), providing actionable predictive insights that minimize waste and secure food supply chains.

## Technologies Used
* **IoT & Edge:** Raspberry Pi (Azure IoT Simulator), Node.js, MQTT, BME280 Sensor
* **Cloud Ingestion:** Azure IoT Hub
* **Real-Time Processing:** Azure Stream Analytics
* **Data Storage:** Azure SQL Server & Database
* **Business Intelligence:** Microsoft Power BI
* **Deployment:** Azure Resource Manager

---

## System Components & Visual Showcase

### 1. IoT Simulation & Telemetry Ingestion
![IoT Simulator](Pictures/razberry.png)
**Description:** To simulate edge-device data collection, we utilized the Raspberry Pi Azure IoT Online Simulator. The setup mimics a physical BME280 sensor connected to a Raspberry Pi. A custom Node.js script is deployed to read environmental states and stream JSON-formatted telemetry payloads directly to our Azure IoT Hub in real-time.

### 2. Azure Cloud Infrastructure & Stream Processing
![Azure Resource Group](Pictures/azure1.png)
![Stream Analytics Query](Pictures/azure2.png)
**Description:** Our cloud backbone is deployed within an Azure Resource Group (`Depi_project`). It consists of an **IoT Hub** (`iothubfarmer`) for massive telemetry ingestion and an **Azure SQL Server** (`plantiotdatabase`) for persistent storage. 
To connect the two, we configured an **Azure Stream Analytics job** (`iotjob`). The job uses SQL-like query language to filter, transform, and route the incoming IoT telemetry streams into designated normalized tables (e.g., `[db.Devices]`, `[db.Farms]`) within our SQL database with sub-second latency.

### 3. Relational Database Architecture (Azure SQL)
![Database Schema](Pictures/sqldiagram.png)
**Description:** The processed data is stored in a robust relational database schema optimized for analytics. The schema links a central `SensorReadings` fact table (containing granular data like Humidity, Pressure, Co2, and CPU Usage) with dimensional tables including `Devices`, `Farms`, `Locations`, and `Crops`. This relational model allows for complex analytical queries and ensures data integrity across different farming sectors.

### 4. Power BI Analytics & Dashboards
To translate raw data into actionable insights, we built a comprehensive Power BI reporting suite containing specialized modules:

![Smart Farming Home](Pictures/powerbi1.png)
![Environmental Monitoring Dashboard](Pictures/powerbi3.png)
![Device Health Dashboard](Pictures/powerbi2.png)
**Description:** * **Home Page:** Serves as the central navigational hub for our BI solution.
* **Environmental Monitoring:** Focuses on agronomic conditions, tracking real-time averages for Temperature, Pressure, and Air Quality. Features include a line chart tracking temperature trends, weather distributions, and granular temperature alerts aggregated by city, allowing farmers to react to adverse weather instantly.
* **Device Health & Operational Monitoring:** Crucial for maintaining the IoT fleet, this dashboard monitors hardware status across all farms. It provides insights into Battery Levels, Energy Consumption, CPU/Memory usage, and Signal Strength. A dedicated metric highlights the exact number of devices requiring maintenance, ensuring zero downtime in the data pipeline.

### 5. High-Level Monitoring & Automated Alerting System
![IoT Dashboard Overview](Pictures/powerbi4.png)
![Automated Alerts](Pictures/alerts.png)

**Description:** The platform pairs a high-level **IoT Dashboard** with a responsive notification system. The dashboard provides an immediate overview of critical system health and environmental metrics (e.g., Average Battery, Average Temp, Pressure, and Devices Needing Maintenance) to identify anomalies at a glance. Working in tandem, the automated alerting system continuously monitors this incoming data. If critical thresholds are breached—such like temperature spikes or humidity drops that could endanger crops—the system instantly dispatches alerts to Clients, enabling immediate preventative action.

---

## Team Members
* **Ahmed Khalid Mohammed Hafez**
* **Ahmed Mohammed Ali Gheith**
* **Abdallah Mahmoud Mahmoud Hassan**
* **Mohammed Ezzat Abdelaziz Eltayeb**
* **Mohammed Hatem Waheed Eldin Ata**
* **Mina Magdy Boshra Fahim**
