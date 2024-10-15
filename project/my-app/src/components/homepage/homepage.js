import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./style/homepage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Homepage = () => {
  // State for weather data
  const [weatherData, setWeatherData] = useState([]);

  // Fetch weather data from API (OpenWeatherMap or any other API)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=14&appid=869cf6856a8ef54c9d6a541b3675ffe7`
        );
        setWeatherData(response.data.list);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Energy Production (kWh)",
        data: [12, 19, 3, 5, 2, 3, 7],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize dynamically
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  const pieChartData = {
    labels: ["Used Energy", "Available Energy"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow pie chart to resize dynamically
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="homepage">
      {/* Header Section */}
      <div className="header bg-primary text-white text-center p-5">
        <h1>Welcome, [User's Name]!</h1>
        <p>
          You have successfully logged in. This is your personal dashboard where
          you can manage all important data about your solar energy production
          and battery status. Use the navigation to explore different sections,
          or check your energy performance directly below.
        </p>
      </div>

      {/* Charts Section */}
      <div className="container charts-container my-4">
        <div className="homepage-charts-row">
          {/* Energy Production Summary */}
          <div className="col-md-4 chart-box">
            <h4>Energy Production Summary</h4>
            <Line
              data={lineChartData}
              options={lineChartOptions}
              style={{ height: "400px", width: "100%" }}
            />
          </div>

          {/* Current Battery Status */}
          <div className="col-md-4 chart-box">
            <h4>Current Battery Status</h4>
            <Pie
              data={pieChartData}
              options={pieChartOptions}
              style={{ height: "400px", width: "100%" }}
            />
          </div>

          {/* 14-Day weather forecast with Weather API */}
          <div className="col-md-4 chart-box">
            <h4>14-day weather forecast</h4>
            <div className="battery-status">
              {weatherData.length > 0 ? (
                <ul>
                  {weatherData.map((day, index) => (
                    <li key={index}>
                      <strong>{new Date(day.dt * 1000).toDateString()}:</strong>{" "}
                      {Math.round(day.temp.day - 273.15)}°C -{" "}
                      {day.weather[0].description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading weather data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
