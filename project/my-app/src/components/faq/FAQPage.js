import React, { useState } from 'react';
import './style/FAQPage.css';
import faqHeaderImage from './images/faq.png';

const questionsAndAnswers = [
    { id: 1, question: "How does the system estimate battery life?", answer: "The system uses a combination of usage patterns, temperature, and battery specifications to estimate battery longevity." },
    { id: 2, question: "How do I interpret the simulation results?", answer: "Simulation results offer insights into daily energy production, potential savings, and system efficiency. Please refer to our guide for detailed explanations." },
    { id: 3, question: "Is it possible to add more solar panels in the simulation?", answer: "Yes, you can increase the number of panels in the simulation to see how additional panels affect energy production." },
    { id: 4, question: "Can I simulate different solar panel brands?", answer: "Yes, the simulation tool allows you to compare different solar panel brands to see how each performs." },
    { id: 5, question: "How accurate is the energy output prediction?", answer: "Our simulation uses advanced algorithms and weather data to predict energy output with high accuracy, though actual results may vary." },
    { id: 6, question: "What factors affect battery performance?", answer: "Battery performance can be affected by factors such as temperature, charge cycles, and energy demand." },
    { id: 7, question: "How can I maximize the battery life of my system?", answer: "To extend battery life, avoid deep discharges, maintain optimal temperature, and use energy efficiently." },
    { id: 8, question: "What is included in the simulation report?", answer: "The report includes estimated energy production, cost savings, environmental impact, and a breakdown of potential system efficiency." },
    { id: 9, question: "How does the system handle cloudy days?", answer: "The simulation adjusts for weather variations, such as cloudy days, to estimate realistic energy production." },
    { id: 10, question: "Does the simulation take weather conditions into account?", answer: "Yes, our simulation includes local weather data to provide more accurate energy production estimates." },
    { id: 11, question: "How often should I perform a simulation?", answer: "It's recommended to run a simulation annually or when there are significant changes in energy usage patterns." },
    { id: 12, question: "What is the recommended battery capacity for my setup?", answer: "The recommended battery capacity depends on your daily energy usage, solar panel output, and backup needs." },
    { id: 14, question: "Can I export the simulation results?", answer: "Yes, you can export the results as a PDF or CSV file for further analysis." },
    { id: 15, question: "Is the simulation free to use?", answer: "Yes, our basic simulation is free to use. Advanced features may require a subscription." },
];

function FAQPage() {
    const [activeId, setActiveId] = useState(null);

    const toggleAnswer = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <div className="faq-page">
            <div class="faq-header-container">
                <img src={faqHeaderImage} alt="FAQ Header" className="faq-header-image" />
                <h1 class="faq-title">Frequently Asked Questions</h1>
            </div>
            <div className="faq-list">
                {questionsAndAnswers.map(({ id, question, answer }) => (
                    <div key={id} className="faq-item">
                        <div className="faq-question" onClick={() => toggleAnswer(id)}>
                            <span>{question}</span>
                            <span className="faq-icon">{activeId === id ? "−" : "+"}</span>
                        </div>
                        {activeId === id && <div className="faq-answer">{answer}</div>}
                    </div>
                ))}
            </div>

            {/* Contact Section */}
            <div className="contact-section">
                <h3 className="contact-heading">Need Help?</h3>
                <p className="contact-description">
                    If you didn’t find the answer you’re looking for, feel free to reach out to us directly.
                </p>
                <form className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Your email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" placeholder="Your message" required></textarea>
                    </div>
                    <button type="submit">Send Message</button>
                </form>
            </div>
            
        </div>
    );
}

export default FAQPage;