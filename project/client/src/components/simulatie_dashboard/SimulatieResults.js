import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import "./style/SimulatieResults.css";

const SimulatieResults = () => {
  const { userId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimulationData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/simulatie/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.data && response.data.length > 0) {
          setResults(response.data[0]); // Neem het eerste resultaat
        } else {
          setResults(null);
        }
      } catch (error) {
        console.error("Fout bij ophalen van simulatiegegevens:", error);
        Swal.fire({
          icon: "error",
          title: "Fout bij ophalen",
          text: "Kan simulatiegegevens niet ophalen. Probeer het opnieuw.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSimulationData();
  }, [userId]);

  if (loading) {
    return <div className="loading">Gegevens laden...</div>;
  }

  if (!results) {
    return <div className="no-data">Geen simulatiegegevens gevonden.</div>;
  }

  return (
    <div className="simulatie-results">
      <h2>Simulatieresultaten</h2>
      <div className="results-container">
        {results ? (
          <>
            <div className="result-item">
              <strong>
                Totaal Energieverbruik (kWh):
              </strong>
              {results.totalEnergyUsage ? results.totalEnergyUsage.toFixed(2) : 'N/A'}
              <span className="tooltip">
                  ?
                  <span className="tooltip-text">
                    Dit is het totaal verbruik van je huishoudelijke apparaten in een maand, berekend op basis van het aantal bewoners en hun gebruik.
                  </span>
                </span>
            </div>

            <div className="result-item">
              <strong>
                Energieproductie Zonnepanelen (kWh):
              </strong>
              {results.totalPanelOutput ? results.totalPanelOutput.toFixed(2) : 'N/A'}
              <span className="tooltip">
                  ?
                  <span className="tooltip-text">
                    Dit is de energie die je zonnepanelen gedurende de maand produceren, berekend op basis van het aantal panelen, de oppervlakte en het vermogen per m².
                  </span>
                </span>
            </div>

            <div className="result-item">
              <strong>
                Bruikbare Batterijcapaciteit (kWh):
              </strong>
              {results.usableBatteryStorage ? results.usableBatteryStorage.toFixed(2) : 'N/A'}
              <span className="tooltip">
                  ?
                  <span className="tooltip-text">
                    Dit is de capaciteit van de batterij die daadwerkelijk bruikbaar is, rekening houdend met de efficiëntie van de batterij.
                  </span>
                </span>
            </div>

            <div className="result-item">
              <strong>
                Energiebalans (kWh):

              </strong>
              {results.energyBalance !== undefined ? 
                (results.energyBalance > 0 ? 
                  `Overschot (${results.energyBalance.toFixed(2)})` 
                  : `Tekort (${Math.abs(results.energyBalance).toFixed(2)})`) 
                : 'N/A'}
                <span className="tooltip">
                  ?
                  <span className="tooltip-text">
                    Dit geeft aan of je zonnepanelen voldoende energie produceren voor je verbruik. Een positieve waarde geeft een overschot aan energie, terwijl een negatieve waarde een tekort aangeeft.
                  </span>
                </span>
            </div>
          </>
        ) : (
          <div>Geen simulatiegegevens gevonden.</div>
        )}
      </div>
    </div>
  );
};

export default SimulatieResults;
