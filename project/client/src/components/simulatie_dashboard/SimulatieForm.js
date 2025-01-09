import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../AuthContext"; 
import Swal from "sweetalert2";

import "./style/SimulatieForm.css";

const SimulatieForm = () => {
  const { userData } = useAuth();
  const userId = userData?.id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    residents: 1,
    appliancesUsage: 5,
    daysAtHome: 30,
    panels: 1,
    panelArea: 20,
    panelPower: 200,
    location: "city",
    batteryCapacity: 10,
    chargeRate: 5,
    batteryEfficiency: 90,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Gebruikersfout",
        text: "Gebruikers-ID is niet beschikbaar. Log opnieuw in en probeer het opnieuw.",
      });
      setLoading(false);
      return;
    }

    try {
      const totalEnergyUsage = formData.residents * formData.appliancesUsage * (formData.daysAtHome / 30);
      const totalPanelOutput = (formData.panels * formData.panelArea * formData.panelPower * 30) / 1000;
      const usableBatteryStorage = (formData.batteryCapacity * formData.batteryEfficiency) / 100;
      const energyBalance = totalPanelOutput - totalEnergyUsage;

      const simulationResults = {
        ...formData,
        totalEnergyUsage,
        totalPanelOutput,
        usableBatteryStorage,
        energyBalance,
      };

      const response = await axios.post(
        "http://localhost:5000/api/simulatie",
        { ...simulationResults, user_id: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Simulatie opgeslagen",
        text: "Je simulatiegegevens zijn succesvol opgeslagen!",
      });
      navigate(`/simulatie-results/${userId}`);
    } catch (error) {
      console.error("Fout bij het opslaan van simulatie:", error);
      Swal.fire({
        icon: "error",
        title: "Serverfout",
        text: "Er is een probleem opgetreden bij het opslaan van je simulatie. Probeer het later opnieuw.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="simulatie-form" onSubmit={handleSubmit}>
      <h2>Simulatie Formulier</h2>
      <p className="form-description">
        Vul de onderstaande velden in om een simulatie te maken van je maandelijkse energieverbruik en productie.
      </p>

      {/* Energieverbruik */}
      <div className="form-section">
        <h3>Energieverbruik</h3>
        <label>
          <span className="label-text">
            Aantal bewoners
            <span className="tooltip">?
              <span className="tooltip-text">
                Het aantal mensen in je huishouden bepaalt het gemiddelde energieverbruik.
              </span>
            </span>
          </span>
          <input
            type="number"
            name="residents"
            min="1"
            value={formData.residents}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="label-text">
            Apparaatverbruik (kWh/maand)
            <span className="tooltip">?
              <span className="tooltip-text">
                Gemiddeld maandelijkse energieverbruik door huishoudelijke apparaten.
              </span>
            </span>
          </span>
          <input
            type="number"
            name="appliancesUsage"
            min="0"
            value={formData.appliancesUsage}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="label-text">
            Aantal dagen thuis per maand
            <span className="tooltip">?
              <span className="tooltip-text">
                Hoe vaak je thuis bent beïnvloedt je energieverbruik aanzienlijk.
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
          />
        </label>
      </div>

      {/* Zonnepanelen */}
      <div className="form-section">
        <h3>Zonnepanelen</h3>
        <label>
          <span className="label-text">
            Aantal panelen
            <span className="tooltip">?
              <span className="tooltip-text">
                Het aantal zonnepanelen bepaalt hoeveel energie je kunt produceren.
              </span>
            </span>
          </span>
          <input
            type="number"
            name="panels"
            min="1"
            value={formData.panels}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="label-text">
            Oppervlakte van panelen (m²)
            <span className="tooltip">?
              <span className="tooltip-text">
                De totale oppervlakte van je zonnepanelen beïnvloedt de energieproductie.
              </span>
            </span>
          </span>
          <input
            type="number"
            name="panelArea"
            min="0"
            value={formData.panelArea}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="label-text">
            Vermogen per m² (W)
            <span className="tooltip">?
              <span className="tooltip-text">
                Het vermogen van zonnepanelen bepaalt hoeveel energie ze produceren per uur.
              </span>
            </span>
          </span>
          <input
            type="number"
            name="panelPower"
            min="0"
            value={formData.panelPower}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Batterij */}
      <div className="form-section">
        <h3>Batterij</h3>
        <label>
          <span className="label-text">
            Batterijcapaciteit (kWh)
            <span className="tooltip">?
              <span className="tooltip-text">
                De totale opslagcapaciteit van je batterij voor energie.
              </span>
            </span>
          </span>
          <input
            type="number"
            name="batteryCapacity"
            min="0"
            value={formData.batteryCapacity}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="label-text">
            Oplaadsnelheid (kW)
            <span className="tooltip">?
              <span className="tooltip-text">
                Hoe snel je batterij kan opladen met overtollige energie.
              </span>
            </span>
          </span>
          <input
            type="number"
            name="chargeRate"
            min="0"
            value={formData.chargeRate}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="label-text">
            Efficiëntie (%)
            <span className="tooltip">?
              <span className="tooltip-text">
                Hoeveel van de opgeslagen energie daadwerkelijk bruikbaar is.
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
          />
        </label>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Opslaan..." : "Bereken Simulatie"}
      </button>
    </form>
  );
};

export default SimulatieForm;
