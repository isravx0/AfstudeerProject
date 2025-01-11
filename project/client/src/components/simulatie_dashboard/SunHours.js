import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "./style/SunHours.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SunshineHours = () => {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const params = {
          latitude: 51.808,
          longitude: 4.582,
          daily: [
            'temperature_2m_max',
            'temperature_2m_min',
            'sunrise',
            'sunset',
            'sunshine_duration', 
            'uv_index_max',
          ],
          timezone: 'auto',
        };

        const response = await axios.get("https://api.open-meteo.com/v1/forecast", { params });
        if (response.data && response.data.daily) {
          setWeatherData(response.data.daily);
        } else {
          console.error("API response does not contain daily data.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, []);

  // Convert seconds to hours and minutes
  const convertToHoursAndMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
  };

  // Format the data for charting
  const formatChartData = () => {
    const dates = weatherData.time || [];
    const temperatureMax = weatherData.temperature_2m_max || [];
    const temperatureMin = weatherData.temperature_2m_min || [];
    const uvIndexMax = weatherData.uv_index_max || [];
    const sunshineDuration = weatherData.sunshine_duration || [];

    const totalSunshineHours = sunshineDuration.reduce((total, duration) => total + duration, 0) / 3600; // Sum all sunshine durations and convert to hours

    const temperatureChartData = {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Max Temp (°C)',
          data: temperatureMax,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Min Temp (°C)',
          data: temperatureMin,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
      ],
    };

    const sunshineChartData = {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Sunshine Hours (hours)',
          data: sunshineDuration.map(seconds => (seconds / 3600).toFixed(2)),
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
        },
      ],
    };

    return { temperatureChartData, sunshineChartData, totalSunshineHours };
  };

  return (
    <div className="sunshine-hours-container">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <div className="charts-container">
            <div className="chart-item">
              <h2>Max & Min Temperatures</h2>
              <Line data={formatChartData().temperatureChartData} />
            </div>
            <div className="chart-item">
              <h2>Sunshine Hours (hours)</h2>
              <Line data={formatChartData().sunshineChartData} />
            </div>
          </div>

          {/* Display Monthly Sunshine Hours */}
          {/* <div className="monthly-sunshine">
            <h3>Total Sunshine Hours for the Month: {formatChartData().totalSunshineHours.toFixed(2)} hours</h3>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default SunshineHours;
