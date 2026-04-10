import React, { useState } from "react";

const FeedbackForm = () => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Dashboard");

  const submitFeedback = async () => {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, category }),
    });

    if (response.ok) {
      alert("Thank you for your feedback!");
      setMessage("");
    } else {
      alert("Error submitting feedback.");
    }
  };

  return (
    <div>
      <h2>Submit Feedback</h2>
      <textarea
        placeholder="Describe your experience"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Dashboard">Dashboard</option>
        <option value="Reporting">Reporting</option>
      </select>
      <button onClick={submitFeedback}>Submit</button>
    </div>
  );
};

export default FeedbackForm;
