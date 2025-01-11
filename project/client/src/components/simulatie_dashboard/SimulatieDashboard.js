import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "./style/SunHours.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SimulationDashboard = () => {
  const [weatherData, setWeatherData] = useState({});
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Haal de simulatiegegevens uit localStorage
    const data = localStorage.getItem('simulationResults');
    if (data) {
      setSimulationData(JSON.parse(data));
    } else {
      console.error("No simulation data found.");
    }

    // Haal de zongegevens op van Open-Meteo API
    const fetchWeatherData = async () => {
      try {
        const params = {
          latitude: 51.808, // Stel je locatie in
          longitude: 4.582,
          daily: ['sunshine_duration'], // Haal alleen de zonuren op
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

  if (loading || !simulationData) {
    return <div>Loading...</div>;
  }

  // Zet zonuren om naar uren in een bruikbare vorm (uitleg in de vorige code)
  const sunshineHours = weatherData.sunshine_duration || [];
  const hours = Array.from({ length: 24 }, (_, index) => index);

  // Energieverbruik berekenen
  const energyUsage = hours.map((hour) => {
    if (hour >= 7 && hour <= 9) return simulationData.residents * 0.4;
    if (hour >= 12 && hour <= 14) return simulationData.residents * 0.6;
    if (hour >= 17 && hour <= 19) return simulationData.residents * 1;
    return simulationData.residents * 0.2;
  });

  // Dynamische zonneproductie op basis van zonuren
  const solarProduction = hours.map((hour) => {
    const sunshineDuration = sunshineHours[hour] || 0; // Zonuren in seconden
    const peakHour = 12; // Maximum zonneproductie rond 12:00
    const intensity = (Math.cos((Math.PI / 12) * (hour - peakHour)) + 1) / 2; // Cosinus voor natuurlijke piek
    return intensity * (sunshineDuration / 3600) * simulationData.panels * simulationData.panelPower;
  });
  

  // Chartdata configureren
  const chartData = {
    labels: hours,
    datasets: [
      {
        label: 'Energy Consumption',
        data: energyUsage,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: true,
        stepped: false,
      },
      {
        label: 'Energy Created by Solar',
        data: solarProduction,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        fill: true,
        stepped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'kWh',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="simulation-dashboard" style={{ width: '80%', height: '500px', margin: '0 auto' }}>
      <h2>Energy Consumption vs. Solar Production</h2>
      <p>
        This chart shows how energy consumption and solar production intersect throughout the day.
        The area above the solar line indicates exported energy, while the area below indicates unmet consumption.
      </p>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default SimulationDashboard;
