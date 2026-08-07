import React from "react";
import { PERIOD_TIME_SLOTS } from "../constants/academicData";

export default function TimetableGrid({ result, activeBatch, setActiveBatch, periods }) {
  if (!result || !result.timetable) return null;

  const batchesToDisplay = activeBatch === "ALL" ? Object.keys(result.timetable) : [activeBatch];
  
  // Filter period time slots up to requested period count
  const periodsCount = Number(periods) || 8;
  const half = Math.floor(periodsCount / 2);

  const displayCols = [];
  for (let p = 0; p < periodsCount; p++) {
    const slotInfo = PERIOD_TIME_SLOTS.find((s) => !s.lunch && s.index === p) || {
      index: p,
      label: `P${p + 1}`,
      time: "",
    };
    displayCols.push({ ...slotInfo, isLunch: false });

    // Insert lunch column after half of the periods
    if (p === half - 1) {
      displayCols.push({
        isLunch: true,
        label: "LUNCH BREAK",
        time: "12:05 – 01:00 PM",
      });
    }
  }

  const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="timetable-section">
      <div className="section-header">
        <div>
          <h2>Generated Department Timetable</h2>
          <p>CP-SAT Solver Status: <span className="status-tag status-tag-success">{result.status}</span></p>
        </div>

        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeBatch === "A" ? "active" : ""}`}
            onClick={() => setActiveBatch("A")}
          >
            Batch A Grid
          </button>
          <button
            className={`tab-btn ${activeBatch === "B" ? "active" : ""}`}
            onClick={() => setActiveBatch("B")}
          >
            Batch B Grid
          </button>
          <button
            className={`tab-btn ${activeBatch === "ALL" ? "active" : ""}`}
            onClick={() => setActiveBatch("ALL")}
          >
            Both Batches Side-by-Side
          </button>
        </div>
      </div>

      {batchesToDisplay.map((b) => {
        const grid = result.timetable[b];
        if (!grid) return null;

        return (
          <div className="grid-card" key={b}>
            <div className="grid-card-header">
              <div className="grid-card-title">
                <span className={`batch-pill batch-pill-${b.toLowerCase()}`}>Batch {b}</span>
                <h3>Timetable Schedule — Batch {b}</h3>
              </div>
              <span className="text-muted text-sm">Department of Information Technology</span>
            </div>

            <div className="grid-scroll-container">
              <table className="timetable-grid">
                <thead>
                  <tr>
                    <th className="th-day">Day</th>
                    {displayCols.map((c, idx) =>
                      c.isLunch ? (
                        <th key={"lunch-head-" + idx} className="th-lunch">
                          <div>{c.label}</div>
                          <div className="time-sub">{c.time}</div>
                        </th>
                      ) : (
                        <th key={"p-head-" + c.index} className="th-period">
                          <div>{c.label}</div>
                          <div className="time-sub">{c.time}</div>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {grid.map((dayRow, dayIdx) => (
                    <tr key={dayIdx}>
                      <td className="td-day">
                        <div className="day-name">{DAY_NAMES[dayIdx] || `Day ${dayIdx + 1}`}</div>
                        <div className="day-sub">Day {dayIdx + 1}</div>
                      </td>

                      {displayCols.map((c, colIdx) => {
                        if (c.isLunch) {
                          return (
                            <td key={"lunch-cell-" + colIdx} className="td-lunch">
                              <div className="lunch-box">
                                <span className="lunch-icon">☕</span>
                                <span className="lunch-text">LUNCH</span>
                              </div>
                            </td>
                          );
                        }

                        const cell = dayRow[c.index];
                        if (!cell) {
                          return (
                            <td key={"cell-" + c.index} className="td-empty">
                              <span className="empty-dash">—</span>
                            </td>
                          );
                        }

                        const isTheory = cell.type === "theory";

                        return (
                          <td key={"cell-" + c.index} className="td-slot">
                            <div className={`slot-card ${isTheory ? "slot-theory" : "slot-lab"}`}>
                              <div className="slot-subject">{cell.subject}</div>
                              <div className="slot-staff">{cell.staff}</div>
                              <div className="slot-type-row">
                                <span className={`type-badge ${isTheory ? "type-theory" : "type-lab"}`}>
                                  {isTheory ? "Lecture (L)" : "Practical (P)"}
                                </span>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
