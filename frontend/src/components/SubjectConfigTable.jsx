import React from "react";
import { DEFAULT_STAFF, BATCHES } from "../constants/academicData";
import BatchStatsCard from "./BatchStatsCard";

export default function SubjectConfigTable({ batch, rows, updateRow, removeRow, addRow, days, periods }) {
  const batchRows = rows
    .map((r, i) => ({ ...r, originalIndex: i }))
    .filter((r) => r.batch === batch);

  return (
    <div className="batch-card">
      <div className="batch-card-header">
        <div className="batch-title-wrap">
          <div className={`batch-icon-badge batch-icon-${batch.toLowerCase()}`}>
            Batch {batch}
          </div>
          <div>
            <h3 className="batch-title">Batch {batch} Curriculum & Faculty Allocation</h3>
            <p className="batch-subtitle">Define subjects, staff assignments, and weekly lecture & practical hours</p>
          </div>
        </div>

        <BatchStatsCard batch={batch} rows={rows} days={days} periods={periods} />
      </div>

      <div className="subject-table-wrap">
        <table className="subject-table">
          <thead>
            <tr>
              <th style={{ width: "26%" }}>Subject Name</th>
              <th style={{ width: "10%" }}>Batch</th>
              <th style={{ width: "28%" }}>Assigned Faculty / Staff</th>
              <th style={{ width: "12%" }}>Lecture (L) hrs/wk</th>
              <th style={{ width: "12%" }}>Has Practical (P)?</th>
              <th style={{ width: "12%" }}>Practical (P) hrs/wk</th>
              <th style={{ width: "4%" }}></th>
            </tr>
          </thead>
          <tbody>
            {batchRows.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table-msg">
                  No subjects configured for Batch {batch}. Click "Add Subject" below or load a preset.
                </td>
              </tr>
            ) : (
              batchRows.map((r) => {
                const idx = r.originalIndex;
                const isLabInvalid = r.has_lab && (Number(r.lab_hours) <= 0 || Number(r.lab_hours) % 2 !== 0);

                return (
                  <tr key={idx} className="subject-row">
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Data Structures"
                        value={r.name}
                        onChange={(e) => updateRow(idx, "name", e.target.value)}
                      />
                    </td>

                    <td>
                      <select
                        className="form-control"
                        value={r.batch}
                        onChange={(e) => updateRow(idx, "batch", e.target.value)}
                      >
                        {BATCHES.map((b) => (
                          <option key={b} value={b}>
                            Batch {b}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        className="form-control"
                        value={r.staff}
                        onChange={(e) => updateRow(idx, "staff", e.target.value)}
                      >
                        {DEFAULT_STAFF.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="form-control text-center"
                        value={r.theory_hours}
                        onChange={(e) => updateRow(idx, "theory_hours", e.target.value)}
                      />
                    </td>

                    <td className="text-center">
                      <label className="checkbox-wrap">
                        <input
                          type="checkbox"
                          checked={r.has_lab}
                          onChange={(e) => updateRow(idx, "has_lab", e.target.checked)}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-label">Lab</span>
                      </label>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="2"
                        max="6"
                        step="2"
                        disabled={!r.has_lab}
                        className={`form-control text-center ${isLabInvalid ? "input-error" : ""}`}
                        value={r.has_lab ? r.lab_hours : ""}
                        onChange={(e) => updateRow(idx, "lab_hours", e.target.value)}
                        placeholder={r.has_lab ? "2, 4…" : "—"}
                      />
                    </td>

                    <td className="text-center">
                      <button
                        className="btn-icon-danger"
                        title="Remove Subject"
                        onClick={() => removeRow(idx)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="batch-card-footer">
        <button className="btn btn-secondary btn-sm" onClick={() => addRow(batch)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Subject for Batch {batch}
        </button>
      </div>
    </div>
  );
}
