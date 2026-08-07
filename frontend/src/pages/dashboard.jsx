import React, { useState } from "react";
import "./dashboard.css";

import { BATCHES, DEFAULT_STAFF, SAMPLE_CURRICULUM_PRESET } from "../constants/academicData";
import Header from "../components/Header";
import MetaSettings from "../components/MetaSettings";
import SubjectConfigTable from "../components/SubjectConfigTable";
import TimetableGrid from "../components/TimetableGrid";
import FacultyWorkloadView from "../components/FacultyWorkloadView";
import PrintLayout from "../components/PrintLayout";

const API_URL = "http://localhost:5000/api/generate";

function createEmptyRow(batch = "A") {
  return {
    batch,
    name: "",
    staff: DEFAULT_STAFF[0],
    theory_hours: 3,
    has_lab: false,
    lab_hours: 2,
  };
}

export default function DashBoard() {
  const [days, setDays] = useState(5);
  const [periods, setPeriods] = useState(8);
  const [rows, setRows] = useState(() => [
    createEmptyRow("A"),
    createEmptyRow("A"),
    createEmptyRow("B"),
    createEmptyRow("B"),
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("CONFIG"); // CONFIG | TIMETABLE | FACULTY
  const [activeBatchGrid, setActiveBatchGrid] = useState("A");

  // Row operations
  const updateRow = (i, field, value) => {
    const copy = [...rows];
    copy[i] = { ...copy[i], [field]: value };
    setRows(copy);
  };

  const addRow = (batch = "A") => setRows([...rows, createEmptyRow(batch)]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  // Presets & Reset
  const handleLoadPreset = () => {
    setRows(SAMPLE_CURRICULUM_PRESET.map((item) => ({ ...item })));
    setError("");
  };

  const handleReset = () => {
    setRows([createEmptyRow("A"), createEmptyRow("B")]);
    setResult(null);
    setError("");
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate timetable via backend CP-SAT solver
  const generate = async () => {
    // Basic client-side checks
    if (rows.length === 0) {
      setError("Please add at least one subject to generate a timetable.");
      return;
    }

    const invalidRow = rows.find(
      (r) => !r.name.trim() || !r.staff || !r.theory_hours || Number(r.theory_hours) <= 0
    );
    if (invalidRow) {
      setError("Every subject requires a valid name, assigned staff, and at least 1 lecture hour.");
      return;
    }

    const invalidLab = rows.find(
      (r) => r.has_lab && (!r.lab_hours || Number(r.lab_hours) <= 0 || Number(r.lab_hours) % 2 !== 0)
    );
    if (invalidLab) {
      setError(`Subject "${invalidLab.name}" has practical enabled, but lab (P) hours must be an even number (e.g. 2, 4).`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        days: Number(days),
        periods_per_day: Number(periods),
        batches: BATCHES,
        subjects: rows.map((r) => ({
          name: r.name.trim(),
          batch: r.batch,
          staff: r.staff,
          theory_hours: Number(r.theory_hours),
          has_lab: !!r.has_lab,
          lab_hours: r.has_lab ? Number(r.lab_hours) : 0,
        })),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === "OPTIMAL" || data.status === "FEASIBLE") {
        setResult(data);
        setActiveTab("TIMETABLE");
      } else {
        setError(data.message || "No feasible timetable found. Check faculty or period allocation.");
      }
    } catch (e) {
      setError("Could not connect to solver API server at " + API_URL + " — please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-app">
      {/* Printable Output View (visible only during print) */}
      <PrintLayout result={result} days={days} periods={periods} />

      {/* Screen Interactive Application View */}
      <div className="screen-layout">
        <Header
          onLoadPreset={handleLoadPreset}
          onReset={handleReset}
          onPrint={handlePrint}
          hasResult={!!result}
        />

        <main className="dashboard-main-content">
          {/* Main Navigation Tabs */}
          <div className="app-subnav">
            <button
              className={`subnav-btn ${activeTab === "CONFIG" ? "active" : ""}`}
              onClick={() => setActiveTab("CONFIG")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              1. Subject & Faculty Setup
            </button>

            <button
              className={`subnav-btn ${activeTab === "TIMETABLE" ? "active" : ""} ${!result ? "disabled" : ""}`}
              onClick={() => result && setActiveTab("TIMETABLE")}
              disabled={!result}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              2. Generated Timetable
              {result && <span className="subnav-badge">Ready</span>}
            </button>

            <button
              className={`subnav-btn ${activeTab === "FACULTY" ? "active" : ""} ${!result ? "disabled" : ""}`}
              onClick={() => result && setActiveTab("FACULTY")}
              disabled={!result}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              3. Faculty Workload Matrix
            </button>
          </div>

          {/* Status / Error Toast Alert */}
          {error && (
            <div className="alert-banner alert-banner-error">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <strong>Schedule Generation Error</strong>
                <p>{error}</p>
              </div>
              <button className="alert-close" onClick={() => setError("")}>✕</button>
            </div>
          )}

          {result && activeTab === "CONFIG" && (
            <div className="alert-banner alert-banner-success">
              <span className="alert-icon">✓</span>
              <div className="alert-content">
                <strong>Timetable Successfully Generated!</strong>
                <p>Status: {result.status}. Switch to the "Generated Timetable" or "Faculty Workload Matrix" tab to view schedules.</p>
              </div>
            </div>
          )}

          {/* TAB 1: CONFIGURATION */}
          {activeTab === "CONFIG" && (
            <div className="tab-content fade-in">
              <MetaSettings
                days={days}
                setDays={setDays}
                periods={periods}
                setPeriods={setPeriods}
                loading={loading}
                onGenerate={generate}
              />

              <div className="batches-grid">
                {BATCHES.map((batch) => (
                  <SubjectConfigTable
                    key={batch}
                    batch={batch}
                    rows={rows}
                    updateRow={updateRow}
                    removeRow={removeRow}
                    addRow={addRow}
                    days={days}
                    periods={periods}
                  />
                ))}
              </div>

              <div className="bottom-generate-bar">
                <button
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  onClick={generate}
                >
                  {loading ? "Solving Constraints…" : "Generate Department Timetable"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TIMETABLE GRID */}
          {activeTab === "TIMETABLE" && (
            <div className="tab-content fade-in">
              <TimetableGrid
                result={result}
                activeBatch={activeBatchGrid}
                setActiveBatch={setActiveBatchGrid}
                periods={periods}
              />
            </div>
          )}

          {/* TAB 3: FACULTY WORKLOAD MATRIX */}
          {activeTab === "FACULTY" && (
            <div className="tab-content fade-in">
              <FacultyWorkloadView
                result={result}
                days={days}
                periods={periods}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}