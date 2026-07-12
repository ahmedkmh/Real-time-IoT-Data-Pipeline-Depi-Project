drop table if exists SensorReadings
drop table if exists Devices
drop table if exists Farms
drop table if exists Locations
drop sequence if exists CitySeq
drop table if exists Crops


CREATE TABLE Devices (
    DeviceId VARCHAR(50) PRIMARY KEY,
    FirmwareVersion VARCHAR(20),
);

CREATE SEQUENCE CitySeq
    START WITH 1
    INCREMENT BY 1
    NO CACHE;

CREATE TABLE Locations (
    LocationId INT PRIMARY KEY DEFAULT (NEXT VALUE FOR CitySeq),
    City VARCHAR(100) UNIQUE
);

INSERT INTO Locations (City) VALUES ('Cairo'), ('Alexandria'), ('Giza'), ('Port Said'), ('Suez'), ('Ismailia'), ('Damietta'), ('Mansoura'), ('Tanta'), ('Zagazig'), ('Benha'), ('Kafr El Sheikh'), ('Fayoum'), ('Beni Suef'), ('Minya'), ('Assiut'), ('Sohag'), ('Qena'), ('Luxor'), ('Aswan');

CREATE TABLE Farms (
    FarmName VARCHAR(100) UNIQUE,
    City VARCHAR(100) FOREIGN KEY REFERENCES Locations(City)
);

CREATE TABLE Crops (
    CropName VARCHAR(100) UNIQUE,
    SoilType VARCHAR(50)
);

CREATE TABLE SensorReadings (
    Timestamp DATETIME2,
    DeviceId VARCHAR(50) FOREIGN KEY REFERENCES Devices(DeviceId),
    FarmName VARCHAR(100) FOREIGN KEY REFERENCES Farms(FarmName),
    CropName VARCHAR(100) FOREIGN KEY REFERENCES Crops(CropName),
    Hour AS DATEPART(hour, Timestamp),
    [Shift] VARCHAR(20),
    Weather VARCHAR(100),
    Temperature FLOAT,
    Humidity FLOAT,
    Pressure FLOAT,
    SoilMoisture INT,
    AirQuality INT,
    Co2 INT,
    LightIntensity INT,
    BatteryLevel FLOAT,
    CpuUsage FLOAT,
    MemoryUsage FLOAT,
    TemperatureAlert BIT,
    HumidityAlert BIT,
);

select * from Devices
select * from locations ORDER BY LocationId;
select * from Farms
select * from Crops
select * from sensorreadings order by Timestamp