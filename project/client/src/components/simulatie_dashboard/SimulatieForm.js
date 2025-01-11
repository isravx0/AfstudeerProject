import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import "./style/SimulatieForm.css";

const SimulationForm = () => {
  const { userData } = useAuth();
  const userId = userData?.id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    residents: "",
    appliancesUsage: "",
    daysAtHome: "",
    panels: "",
    panelArea: "",
    panelPower: "",
    location: "city",
    batteryCapacity: "",
    chargeRate: "",
    batteryEfficiency: "",
    sunshineHours: 1,
    energyPrice: "",
    isDynamicPrice: false,
  });

  const [loading, setLoading] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);

  // Dynamic pricing data for the last 24 hours
  const [dynamicPrices, setDynamicPrices] = useState([
    0.20, 0.22, 0.18, 0.25, 0.24, 0.21, 0.19, 0.23, 0.22, 0.20, 0.21, 0.19,
    0.22, 0.23, 0.24, 0.25, 0.26, 0.22, 0.20, 0.18, 0.22, 0.21, 0.19, 0.23,
  ]);
  const hourlyEnergyUsage = Array(24).fill(1); // 1 kWh usage per hour as example

  // Fetch price data from API
  const fetchEnergyPrice = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/today-prices"); // Assuming this is the endpoint to get today's prices
      const prices = response.data?.data; // Assuming the data is inside "data"
      
      if (prices && prices.length > 0) {
        // Set the energy price to the one fetched from the API
        setFormData((prevState) => ({
          ...prevState,
          energyPrice: prices[0].prijs, // Assuming 'prijs' is the field for price
        }));
      } else {
        // Use dynamic prices if no data is returned
        console.log("No data available, using dynamic prices.");
        setFormData((prevState) => ({
          ...prevState,
          energyPrice: dynamicPrices[0], // Use first dynamic price as default
        }));
      }
    } catch (error) {
      console.error("Error fetching energy prices:", error);
      // Use dynamic prices if API call fails
      setFormData((prevState) => ({
        ...prevState,
        energyPrice: dynamicPrices[0], // Use first dynamic price as default
      }));
    }
  };

  // Fetch dynamic prices from an API if needed
  const fetchDynamicPrices = async () => {
    try {
      const response = await axios.get("/api/dynamic-prices"); // Update to your actual endpoint
      setDynamicPrices(response.data.prices || dynamicPrices);  // Use fetched prices or fallback
    } catch (error) {
      console.error("Error fetching dynamic prices:", error);
    }
  };

  useEffect(() => {
    const fetchSunshineData = async () => {
      try {
        const params = {
          latitude: 51.808, // Example latitude, use the actual value
          longitude: 4.582, // Example longitude, use the actual value
          daily: ["sunshine_duration"], // Request daily sunshine duration
          timezone: "auto", // Auto timezone based on the location
        };
    
        const response = await axios.get("https://api.open-meteo.com/v1/forecast", { params });
    
        // Extract sunshine duration in seconds
        const sunshineDuration = response.data.daily?.sunshine_duration?.[0] ?? 3600; // Default to 1 hour if not available
        const sunshineHours = sunshineDuration / 3600; // Convert seconds to hours
    
        console.log("Fetched Sunshine Hours:", sunshineHours); // Log sunshine hours to verify
    
        // Update the form data with the fetched sunshine hours
        setFormData((prevData) => ({
          ...prevData,
          sunshineHours: sunshineHours, // Set sunshine hours in the form state
        }));
      } catch (error) {
        console.error("Error fetching sunshine data:", error);
      }
    };
    

    fetchEnergyPrice();
    fetchSunshineData();
    fetchDynamicPrices(); // Fetch dynamic prices
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : isNaN(value) ? value : parseFloat(value),
    }));
  };
  

  const handleDynamicPriceToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      isDynamicPrice: !prevData.isDynamicPrice,
      energyPrice: prevData.isDynamicPrice ? "" : "0.22", // Set to 0.22 EUR for dynamic pricing by default
    }));
  };

  const setAverageValues = () => {
    setFormData({
      ...formData,
      residents: 2,
      appliancesUsage: 300,
      daysAtHome: 30,
      panels: 10,
      panelArea: 20,
      panelPower: 300,
      batteryCapacity: 5,
      chargeRate: 1,
      batteryEfficiency: 90,
      sunshineHours: 4,
      energyPrice: "0.22", // Average energy price in EUR
    });
  };

  const validateInput = () => {
    const {
      residents,
      appliancesUsage,
      daysAtHome,
      panels,
      panelArea,
      panelPower,
      batteryCapacity,
      chargeRate,
      batteryEfficiency,
      sunshineHours,
      energyPrice,
    } = formData;
  
    // Validate each field
    if (
      !residents ||
      residents <= 0 ||
      !appliancesUsage ||
      appliancesUsage < 0 ||
      !daysAtHome ||
      daysAtHome <= 0 ||
      !panels ||
      panels <= 0 ||
      !panelArea ||
      panelArea <= 0 ||
      !panelPower ||
      panelPower <= 0 ||
      !batteryCapacity ||
      batteryCapacity <= 0 ||
      !chargeRate ||
      chargeRate <= 0 ||
      !batteryEfficiency ||
      batteryEfficiency <= 0 ||
      batteryEfficiency > 100 ||
      !sunshineHours ||
      sunshineHours <= 0 ||
      !energyPrice ||
      energyPrice <= 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please ensure all fields are filled in correctly.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // First, validate the input
    if (!validateInput()) {
      return; // Exit if the validation fails
    }
  
    setLoading(true);
  
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "User Error",
        text: "User ID is not available. Please log in again and try.",
      });
      setLoading(false);
      return;
    }
  
    const adjustedFormData = {
      ...formData,
    };
  
    // Calculate total energy usage
    const totalEnergyUsage = (adjustedFormData.residents * adjustedFormData.appliancesUsage * adjustedFormData.daysAtHome) / 30;
  
    // Calculate daily solar panel output (kWh)
    const totalPanelOutput =
      (adjustedFormData.panels * adjustedFormData.panelArea * adjustedFormData.panelPower * adjustedFormData.sunshineHours * 0.85) / 1000; // Daily output in kWh
  
    // Log the sunshine hours and total panel output for debugging
    console.log("Sunshine Hours:", adjustedFormData.sunshineHours);
    console.log("Total Panel Output (kWh/day):", totalPanelOutput);
  
    // Calculate monthly solar output (kWh)
    const monthlyPanelOutput = totalPanelOutput * 30; // Monthly output in kWh
    console.log("Monthly Panel Output (kWh):", monthlyPanelOutput); // Log monthly output
  
    // Calculate usable battery storage
    const usableBatteryStorage = (adjustedFormData.batteryCapacity * adjustedFormData.batteryEfficiency) / 100;
  
    // Calculate the energy balance
    const energyBalance = monthlyPanelOutput - totalEnergyUsage + usableBatteryStorage;
  
    // Calculate the monthly energy cost
    const energyPricePerKWh = adjustedFormData.isDynamicPrice ? parseFloat(adjustedFormData.energyPrice) : 0.22;
    const monthlyEnergyCost = adjustedFormData.isDynamicPrice
      ? dynamicPrices.reduce((total, price, index) => total + price * hourlyEnergyUsage[index], 0)
      : totalEnergyUsage * 0.22;
  
    // Calculate savings
    const savings = energyBalance * energyPricePerKWh;
  
    // Store the simulation results
    const simulationResults = {
      ...adjustedFormData,
      totalEnergyUsage,
      totalPanelOutput,
      monthlyPanelOutput, // Add the monthly solar output
      usableBatteryStorage,
      energyBalance,
      monthlyEnergyCost,
      savings,
    };
  
    try {
      await axios.post(
        "http://localhost:5000/api/simulatie",
        { ...simulationResults, user_id: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      localStorage.setItem('simulationResults', JSON.stringify(simulationResults));
  
      Swal.fire({
        icon: "success",
        title: "Simulation Saved",
        text: "Your simulation data has been successfully saved!",
      });
  
      setSimulationResults(simulationResults); // Save the result to show the chart
      navigate(`/simulationResults/${userId}`);
    } catch (error) {
      console.error("Error saving simulation:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "There was an issue saving your simulation. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <form className="simulation-form" onSubmit={handleSubmit}>
  <h2>Simulation Form</h2>
  <p className="form-description">
    Fill in the fields below to create a simulation of your monthly energy usage and production.
  </p>

  {/* Energy Usage */}
  <div className="form-section">
    <h3>Energy Usage</h3>
    <label> 
      <span className="label-text">
        Number of Residents
        <span className="tooltip">?
          <span className="tooltip-text">
            The number of people in your household affects the average energy consumption.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="residents"
        min="1"
        value={formData.residents}
        onChange={handleChange}
        title="Enter the number of people living in the household"
      />
    </label>
    <label>
      <span className="label-text">
        Appliance Usage (kWh/month)
        <span className="tooltip">?
          <span className="tooltip-text">
            Enter the total energy usage of your household appliances per month in kilowatt-hours.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="appliancesUsage"
        min="0"
        value={formData.appliancesUsage}
        onChange={handleChange}
        title="Enter the total energy usage of your household appliances per month in kWh"
      />
    </label>
    <label>
      <span className="label-text">
        Days at Home per Month
        <span className="tooltip">?
          <span className="tooltip-text">
            Specify the number of days you are typically at home in a month.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="daysAtHome"
        min="0"
        max="31"
        value={formData.daysAtHome}
        onChange={handleChange}
        title="Enter the number of days you are at home each month"
      />
    </label>
  </div>

  {/* Solar Panels */}
  <div className="form-section">
    <h3>Solar Panels</h3>
    <label>
      <span className="label-text">
        Number of Panels
        <span className="tooltip">?
          <span className="tooltip-text">
            Specify how many solar panels you plan to install.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="panels"
        min="1"
        value={formData.panels}
        onChange={handleChange}
        title="Enter the number of solar panels you plan to install"
      />
    </label>
    <label>
      <span className="label-text">
        Panel Area (m²)
        <span className="tooltip">?
          <span className="tooltip-text">
            Enter the total area of a single solar panel in square meters.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="panelArea"
        min="0"
        value={formData.panelArea}
        onChange={handleChange}
        title="Enter the area of each solar panel in square meters"
      />
    </label>
    <label>
      <span className="label-text">
        Power per m² (W)
        <span className="tooltip">?
          <span className="tooltip-text">
            Specify the power output of each panel in watts per square meter.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="panelPower"
        min="0"
        value={formData.panelPower}
        onChange={handleChange}
        title="Enter the power output per square meter of the solar panel (in watts)"
      />
    </label>
  </div>

  {/* Battery */}
  <div className="form-section">
    <h3>Battery</h3>
    <label>
      <span className="label-text">
        Battery Capacity (kWh)
        <span className="tooltip">?
          <span className="tooltip-text">
            Enter the battery storage capacity in kilowatt-hours.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="batteryCapacity"
        min="0"
        value={formData.batteryCapacity}
        onChange={handleChange}
        title="Enter the battery capacity in kilowatt-hours (kWh)"
      />
    </label>
    <label>
      <span className="label-text">
        Charge Rate (kW)
        <span className="tooltip">?
          <span className="tooltip-text">
            Specify how fast your battery charges, in kilowatts.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="chargeRate"
        min="0"
        value={formData.chargeRate}
        onChange={handleChange}
        title="Enter the rate at which your battery charges, in kilowatts (kW)"
      />
    </label>
    <label>
      <span className="label-text">
        Efficiency (%)
        <span className="tooltip">?
          <span className="tooltip-text">
            Enter the efficiency of your battery system as a percentage.
          </span>
        </span>
      </span>
      <input
        type="number"
        name="batteryEfficiency"
        min="0"
        max="100"
        value={formData.batteryEfficiency}
        onChange={handleChange}
        title="Enter the efficiency of your battery in percentage"
      />
    </label>


    {/* Dynamic Pricing Toggle */}
    <div className="form-section">
    <h3>Dynamic Energy Prices</h3>
    <div className="form-field">
        <label>
          <input
            type="checkbox"
            checked={formData.isDynamicPrice}
            onChange={handleDynamicPriceToggle}
          />
          Use Dynamic Pricing
        </label>
      </div>
</div>

      {/* Buttons */}
      <div className="form-buttons">
        <button className= "set-average-btn" type="button" onClick={setAverageValues}>
          Set Default Values
        </button>

        <button className= "submit-btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Simulation"}
        </button>
      </div>
  </div>
</form>
  );
};

export default SimulationForm;
