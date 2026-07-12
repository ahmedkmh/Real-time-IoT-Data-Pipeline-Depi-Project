/*
 * Enhanced Raspberry Pi IoT Streaming for Azure IoT Hub & Power BI
 * Complete Production Script with Maximum Line-by-Line Variety
 */

const wpi = require('wiring-pi');
const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const BME280 = require('bme280-sensor');

// Configuration Constants
const BME280_OPTION = {
    i2cBusNo: 1,
    i2cAddress: BME280.BME280_DEFAULT_I2C_ADDRESS()
};

const CONNECTION_STRING = "HostName=iothubfarmer.azure-devices.net;DeviceId=temp;SharedAccessKey=x/r+0q1zTDQDswsBWYg6R5BI8yFqaChokSUn15JUlOI=";
const LED_PIN = 4;
const SEND_INTERVAL_MS = 2000;

// State Variables
let sendingMessage = true;
let messageId = 0;
let client;
let sensor;
let blinkLEDTimeout = null;
let batteryLevel = 100;
let totalEnergy = 0;

// Data Pools for Simulation Variety
const cities = ["Cairo", "Alexandria", "Giza", "Port Said", "Suez", "Ismailia", "Damietta", "Mansoura", "Tanta", "Zagazig", "Benha", "Kafr El Sheikh", "Fayoum", "Beni Suef", "Minya", "Assiut", "Sohag", "Qena", "Luxor", "Aswan"];
const farms = ["North Farm", "East Farm", "West Farm", "Delta Farm", "Green Valley", "Nile Farm", "Desert Farm", "Smart Farm"];
const crops = ["Wheat", "Corn", "Rice", "Cotton", "Tomato", "Potato", "Onion", "Orange", "Mango", "Grapes"];
const weatherConditions = ["Sunny", "Cloudy", "Windy", "Rainy", "Foggy"];
const irrigationStatus = ["Running", "Stopped"];
const soilTypes = ["Clay", "Sand", "Loam", "Silt"];

// Helper function to pick a random item from an array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Non-blocking LED blinker
function blinkLED() {
    if (blinkLEDTimeout) clearTimeout(blinkLEDTimeout);
    wpi.digitalWrite(LED_PIN, 1);
    blinkLEDTimeout = setTimeout(() => {
        wpi.digitalWrite(LED_PIN, 0);
    }, 500);
}

// Asynchronously generates highly varied payload data
async function generateTelemetryPayload() {
    messageId++;
    
    // Read live hardware sensor data as a base baseline
    const sensorData = await sensor.readSensorData();
    
    // Randomizes temperature by +/- 15 degrees and humidity by +/- 25% from baseline
    const baseTemp = sensorData.temperature_C;
    const baseHum = sensorData.humidity;
    const temperature = Number((baseTemp + (Math.random() * 30 - 15)).toFixed(2));
    const humidity = Number(Math.min(100, Math.max(10, baseHum + (Math.random() * 50 - 25))).toFixed(2));

    // Volatile Environmental & System metrics
    const pressure = +(980 + Math.random() * 60).toFixed(2); 
    const altitude = +(10 + Math.random() * 200).toFixed(2); 
    
    batteryLevel = Math.max(10, batteryLevel - (Math.random() * 0.5));
    if (batteryLevel <= 15) batteryLevel = 100; // Auto reset battery loop
    
    const signalStrength = Math.floor(-30 - Math.random() * 65);
    const cpuUsage = +(5 + Math.random() * 90).toFixed(1);
    const memoryUsage = +(15 + Math.random() * 75).toFixed(1);
    const airQuality = Math.floor(15 + Math.random() * 285);
    const co2 = Math.floor(350 + Math.random() * 1450);
    const vibration = +(Math.random() * 2.5).toFixed(2);
    totalEnergy += +(Math.random() * 0.05).toFixed(3);

    // Dynamic threshold alerts
    const heatIndex = +(temperature + humidity * 0.05).toFixed(2);
    const fanStatus = temperature >= 28 ? "ON" : "OFF";
    const acStatus = temperature >= 34 ? "ON" : "OFF";
    const temperatureAlert = temperature >= 32;
    const humidityAlert = humidity >= 75;
    const sensorStatus = batteryLevel < 25 ? "Low Battery" : "Healthy";
    const maintenanceStatus = vibration > 1.5 ? "Inspection Needed" : "Normal";

    // RANDOM TIME & DATE LOGIC
    // Generates a completely separate date range between Jan 1, 2024 and today's current date
    const startTimestamp = new Date("2024-01-01").getTime();
    const endTimestamp = new Date().getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    
    const now = new Date(randomTimestamp); 
    const hour = now.getHours(); 
    const shift = (hour < 8) ? "Night" : (hour < 16) ? "Morning" : "Evening";

    // Rotates target visualization IDs across 50 virtual devices
    const deviceNumber = Math.floor(Math.random() * 50) + 1;
    const targetDeviceId = `PI-${deviceNumber.toString().padStart(3, "0")}`;

    return {
        telemetry: {
            messageId,
            timestamp: now.toISOString(),
            year: now.getFullYear(),
            month: now.toLocaleString("en-US", { month: "long" }),
            monthNumber: now.getMonth() + 1,
            day: now.getDate(),
            dayOfWeek: now.toLocaleString("en-US", { weekday: "long" }),
            hour,
            shift,
            deviceId: targetDeviceId,
            firmwareVersion: `1.${Math.floor(Math.random() * 4)}.${Math.floor(Math.random() * 10)}`,
            city: getRandomItem(cities),
            farm: getRandomItem(farms), 
            crop: getRandomItem(crops),
            soilType: getRandomItem(soilTypes),
            weather: getRandomItem(weatherConditions),
            irrigationStatus: getRandomItem(irrigationStatus),
            temperature,
            humidity,
            pressure,
            altitude,
            heatIndex,
            soilMoisture: Math.floor(5 + Math.random() * 90),
            airQuality,
            co2,
            lightIntensity: Math.floor(1000 + Math.random() * 110000),
            rainfall: +(Math.random() * 45).toFixed(1),
            windSpeed: +(Math.random() * 65).toFixed(1),
            batteryLevel: Number(batteryLevel.toFixed(1)),
            signalStrength,
            cpuUsage,
            memoryUsage,
            vibration,
            energyConsumption: Number(totalEnergy.toFixed(3)),
            fanStatus,
            acStatus,
            sensorStatus,
            maintenanceStatus,
            temperatureAlert,
            humidityAlert
        },
        temperatureAlert
    };
}

// Orchestrates building and pushing the message to Azure
async function sendMessage() {
    if (!sendingMessage) return;

    try {
        const { telemetry, temperatureAlert } = await generateTelemetryPayload();
        const contentStr = JSON.stringify(telemetry);
        const message = new Message(contentStr);
        
        message.properties.add("temperatureAlert", temperatureAlert.toString());

        console.log(`Sending Unique Payload: ${contentStr}`);

        client.sendEvent(message, (err) => {
            if (err) {
                console.error(`Failed to dispatch message: ${err.toString()}`);
            } else {
                blinkLED();
                console.log("Telemetry successfully offloaded to Azure IoT Hub.");
            }
        });
    } catch (error) {
        console.error(`Telemetry Processing Interrupted: ${error.message}`);
    }
}

// System Startup Sequence
async function initializeSystem() {
    try {
        wpi.setup('wpi');
        wpi.pinMode(LED_PIN, wpi.OUTPUT);
        
        sensor = new BME280(BME280_OPTION);
        await sensor.init();
        console.log("Hardware Check: BME280 Environment Sensor Initialized.");

        client = Client.fromConnectionString(CONNECTION_STRING, Protocol);
        
        client.open((err) => {
            if (err) {
                console.error(`Gateway Authorization Error: ${err.message}`);
                return;
            }
            console.log("Cloud Pipeline Open: Connected to Azure IoT Hub securely.");
            setInterval(sendMessage, SEND_INTERVAL_MS);
        });

    } catch (error) {
        console.error(`Critical Initialization Failure: ${error.message}`);
        process.exit(1);
    }
}

initializeSystem();