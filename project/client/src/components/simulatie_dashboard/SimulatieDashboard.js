import React, { useState, useEffect, useMemo } from 'react';
import SunshineHours from './SunHours';
import EnergyPrices from './EnergyPrices';
import './style/SimulatieDashboard.css';

const SimulatieDashboard = () => {
  const [energyUsage, setEnergyUsage] = useState(0);
  const [solarPanelOutput, setSolarPanelOutput] = useState(0);
  const [batteryChargeTime, setBatteryChargeTime] = useState(0);

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

  // Handle form changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = Math.max(0, Number(value)); // Ensure no negative values
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
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
          <EnergyPrices />
        </div>
      </div>

      {/* Sunshine Hours */}
      <div className="energy-section">
        <div className="sunshine-hours">
          <SunshineHours />
        </div>
      </div>
      

      {/* Simulatie Form and Results */}
      <div className="forms-and-results">
        <div className="forms-container">
          {/* Household Energy Usage */}
          <div className="section">
            <h2>Bereken Energieverbruik</h2>
            <form>
              <label>Aantal bewoners</label>
              <input
                type="number"
                name="residents"
                value={formData.residents}
                onChange={handleChange}
              />
              <label>Grootte woning (m²)</label>
              <input
                type="number"
                name="houseSize"
                value={formData.houseSize}
                onChange={handleChange}
              />
              <label>Isolatieniveau</label>
              <select
                name="insulationLevel"
                value={formData.insulationLevel}
                onChange={handleChange}
              >
                <option value="low">Laag</option>
                <option value="medium">Middel</option>
                <option value="high">Hoog</option>
              </select>
              <label>Apparaatverbruik (kWh/dag)</label>
              <input
                type="number"
                name="appliancesUsage"
                value={formData.appliancesUsage}
                onChange={handleChange}
              />
              <label>Aantal dagen thuis</label>
              <input
                type="number"
                name="daysAtHome"
                value={formData.daysAtHome}
                onChange={handleChange}
              />
            </form>
            <button onClick={calculateEnergyUsage}>Bereken Energieverbruik</button>
            <div className="result-block">
              <h3>Totaal Energieverbruik: {energyUsage} kWh</h3>
            </div>
          </div>

          {/* Solar Panel Output */}
          <div className="section">
            <h2>Bereken Zonnepanelen Output</h2>
            <form>
              <label>Aantal panelen</label>
              <input
                type="number"
                name="panels"
                value={formData.panels}
                onChange={handleChange}
              />
              <label>Oppervlakte (m²)</label>
              <input
                type="number"
                name="panelArea"
                value={formData.panelArea}
                onChange={handleChange}
              />
              <label>Vermogen per m² (W)</label>
              <input
                type="number"
                name="panelPower"
                value={formData.panelPower}
                onChange={handleChange}
              />
              <label>Locatie</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
              >
                <option value="city">Stad</option>
                <option value="rural">Landelijk</option>
              </select>
            </form>
            <button onClick={calculateSolarPanelOutput}>Bereken Panelen Output</button>
            <div className="result-block">
              <h3>Zonnepanelen Output: {solarPanelOutput} kWh</h3>
            </div>
          </div>

          {/* Battery Charging */}
          <div className="section">
            <h2>Bereken Batterij Laadtijd</h2>
            <form>
              <label>Batterijcapaciteit (kWh)</label>
              <input
                type="number"
                name="batteryCapacity"
                value={formData.batteryCapacity}
                onChange={handleChange}
              />
              <label>Oplaadsnelheid (kW)</label>
              <input
                type="number"
                name="chargeRate"
                value={formData.chargeRate}
                onChange={handleChange}
              />
              <label>Efficiëntie (%)</label>
              <input
                type="number"
                name="batteryEfficiency"
                value={formData.batteryEfficiency}
                onChange={handleChange}
              />
            </form>
            <button onClick={calculateBatteryChargeTime}>Bereken Laadtijd</button>
            <div className="result-block">
              <h3>Batterij Laadtijd: {batteryChargeTime} uur</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatieDashboard;
