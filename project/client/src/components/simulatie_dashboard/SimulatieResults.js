import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend } from "recharts";

import "./style/SimulatieResults.css";

const SimulatieResults = () => {
  const { userId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("month"); // 'month' or 'day'
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    // Fetch sun hours data for the user
    const fetchWeatherData = async () => {
      try {
        const params = {
          latitude: 51.808,
          longitude: 4.582,
          daily: ['sunshine_duration'], // Alleen zonuren ophalen
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
    // Fetch the simulation data for the user
    const fetchSimulationData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/simulatie/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.data && response.data.length > 0) {
          setResults(response.data[0]); // Get the first result
        } else {
          setResults(null);
        }
      } catch (error) {
        console.error("Error fetching simulation data:", error);
        Swal.fire({
          icon: "error",
          title: "Error Fetching Data",
          text: "Unable to fetch simulation data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    fetchSimulationData();
  }, [userId]);

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const formatChartData = () => {
    const sunshineDuration = weatherData.sunshine_duration || [];
    const totalSunshineHours = sunshineDuration.reduce((total, duration) => total + duration, 0) / 3600; // Totale zonuren
    const averageSunshinePerDay = totalSunshineHours / sunshineDuration.length; // Gemiddeld per dag

    const sunshineChartData = {
      labels: viewMode === 'month' ? ['Month'] : weatherData.time, // Als maand, toon 1 label
      datasets: [{
        label: 'Sunshine Hours (hours)',
        data: viewMode === 'month' ? [averageSunshinePerDay] : sunshineDuration.map(seconds => (seconds / 3600).toFixed(2)),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      }],
    };

    return sunshineChartData;
  };

  const calculateResults = (results) => {
    if (!results) return null;

    const monthlyEnergyUsage = results.totalEnergyUsage || 0;
    const dailyEnergyUsage = monthlyEnergyUsage / 30; // Assuming 30 days in a month

    const monthlyPanelOutput = results.totalPanelOutput || 0;
    const dailyPanelOutput = monthlyPanelOutput / 30; // Assuming 30 days in a month

    const monthlySavings = results.savings || 0;
    const dailySavings = monthlySavings / 30; // Assuming 30 days in a month

    return {
      monthly: {
        energyUsage: monthlyEnergyUsage.toFixed(2),
        panelOutput: monthlyPanelOutput.toFixed(2),
        savings: monthlySavings.toFixed(2),
        overschot: monthlyPanelOutput - monthlyEnergyUsage, // Calculating the overschot (surplus)
        tekort: monthlyEnergyUsage - monthlyPanelOutput,   // Calculating the tekort (deficit)
      },
      daily: {
        energyUsage: dailyEnergyUsage.toFixed(2),
        panelOutput: dailyPanelOutput.toFixed(2),
        savings: dailySavings.toFixed(2),
        overschot: dailyPanelOutput - dailyEnergyUsage, // Calculating the overschot (surplus)
        tekort: dailyEnergyUsage - dailyPanelOutput,   // Calculating the tekort (deficit)
      },
    };
  };

  const displayResults = calculateResults(results);

  // Functie om de LineChart data te genereren (met 24 uur per dag)
  const generateLineChartData = (results, viewMode) => {
    if (viewMode === "month") {
      // Maanddata: Hier geven we een maand over vier weken
      return [
        { name: "Week 1", energyUsage: results.totalEnergyUsage / 30, panelOutput: results.totalPanelOutput / 30 },
        { name: "Week 2", energyUsage: results.totalEnergyUsage / 30, panelOutput: results.totalPanelOutput / 30 },
        { name: "Week 3", energyUsage: results.totalEnergyUsage / 30, panelOutput: results.totalPanelOutput / 30 },
        { name: "Week 4", energyUsage: results.totalEnergyUsage / 30, panelOutput: results.totalPanelOutput / 30 },
      ];
    } else {
      // Per dag data: Verdeel de dag in 24 uur
      let hourlyData = [];
      const energyUsagePerHour = results.totalEnergyUsage / 24;
      const panelOutputPerHour = results.totalPanelOutput / 24;

      // Verdeel het energieverbruik en de zonnepaneeloutput per uur
      for (let hour = 0; hour < 24; hour++) {
        const timeLabel = `${hour.toString().padStart(2, "0")}:00`; // Gebruik 24-uurs formaat (bijv. 00:00, 01:00)
        hourlyData.push({
          name: timeLabel, // Uur van de dag (bijv. 00:00, 01:00, ..., 23:00)
          energyUsage: energyUsagePerHour,
          panelOutput: panelOutputPerHour,
        });
      }

      return hourlyData;
    }
  };

  // Functie om de PieChart data te genereren (per maand of per dag)
  const generatePieChartData = (results, viewMode) => {
    const overschot = viewMode === "month" ? displayResults.monthly.overschot : displayResults.daily.overschot;
    const tekort = viewMode === "month" ? displayResults.monthly.tekort : displayResults.daily.tekort;

    return [
      { name: "Overshoot", value: overschot > 0 ? overschot : 0, fill: "#00C853" }, // groen voor overschot
      { name: "Deficit", value: tekort > 0 ? tekort : 0, fill: "#D32F2F" }, // rood voor tekort
    ];
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!results) {
    return <div className="no-data">No simulation data found.</div>;
  }

  return (
    <div className="simulatie-results">
      <h2>Simulation Results</h2>

      {/* View Mode Switch (Month / Day) */}
      <div className="view-mode-toggle">
        <button onClick={() => handleViewChange("month")} className={viewMode === "month" ? "active" : ""}>
          Per Maand
        </button>
        <button onClick={() => handleViewChange("day")} className={viewMode === "day" ? "active" : ""}>
          Per Dag
        </button>
      </div>

      {/* Lijn grafiek voor Energieverbruik vs. Energieproductie */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={generateLineChartData(results, viewMode)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" /> {/* De X-as toont de tijdstippen per uur (00:00, 01:00, ..., 23:00) */}
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="energyUsage" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="panelOutput" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* Taartdiagram voor Energiebalans (Overschot of Tekort) */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={generatePieChartData(results, viewMode)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {generatePieChartData(results, viewMode).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <PieTooltip />
          <PieLegend />
        </PieChart>
      </ResponsiveContainer>

      {/* Display the total sunshine hours */}
      <Line data={formatChartData()} />

      {/* Display the results based on the selected view mode */}
      <div className="results-container">
        <div className="result-item">
          <strong>{viewMode === "month" ? "Total Energy Usage (kWh)" : "Average Energy Usage per Day (kWh)"}:</strong>
          {viewMode === "month" ? displayResults.monthly.energyUsage : displayResults.daily.energyUsage}
        </div>

        <div className="result-item">
          <strong>{viewMode === "month" ? "Solar Panel Energy Production (kWh)" : "Average Solar Panel Output per Day (kWh)"}:</strong>
          {viewMode === "month" ? displayResults.monthly.panelOutput : displayResults.daily.panelOutput}
        </div>

        <div className="result-item">
          <strong>{viewMode === "month" ? "Estimated Monthly Savings (EUR)" : "Estimated Daily Savings (EUR)"}:</strong>
          {viewMode === "month" ? displayResults.monthly.savings : displayResults.daily.savings}
        </div>
      </div>
    </div>
  );
};

export default SimulatieResults;
