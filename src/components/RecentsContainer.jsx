import React, { useState, useEffect } from "react";


const RecentsContainer = () => {
    const [recents, setRecents] = useState([]);

    useEffect(() => {
      // Fetch data from API
      const fetchData = async () => {
        const response = await fetch("API_URL");
        const data = await response.json();
        // Update state variable with fetched data
        setRecents(data);
      };
      fetchData();
    }, []);


  return (
    <div className="recents-container">
        <p>This is the Recents</p>
      {recents.map((recent) => (
        <div className="card" key={recent.id}>
          <img src={recent.image} alt={recent.title} />
          <div className="card-body">
            <h5 className="card-title">{recent.title}</h5>
            <p className="card-text">{recent.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentsContainer;
