import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExamResults.css";

export default function ExamResults() {
  const reg_no = 12345; // TEMP
  // const reg_no = localStorage.getItem("reg_no"); // Student reg_no from login

  const [years, setYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [results, setResults] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  // Fetch available years for the student
  useEffect(() => {
    if (reg_no) {
      axios
        .get(`http://localhost:5000/api/students/years?reg_no=${reg_no}`)
        .then((res) => setYears(Array.isArray(res.data) ? res.data : []))
        .catch((err) => console.error(err));
    }
  }, [reg_no]);

  // Fetch available terms when a year is selected
  useEffect(() => {
    if (selectedYear) {
      axios
        .get(
          `http://localhost:5000/api/students/terms?reg_no=${reg_no}&year=${selectedYear}`
        )
        .then((res) => setTerms(Array.isArray(res.data) ? res.data : []))
        .catch((err) => console.error(err));
    } else {
      setTerms([]);
      setSelectedTerm("");
    }
  }, [selectedYear, reg_no]);

  // Fetch exam results when year and term are selected
  useEffect(() => {
    if (selectedYear && selectedTerm) {
      axios
        .get(
          `http://localhost:5000/api/students/exam-results?reg_no=${reg_no}&year=${selectedYear}&term=${selectedTerm}`
        )
        .then((res) => setResults(Array.isArray(res.data) ? res.data : []))
        .catch((err) => console.error(err));
    } else {
      setResults([]);
    }
  }, [selectedYear, selectedTerm, reg_no]);

  return (
    <div className="contentArea">
      <header className="heading">
        <h1>Exam Results</h1>
      </header>

      <div className="inputArea">
        <div className="input-groups">
            {/* Year selection */}
          <div className="input-group">
            <label htmlFor="year">Select Year:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Term selection */}
          <div className="input-group">
            <label htmlFor="term">Select Term:</label>
            <select
              id="term"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Select Term</option>
              {terms.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Show results */}
      <table className="results-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="3">No results found</td> {/*If db has no data for the given year and term*/}
            </tr>
          ) : (
            // Populate results from db
            results.map((r, i) => (
              <tr key={i}>
                <td>{r.subject}</td>
                <td>{r.marks}</td>
                <td>{r.grade}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
