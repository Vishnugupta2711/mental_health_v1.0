import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ChartBoxReal = () => {
  const [data, setData] = useState([]); // Stores historical chart data
  const [latestData, setLatestData] = useState({}); // Stores the most recent data
  const [selectedChart, setSelectedChart] = useState("heart_rate");

  // Fetch data from the ESP8266 server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.4.1/api/data");
        const result = await response.json();

        // Update historical data and latest data
        setLatestData(result);
        setData((prevData) => [
          ...prevData.slice(-19), // Keep only the latest 20 entries for performance
          { ...result, time: new Date().toLocaleTimeString() }, // Add timestamp
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    fetchData(); // Initial fetch

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    <div className="h-96 p-4 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Wellness Trends</h2>
          <p className="text-sm text-gray-500">Track your live metrics</p>
        </div>
        <div className="flex space-x-2">
          {["heart_rate", "oxygen_level", "ir_value", "red_value"].map(
            (metric) => (
              <button
                key={metric}
                onClick={() => setSelectedChart(metric)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  selectedChart === metric
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {metric.replace("_", " ").toUpperCase()}
              </button>
            )
          )}
        </div>
      </div>

      {/* Display latest readings */}
      <div className="flex justify-around items-center mb-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Heart Rate</h3>
          <p className="text-2xl text-blue-600 font-bold">
            {latestData.heart_rate || 0} bpm
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Oxygen Level</h3>
          <p className="text-2xl text-green-600 font-bold">
            {latestData.oxygen_level || 0}%
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">IR Value</h3>
          <p className="text-2xl text-gray-700">{latestData.ir_value || 0}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Red Value</h3>
          <p className="text-2xl text-gray-700">{latestData.red_value || 0}</p>
        </div>
      </div>

      {/* Chart for selected metric */}
      <ResponsiveContainer width="100%" height="70%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={selectedChart}
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorMetric)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBoxReal;
