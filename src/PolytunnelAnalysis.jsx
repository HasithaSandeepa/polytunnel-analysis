import { useState } from "react";

const PolytunnelAnalysis = () => {
  const [activeView, setActiveView] = useState("heatmap");

  // Sensor statistics from analysis
  const sensorStats = {
    "S1.1": {
      section: 1,
      sensorNum: 1,
      temperature: { mean: 31.65, max: 107.0, min: 23.4, std: 4.26 },
      humidity: { mean: 72.39, max: 95.0, min: 0.8, std: 11.51 },
    },
    "S1.2": {
      section: 1,
      sensorNum: 2,
      temperature: { mean: 31.58, max: 42.3, min: 21.8, std: 3.63 },
      humidity: { mean: 73.61, max: 100.0, min: 44.4, std: 13.4 },
    },
    "S1.3": {
      section: 1,
      sensorNum: 3,
      temperature: { mean: 31.84, max: 42.2, min: 22.4, std: 3.33 },
      humidity: { mean: 70.04, max: 93.0, min: 43.2, std: 11.9 },
    },
    "S1.4": {
      section: 1,
      sensorNum: 4,
      temperature: { mean: 31.63, max: 40.4, min: 24.3, std: 3.13 },
      humidity: { mean: 73.16, max: 96.3, min: 48.3, std: 11.83 },
    },
    "S1.5": {
      section: 1,
      sensorNum: 5,
      temperature: { mean: 32.06, max: 40.3, min: 24.5, std: 3.14 },
      humidity: { mean: 69.32, max: 91.8, min: 46.9, std: 11.03 },
    },
    "S2.1": {
      section: 2,
      sensorNum: 1,
      temperature: { mean: 30.29, max: 40.0, min: 24.2, std: 3.9 },
      humidity: { mean: 77.6, max: 94.2, min: 46.1, std: 13.66 },
    },
    "S2.2": {
      section: 2,
      sensorNum: 2,
      temperature: { mean: 30.64, max: 42.2, min: 24.1, std: 4.29 },
      humidity: { mean: 77.58, max: 96.3, min: 43.8, std: 15.26 },
    },
    "S2.3": {
      section: 2,
      sensorNum: 3,
      temperature: { mean: 30.82, max: 42.6, min: 24.4, std: 4.39 },
      humidity: { mean: 72.72, max: 89.1, min: 40.9, std: 14.47 },
    },
    "S2.4": {
      section: 2,
      sensorNum: 4,
      temperature: { mean: 30.18, max: 39.9, min: 24.2, std: 3.86 },
      humidity: { mean: 80.77, max: 97.5, min: 47.1, std: 14.46 },
    },
    "S2.5": {
      section: 2,
      sensorNum: 5,
      temperature: { mean: 30.33, max: 39.5, min: 24.3, std: 4.01 },
      humidity: { mean: 77.75, max: 94.4, min: 48.2, std: 13.84 },
    },
    "S3.1": {
      section: 3,
      sensorNum: 1,
      temperature: { mean: 29.11, max: 39.4, min: 24.4, std: 3.69 },
      humidity: { mean: 82.02, max: 94.9, min: 49.8, std: 12.52 },
    },
    "S3.2": {
      section: 3,
      sensorNum: 2,
      temperature: { mean: 29.4, max: 41.4, min: 24.6, std: 3.9 },
      humidity: { mean: 83.31, max: 96.7, min: 46.1, std: 13.67 },
    },
    "S3.3": {
      section: 3,
      sensorNum: 3,
      temperature: { mean: 29.67, max: 43.6, min: 24.7, std: 4.15 },
      humidity: { mean: 80.08, max: 93.7, min: 41.1, std: 14.19 },
    },
    "S3.4": {
      section: 3,
      sensorNum: 4,
      temperature: { mean: 29.57, max: 42.2, min: 24.8, std: 3.93 },
      humidity: { mean: 79.91, max: 92.9, min: 43.2, std: 13.31 },
    },
    "S3.5": {
      section: 3,
      sensorNum: 5,
      temperature: { mean: 29.64, max: 41.3, min: 24.8, std: 3.93 },
      humidity: { mean: 82.86, max: 96.4, min: 48.6, std: 13.44 },
    },
  };

  // Calculate positions for 50x20 ft tunnel with 3 sections
  const getPosition = (section, sensor) => {
    // 20ft side divided into 3 sections (each ~6.67ft wide)
    // 50ft side divided into 5 sensor positions (each 10ft apart)

    // Section Y positions (across 20ft width)
    const sectionY = {
      1: 3.33, // Section 1: 0-6.67ft, center at 3.33ft
      2: 10, // Section 2: 6.67-13.33ft, center at 10ft
      3: 16.67, // Section 3: 13.33-20ft, center at 16.67ft
    };

    // Sensor X positions (along 50ft length)
    // Sensors 1-5 positioned at 5ft, 15ft, 25ft, 35ft, 45ft
    const sensorX = 5 + (sensor - 1) * 10;

    return {
      x: sensorX,
      y: sectionY[section],
    };
  };

  // Create heatmap data
  const heatmapData = Object.entries(sensorStats).map(([key, stats]) => {
    const pos = getPosition(stats.section, stats.sensorNum);
    return {
      id: key,
      x: pos.x,
      y: pos.y,
      temperature: stats.temperature.mean,
      humidity: stats.humidity.mean,
      tempVariability: stats.temperature.std,
      humidityVariability: stats.humidity.std,
      section: stats.section,
      sensor: stats.sensorNum,
    };
  });

  // Calculate optimal fan positions based on problem areas
  const calculateFanRecommendations = () => {
    // Identify high temperature and high humidity zones
    const highTempThreshold = 31.5;
    const highHumidityThreshold = 80;
    const highVariabilityThreshold = 4;

    const problemAreas = heatmapData.filter(
      (point) =>
        point.temperature > highTempThreshold ||
        point.humidity > highHumidityThreshold ||
        point.tempVariability > highVariabilityThreshold
    );

    // Recommended fan positions for cucumber cultivation
    const fanRecommendations = [
      {
        id: "Fan1",
        x: 5,
        y: 1,
        type: "Exhaust",
        purpose: "Remove hot air from Section 1 (highest temperature zone)",
        cfm: 1200,
        reason:
          "Section 1 shows highest temperatures (31.6-32.1°C average) at sensor positions 1.1-1.5",
      },
      {
        id: "Fan2",
        x: 25,
        y: 19,
        type: "Intake",
        purpose: "Bring fresh air to center of tunnel for overall circulation",
        cfm: 1000,
        reason:
          "Central position to create cross-flow ventilation across all sections",
      },
      {
        id: "Fan3",
        x: 45,
        y: 1,
        type: "Exhaust",
        purpose: "Remove humid air from Section 3 (highest humidity zone)",
        cfm: 1500,
        reason:
          "Section 3 shows highest humidity (80-83% average) at sensor positions 3.1-3.5",
      },
      {
        id: "Fan4",
        x: 15,
        y: 19,
        type: "Intake",
        purpose: "Provide additional fresh air intake for middle sections",
        cfm: 800,
        reason:
          "Support air circulation in the center area where Section 2 sensors show moderate conditions",
      },
      {
        id: "Fan5",
        x: 35,
        y: 19,
        type: "Intake",
        purpose: "Create cross-ventilation pattern with exhaust fans",
        cfm: 800,
        reason:
          "Balance the exhaust system and ensure proper air exchange throughout tunnel",
      },
    ];

    return { fanRecommendations, problemAreas };
  };

  const { fanRecommendations, problemAreas } = calculateFanRecommendations();

  // Color scale for temperature
  const getTemperatureColor = (temp) => {
    const normalized = (temp - 29) / (32.1 - 29);
    const r = Math.round(normalized * 255);
    const b = Math.round((1 - normalized) * 255);
    return `rgb(${r}, 100, ${b})`;
  };

  // Color scale for humidity
  const getHumidityColor = (humidity) => {
    const normalized = (humidity - 69) / (83 - 69);
    const g = Math.round(normalized * 255);
    const b = Math.round((1 - normalized) * 255);
    return `rgb(100, ${g}, ${b})`;
  };

  const TunnelLayout = ({ showFans = false, metric = "temperature" }) => (
    <div className="relative w-full h-96 bg-green-50 border-2 border-green-300 rounded-lg overflow-hidden">
      {/* Tunnel outline */}
      <div className="absolute inset-2 border-2 border-gray-400 rounded bg-gradient-to-b from-blue-50 to-green-100">
        {/* Section labels */}
        <div className="absolute top-13 left-4 text-xs font-bold text-gray-600">
          Section 1
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-xs font-bold text-gray-600">
          Section 2
        </div>
        <div className="absolute bottom-13 left-4 text-xs font-bold text-gray-600">
          Section 3
        </div>

        {/* Scale indicators */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500">
          0 ft
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          50 ft
        </div>
        <div className="absolute top-2 left-1 text-xs text-gray-500">20 ft</div>

        {/* Sensors */}
        {heatmapData.map((point) => {
          const color =
            metric === "temperature"
              ? getTemperatureColor(point.temperature)
              : getHumidityColor(point.humidity);
          const value =
            metric === "temperature"
              ? point.temperature.toFixed(1)
              : point.humidity.toFixed(1);
          const unit = metric === "temperature" ? "°C" : "%";

          return (
            <div
              key={point.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${(point.x / 50) * 100}%`,
                top: `${(point.y / 20) * 100}%`,
              }}
              title={`${point.id}: ${value}${unit}`}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {point.sensor}
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {point.id}: {value}
                {unit}
              </div>
            </div>
          );
        })}

        {/* Fan recommendations */}
        {showFans &&
          fanRecommendations.map((fan) => (
            <div
              key={fan.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${(fan.x / 50) * 100}%`,
                top: `${(fan.y / 20) * 100}%`,
              }}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                  fan.type === "Exhaust"
                    ? "bg-red-500 border-red-700"
                    : "bg-blue-500 border-blue-700"
                }`}
              >
                {fan.type === "Exhaust" ? "↑" : "↓"}
              </div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 max-w-48">
                <div className="font-bold">
                  {fan.id} ({fan.type})
                </div>
                <div>{fan.purpose}</div>
                <div>CFM: {fan.cfm}</div>
              </div>
            </div>
          ))}

        {/* Cucumber growing zones indication */}
        <div className="absolute inset-4 border border-dashed border-green-600 rounded ">
          <div className="absolute top-1 left-1 text-xs text-green-700 font-semibold">
            Cucumber Growing Zone
          </div>
        </div>
      </div>
    </div>
  );

  const StatisticsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Sensor
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Section
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Temp (°C)
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Temp Range
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Humidity (%)
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Humidity Range
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Object.entries(sensorStats).map(([key, stats]) => {
            const tempStatus =
              stats.temperature.mean > 31.5
                ? "High"
                : stats.temperature.mean < 29
                ? "Low"
                : "Optimal";
            const humidityStatus =
              stats.humidity.mean > 80
                ? "High"
                : stats.humidity.mean < 70
                ? "Low"
                : "Optimal";
            const overallStatus =
              tempStatus === "Optimal" && humidityStatus === "Optimal"
                ? "Good"
                : "Needs Attention";

            return (
              <tr
                key={key}
                className={
                  overallStatus === "Needs Attention" ? "bg-yellow-50" : ""
                }
              >
                <td className="px-4 py-2 text-sm font-medium text-gray-900">
                  {key}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  Section {stats.section}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {stats.temperature.mean}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {stats.temperature.min} - {stats.temperature.max}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {stats.humidity.mean}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {stats.humidity.min} - {stats.humidity.max}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      overallStatus === "Good"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {overallStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const FanRecommendations = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">
          Optimal Fan Placement Strategy
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          Based on analysis of temperature and humidity patterns across 796 data
          points, here are the recommended fan placements for optimal cucumber
          cultivation:
        </p>
      </div>

      {fanRecommendations.map((fan, index) => (
        <div
          key={fan.id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    fan.type === "Exhaust" ? "bg-red-500" : "bg-blue-500"
                  }`}
                >
                  {index + 1}
                </span>
                <h4 className="font-semibold text-lg">
                  {fan.id} - {fan.type} Fan
                </h4>
              </div>
              <p className="text-gray-700 mb-1">
                <strong>Purpose:</strong> {fan.purpose}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Recommended CFM:</strong> {fan.cfm}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Position:</strong> {fan.x}ft from left, {fan.y}ft from
                front
              </p>
              <p className="text-sm text-gray-600 italic">{fan.reason}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-bold mb-2">
          Key Findings for Cucumber Cultivation:
        </h4>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>
            • <strong>Section 1 (0-6.7ft width):</strong> Highest temperatures
            (31.6-32.1°C avg) across all 5 sensor positions
          </li>
          <li>
            • <strong>Section 2 (6.7-13.3ft width):</strong> Moderate conditions
            but high humidity in some sensors
          </li>
          <li>
            • <strong>Section 3 (13.3-20ft width):</strong> Highest humidity
            (80-83% avg) across length of section
          </li>
          <li>
            • <strong>Length pattern (50ft):</strong> Sensors at 5ft, 15ft,
            25ft, 35ft, 45ft positions show varying conditions
          </li>
          <li>
            • <strong>Optimal cucumber range:</strong> 21-29°C temperature,
            60-70% humidity
          </li>
          <li>
            • <strong>Current issues:</strong> Section 1 too hot, Section 3 too
            humid, need cross-ventilation
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6  min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Polytunnel Climate Analysis & Fan Placement Optimization
        </h1>
        <p className="text-center text-gray-600 mb-6">
          50ft × 20ft Tunnel - Cucumber Cultivation - 15 Sensor Network Analysis
        </p>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveView("heatmap")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === "heatmap"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Temperature Heatmap
          </button>
          <button
            onClick={() => setActiveView("humidity")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === "humidity"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Humidity Heatmap
          </button>
          <button
            onClick={() => setActiveView("fans")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === "fans"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Fan Placement
          </button>
          <button
            onClick={() => setActiveView("statistics")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === "statistics"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {activeView === "heatmap" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Temperature Distribution Heatmap
              </h2>
              <TunnelLayout metric="temperature" />
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getTemperatureColor(29) }}
                  ></div>
                  <span>29°C (Cool)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getTemperatureColor(30.5) }}
                  ></div>
                  <span>30.5°C (Optimal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getTemperatureColor(32) }}
                  ></div>
                  <span>32°C (Hot)</span>
                </div>
              </div>
            </div>
          )}

          {activeView === "humidity" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Humidity Distribution Heatmap
              </h2>
              <TunnelLayout metric="humidity" />
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getHumidityColor(70) }}
                  ></div>
                  <span>70% (Low)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getHumidityColor(76) }}
                  ></div>
                  <span>76% (Moderate)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getHumidityColor(83) }}
                  ></div>
                  <span>83% (High)</span>
                </div>
              </div>
            </div>
          )}

          {activeView === "fans" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Recommended Fan Placement
              </h2>
              <TunnelLayout showFans={true} metric="temperature" />
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    ↑
                  </div>
                  <span>Exhaust Fan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    ↓
                  </div>
                  <span>Intake Fan</span>
                </div>
              </div>
              <div className="mt-6">
                <FanRecommendations />
              </div>
              {/* Display problem areas */}
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-2 text-red-700">
                  Problem Areas
                </h3>
                {problemAreas.length === 0 ? (
                  <div className="text-gray-600">
                    No problem areas detected.
                  </div>
                ) : (
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">
                          Sensor
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">
                          Section
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">
                          Temp (°C)
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">
                          Humidity (%)
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">
                          Temp Variability
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">
                          Humidity Variability
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {problemAreas.map((area) => (
                        <tr key={area.id} className="bg-red-50">
                          <td className="px-2 py-1 text-sm font-medium text-gray-900">
                            {area.id}
                          </td>
                          <td className="px-2 py-1 text-sm text-gray-600">
                            {area.section}
                          </td>
                          <td className="px-2 py-1 text-sm text-gray-900">
                            {area.temperature.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 text-sm text-gray-900">
                            {area.humidity.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 text-sm text-gray-900">
                            {area.tempVariability.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 text-sm text-gray-900">
                            {area.humidityVariability.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeView === "statistics" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Detailed Sensor Statistics
              </h2>
              <StatisticsTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolytunnelAnalysis;
