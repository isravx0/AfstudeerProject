import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "./style/EnergyPrices.css";

const todayURL = `http://localhost:5000/api/today-prices`;
const monthURL = `http://localhost:5000/api/monthly-prices`;

const EnergyPrices = () => {
  const [todayPrices, setTodayPrices] = useState([]);
  const [monthlyPrices, setMonthlyPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayRes = await axios.get(todayURL);
        const monthRes = await axios.get(monthURL);

        console.log("Today's data:", todayRes.data);
        console.log("Monthly data:", monthRes.data);

        // Log the first item of each data set to check its structure
        console.log("First item in today's data:", todayRes.data.data[0]);
        console.log("First item in monthly data:", monthRes.data.data[0]);

        if (Array.isArray(todayRes.data?.data) && Array.isArray(monthRes.data?.data)) {
          setTodayPrices(todayRes.data.data);
          setMonthlyPrices(monthRes.data.data);
        } else {
          console.error("Data is not an array:", todayRes.data?.data, monthRes.data?.data);
        }
      } catch (error) {
        console.error("Fout bij het ophalen van energieprijzen:", error.response || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate data for charts
  const formatChartData = (prices, labelKey) => ({
    labels: prices.map((item) => item.datum), // Use `datum` for date
    datasets: [
      {
        label: "Energieprijs (€ / kWh)",
        data: prices.map((item) => parseFloat(item.prijs)), // Use `prijs` for price
        fill: false,
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        tension: 0.4,
      },
    ],
  });

  return (
    <div className="energy-prices-container">
      <h1>Energy Prices Overview</h1>

      {loading ? (
        <p>Loading energy prices...</p>
      ) : (
        <>
          <div className="chart-container">
            <h2>Today's Electricity Prices</h2>
            {todayPrices.length ? (
              <Line
                data={formatChartData(todayPrices, "prijs")} // Use `prijs` for today prices
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: {
                    x: {
                      title: { display: true, text: "Time (CET)" },
                      ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                      },
                    },
                    y: {
                      title: { display: true, text: "Price (€ / kWh)" },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <p>No data available for today.</p>
            )}
          </div>

          <div className="chart-container">
            <h2>Electricity Prices - Last 30 Days</h2>
            {monthlyPrices.length ? (
              <Line
                data={formatChartData(monthlyPrices, "prijs")} // Use `prijs` for monthly prices
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: {
                    x: {
                      title: { display: true, text: "Date" },
                      ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                      },
                    },
                    y: {
                      title: { display: true, text: "Price (€ / kWh)" },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <p>No data available for the last 30 days.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EnergyPrices;
