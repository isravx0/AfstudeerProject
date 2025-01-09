import React, { useState, useEffect, useMemo } from 'react';
import SunshineHours from './SunHours';
import EnergyPrices from './EnergyPrices';
import './style/SimulatieDashboard.css';
import axios from 'axios';

const SimulatieDashboard = () => {
  const [energyUsage, setEnergyUsage] = useState(0);
  const [solarPanelOutput, setSolarPanelOutput] = useState(0);
  const [batteryChargeTime, setBatteryChargeTime] = useState(0);
  const [todayPrice, setTodayPrice] = useState(0);
  const [formData, setFormData] = useState({
    residents: 1,
    houseSize: 50,
    insulationLevel: 'low',
    appliancesUsage: 5, // kWh per day
    daysAtHome: 30,
    panels: 10,
    panelArea: 20, // m²
    panelPower: 200, // watts per m²
    location: 'city',
    batteryCapacity: 10, // kWh
    chargeRate: 5, // kW
    batteryEfficiency: 90, // percentage
  });

  // Fetch user simulation data when the component mounts
  useEffect(() => {
    const fetchSimulationData = async () => {
      try {
        // Replace with the actual API call to fetch the data
        const response = await axios.get('http://localhost:5000/api/simulatie', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        // Assuming the response contains the simulation data
        const simulationData = response.data;

        // Set form data with the fetched values
        setFormData({
          ...simulationData,
        });

        // Perform calculations once data is fetched
        calculateEnergyUsage();
        calculateSolarPanelOutput();
        calculateBatteryChargeTime();
      } catch (error) {
        console.error("Error fetching simulation data:", error);
      }
    };

    fetchSimulationData();
  }, []);

  // Handle form changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = Math.max(0, Number(value)); // Ensure no negative values
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // set energy price
  const handleTodayPriceUpdate = (price) => {
    setTodayPrice(price);
  };

  // Energy Usage Calculation
  const calculateEnergyUsage = () => {
    const { residents, appliancesUsage, daysAtHome } = formData;
    const energyUsage = residents * appliancesUsage * daysAtHome;
    setEnergyUsage(energyUsage);
  };

  // Solar Panel Output Calculation
  const calculateSolarPanelOutput = () => {
    const { panelArea, panelPower, location } = formData;
    const sunHours = location === 'city' ? 4 : 5; // Example: 4 hours in cities, 5 in rural
    const output = (panelArea * panelPower * sunHours) / 1000; // Convert to kWh
    setSolarPanelOutput(output);
  };

  // Battery Charge Time Calculation
  const calculateBatteryChargeTime = () => {
    const { batteryCapacity, chargeRate, batteryEfficiency } = formData;
    const chargeTime = (batteryCapacity / chargeRate) * (100 / batteryEfficiency);
    setBatteryChargeTime(chargeTime);
  };

  // Memoized Calculations for Performance
  const calculations = useMemo(() => {
    return {
      energyUsage: calculateEnergyUsage(),
      solarPanelOutput: calculateSolarPanelOutput(),
      batteryChargeTime: calculateBatteryChargeTime(),
    };
  }, [formData]);

  return (
    <div className="simulatie-dashboard dashboard-container">
      <h1>Simulatie Dashboard</h1>

      {/* Energy Prices */}
      <div className="energy-section">
        <div className="energy-prices">
          <EnergyPrices onTodayPriceUpdate={handleTodayPriceUpdate} />
          <p>De gemiddelde energieprijs van vandaag is: €{todayPrice.toFixed(3)} per kWh</p>
        </div>
      </div>

      {/* Sunshine Hours */}
      <div className="energy-section">
        <div className="sunshine-hours">
          <SunshineHours />
        </div>
      </div>

    </div>
  );
};

export default SimulatieDashboard;
