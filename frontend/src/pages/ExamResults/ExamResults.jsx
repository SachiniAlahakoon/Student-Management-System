import React, { useState } from "react";
import "./ExamResults.css";

function ExamResults() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  return (
    <>
      <div className="contentArea">
        <header className="heading">
          <h1>Exam Results</h1>
        </header>
        <form
          className="inputArea"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted");
          }}
        >
          <div className="input-groups">
            <div className="input-group">
              <label htmlFor="indexNo">Enter Index Number:</label>
              <input type="text" id="indexNo" placeholder="Enter Index No" />
            </div>
            <div className="input-group">
              <label htmlFor="year">Select Year:</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="" disabled>
                  Select Year
                </option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="term">Select Term:</label>
              <select
                id="term"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <option value="" disabled>
                  Select Term
                </option>
                <option value="1st">1st Term</option>
                <option value="2nd">2nd Term</option>
                <option value="3rd">3rd Term</option>
              </select>
            </div>
          </div>
          <button className="submit-btn" type="submit">
            Search
          </button>
        </form>
        <table className="results-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Grade</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mathematics</td>
              <td>A</td>
              <td>85</td>
            </tr>
            <tr>
              <td>Science</td>
              <td>B+</td>
              <td>78</td>
            </tr>
            <tr>
              <td>History</td>
              <td>A-</td>
              <td>82</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ExamResults;
