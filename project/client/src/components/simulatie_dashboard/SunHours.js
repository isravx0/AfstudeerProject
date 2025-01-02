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
          console.error("API response bevat geen dagelijkse gegevens.");
        }
      } catch (error) {
        console.error("Fout bij het ophalen van weerdata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, []);

  const convertToHoursAndMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} uur ${minutes} minuten`;
  };

  const formatChartData = () => {
    const dates = weatherData.time || [];
    const temperatureMax = weatherData.temperature_2m_max || [];
    const temperatureMin = weatherData.temperature_2m_min || [];
    const uvIndexMax = weatherData.uv_index_max || [];
    const sunshineDuration = weatherData.sunshine_duration || [];

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
          label: 'Zonuren (uren)',
          data: sunshineDuration.map(seconds => (seconds / 3600).toFixed(2)),
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
        },
      ],
    };

    return { temperatureChartData, sunshineChartData };
  };

  return (
    <div className="sunshine-hours-container">
      <h1>Weersdata & Zonuren</h1>
      {loading ? (
        <p>Gegevens laden...</p>
      ) : (
        <div>
          <div className="charts-container">
            <div className="chart-item">
              <h2>Max & Min Temperaturen</h2>
              <Line data={formatChartData().temperatureChartData} />
            </div>
            <div className="chart-item">
              <h2>Zonuren (uren)</h2>
              <Line data={formatChartData().sunshineChartData} />
            </div>
          </div>
          <div className="sunshine-duration-table">
            <h2>Zonuren Tabel</h2>
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Zonuren</th>
                  <th>Zonsopgang</th>
                  <th>Zonsondergang</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.time.map((date, index) => {
                  const sunshineDuration = weatherData.sunshine_duration[index];
                  const sunrise = weatherData.sunrise[index];
                  const sunset = weatherData.sunset[index];

                  return (
                    <tr key={index}>
                      <td>{new Date(date).toLocaleDateString()}</td>
                      <td>{convertToHoursAndMinutes(sunshineDuration)}</td>
                      <td>{new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SunshineHours;
