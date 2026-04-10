import React, { useState } from "react";

const DrillDown = () => {
  const [drillDownData, setDrillDownData] = useState(null);

  const fetchDrillDownData = async (type) => {
    const response = await fetch(`/api/drilldown/${type}`);
    const data = await response.json();
    setDrillDownData(data);
  };

  return (
    <div>
      <button onClick={() => fetchDrillDownData("top-posts")}>View Top Posts</button>
      <button onClick={() => fetchDrillDownData("top-reported-users")}>
        View Top Reported Users
      </button>
      {drillDownData && (
        <div>
          <h2>Drill-Down Details</h2>
          <pre>{JSON.stringify(drillDownData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DrillDown;
