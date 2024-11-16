import React, { useState } from "react";
import "./style/DataSharingPage.css";

const DataSharingPage = () => {
    const [shareUsage, setShareUsage] = useState(false);
    const [allowThirdParty, setAllowThirdParty] = useState(false);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === "shareUsage") {
            setShareUsage(checked);
        } else if (name === "allowThirdParty") {
            setAllowThirdParty(checked);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Data Sharing Settings Submitted:", { shareUsage, allowThirdParty });
    };

    return (
        <div className="data-sharing-page">
            <h1>Data Sharing</h1>
            <div className="data-sharing-container">
                <p>Manage your data-sharing options here. You can choose to share your usage statistics and allow third-party access to your data.</p>
                
                <form onSubmit={handleSubmit}>
                    <label>
                        <input
                            type="checkbox"
                            name="shareUsage"
                            checked={shareUsage}
                            onChange={handleCheckboxChange}
                        />
                        Share usage statistics
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            name="allowThirdParty"
                            checked={allowThirdParty}
                            onChange={handleCheckboxChange}
                        />
                        Allow third-party access
                    </label>

                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default DataSharingPage;
