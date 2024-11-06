import React, { useState } from 'react';
import ChatBot from 'react-chatbotify';

const MyChatBot = () => {
    const [clientInfo, setClientInfo] = useState({});

    // Email validation regex
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const flow = {
        start: {
            message: "Hello! What is your name?",
            path: "get_name"
        },
        get_name: {
            message: (params) => {
                const name = params.userInput;
                if (!name) {
                    return "Please provide your name.";
                }
                setClientInfo(prevInfo => ({ ...prevInfo, name }));
                return `Nice to meet you, ${name}! I'm your Solar Panel Assistant. How can I help you today?`;
            },
            path: "check_faqs"
        },
        check_faqs: {
            message: "Have you checked the FAQs page for your question?",
            options: ["Yes", "No"],
            path: (params) => params.userInput.toLowerCase() === "yes" ? "choose_topic" : "redirect_faq"
        },
        redirect_faq: {
            message: "Please take a moment to look there. You can come back to ask your question!",
            path: "end"
        },
        choose_topic: {
            message: "Please choose the topic of your question:",
            options: ["Battery", "Solar Panel", "Simulator", "Other"],
            path: (params) => {
                const topic = params.userInput;
                if (!topic) {
                    return "Please choose a topic.";
                }
                setClientInfo(prevInfo => ({ ...prevInfo, topic }));
                switch (topic.toLowerCase()) {
                    case "battery": return "battery_question";
                    case "solar panel": return "solar_question";
                    case "simulator": return "simulator_question";
                    default: return "other_question";
                }
            }
        },
        battery_question: {
            message: "Would you like to know how the battery works or how to maintain it?",
            options: ["How it works", "Maintenance"],
            path: "need_more_help"
        },
        solar_question: {
            message: "Do you want to know how solar panels generate energy or how to optimize them?",
            options: ["Energy generation", "Optimization tips"],
            path: "need_more_help"
        },
        simulator_question: {
            message: "Would you like to know how the simulator estimates energy or how to interpret the results?",
            options: ["Energy estimation", "Result interpretation"],
            path: "need_more_help"
        },
        other_question: {
            message: "Please briefly describe your question, and I'll try to help!",
            path: "need_more_help"
        },
        need_more_help: {
            message: "Is there anything else I can help you with?",
            options: ["Yes, contact support", "No, I'm good"],
            path: (params) => params.userInput.toLowerCase() === "yes, contact support" ? "get_email" : "thank_user"
        },
        get_email: {
            message: "Please provide your email address so we can reach out to you.",
            path: "get_question_details"
        },
        get_question_details: {
            message: "Please explain your question in detail.",
            path: "send_email"
        },
        send_email: {
            message: async (params) => {
                const email = params.userInput;
                const { name, topic } = clientInfo;

                if (!email || !validateEmail(email)) {
                    return "Please provide a valid email address.";
                }

                // Simulate sending email
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a 2-second delay
                console.log(`Email sent to support: \nName: ${name}\nEmail: ${email}\nTopic: ${topic}\nQuestion: ${params.userInput}`);

                return `Thank you, ${name}! Your message has been sent to our support team. We'll contact you soon.`;
            },
            path: "thank_user"
        },
        thank_user: {
            message: "Thank you for reaching out! Have a great day!",
            path: null // End the conversation
        },
        end: {
            message: "Thank you for visiting. Feel free to come back if you have more questions!",
            path: null // End the conversation
        }
    };

    return (
        <div className="chatbot-container">
            <ChatBot 
                settings={{
                    general: { embedded: true }, 
                    chatHistory: { storageKey: "solar_assistant" },
                }} 
                flow={flow}
            />
        </div>
    );
};

export default MyChatBot;
