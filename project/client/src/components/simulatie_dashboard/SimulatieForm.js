import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Om te navigeren naar de resultatenpagina
import { useAuth } from "../AuthContext";  // Om toegang te krijgen tot de gebruiker van de context

import "./style/SimulatieForm.css";

const SimulatieForm = () => {
  const { userData } = useAuth(); // Haal gebruikersgegevens op uit de context
  const userId = userData?.id;  // Haal de user ID op uit de context
  const navigate = useNavigate();  // Voor het navigeren naar de resultatenpagina

  const [formData, setFormData] = useState({
    residents: 1,
    appliancesUsage: 150,
    daysAtHome: 30,
    panels: 10,
    panelArea: 20,
    panelPower: 200,
    location: "city",
    batteryCapacity: 5,
    chargeRate: 2,
    batteryEfficiency: 90,
  });

  const [loading, setLoading] = useState(false);  // Voor het weergeven van laadstatus

  // Verwerkt formulierinvoer
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : value, // Parseer cijfers naar getallen
    }));
  };

  // Verwerkt formulierverzending
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Zet loadingstatus op true

    if (!userId) {
      console.error("User ID is niet beschikbaar.");
      return;
    }

    try {
      // Stuur formulierdata naar de server
      await axios.post(
        "http://localhost:5000/api/simulatie",
        { ...formData, user_id: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Haal token op uit localStorage
          },
        }
      );

      // Navigeren naar de resultatenpagina
      navigate(`/simulatie-results/${userId}`);
    } catch (error) {
      console.error("Fout bij het opslaan van simulatie:", error);
    } finally {
      setLoading(false);  // Zet loadingstatus terug naar false
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
        <label>
          <span className="label-text">
            Locatie
            <span className="tooltip">?
              <span className="tooltip-text">
                In stedelijke gebieden is het aantal zonuren gemiddeld lager dan op het platteland.
              </span>
            </span>
          </span>
          <select name="location" value={formData.location} onChange={handleChange}>
            <option value="city">Stad</option>
            <option value="rural">Landelijk</option>
          </select>
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
