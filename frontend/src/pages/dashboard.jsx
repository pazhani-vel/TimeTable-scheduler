import { useState } from "react";
import "./dashboard.css"

const API_URL = "http://localhost:5000/api/generate";

// Default IT department staff list — shown as a dropdown for every subject row.
const DEFAULT_STAFF = [
  "Dr. Radha Senthilkumar",
  "Dr. P. AnandhaKumar",
  "Dr. Dhananjay Kumar",
  "Dr. M.R. Sumalatha",
  "Dr. R. Geetha Ramani",
  "Dr. P. Kola Sujatha",
  "Dr. S. Umamaheswari",
  "Dr. G. Rajesh",
  "Dr. J. Dhalia Sweetlin",
  "Dr. B. Lydia Elizabeth",
  "M. Hemalatha",
  "S.K. Lavanya",
  "C. Sunil Retmin Raj",
  "E. Pugazhendi",
  "Dr. D. Vivekanandan",
  "P. Seethalakshmi",
  "Kannan sir",
  "CN Mam",
  "Prathiba Mam",
  "Chemistry Mam",
  "Industry person",
  "Guest"
];

const BATCHES = ["A", "B"]; // IT dept, same semester, two batches

// Fixed daily shape used purely for display: 4 periods, lunch, 4 periods.
// periods_per_day sent to the solver stays a flat number (8 by default);
// this map only controls how the grid is drawn with a lunch column inserted.
function periodLabels(periodsPerDay) {
  const half = Math.floor(periodsPerDay / 2);
  const labels = [];
  for (let p = 1; p <= periodsPerDay; p++) {
    labels.push({ index: p - 1, label: `P${p}` });
    if (p === half) labels.push({ lunch: true, label: "LUNCH\n12–1" });
  }
  return labels;
}

function emptyRow() {
  return {
    batch: "A",
    name: "",
    staff: DEFAULT_STAFF[0],
    theory_hours: 3, // L
    has_lab: false,
    lab_hours: 2, // P
  };
}

export default function DashBoard() {

  const [days, setDays] = useState(5);
  const [periods, setPeriods] = useState(8);
  const [rows, setRows] = useState([emptyRow(), emptyRow()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateRow = (i, field, value) => {
    const copy = [...rows];
    copy[i] = { ...copy[i], [field]: value };
    setRows(copy);
  };

  const addRow = () => setRows([...rows, emptyRow()]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = {
        days: Number(days),
        periods_per_day: Number(periods),
        batches: BATCHES,
        subjects: rows.map((r) => ({
          name: r.name,
          batch: r.batch,
          staff: r.staff,
          theory_hours: Number(r.theory_hours), // L
          has_lab: !!r.has_lab,
          lab_hours: r.has_lab ? Number(r.lab_hours) : 0, // P
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
      } else {
        setError(data.message || "No feasible timetable found.");
      }
    } catch (e) {
      setError("Could not reach backend at " + API_URL + " — is it running?");
    } finally {
      setLoading(false);
    }
  };

  const cols = periodLabels(Number(periods));

  return (
    <div className="app">
      <h1>IT Department Timetable Generator</h1>
      <div className="panel">
        <div className="meta-row">
          <span>
            Working days{" "}
            <input type="number" value={days} min="1" max="7" onChange={(e) => setDays(e.target.value)} />
          </span>
          <span>
            Periods / day{" "}
            <input type="number" value={periods} min="4" max="12" step="2" onChange={(e) => setPeriods(e.target.value)} />
          </span>
        </div>

        <div className="row header">
          <div>Subject</div>
          <div>Batch</div>
          <div>Staff</div>
          <div>Lecture hrs/wk</div>
          <div>Lab (Practical)?</div>
          <div>Practical hrs/wk</div>
          <div></div>
        </div>

        {rows.map((r, i) => (
          <div className="row" key={i}>
            <input
              type="text"
              placeholder="e.g. Data Structures"
              value={r.name}
              onChange={(e) => updateRow(i, "name", e.target.value)}
            />
            <select value={r.batch} onChange={(e) => updateRow(i, "batch", e.target.value)}>
              {BATCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <select value={r.staff} onChange={(e) => updateRow(i, "staff", e.target.value)}>
              {DEFAULT_STAFF.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max="20"
              value={r.theory_hours}
              onChange={(e) => updateRow(i, "theory_hours", e.target.value)}
            />
            <label className="chk">
              <input
                type="checkbox"
                checked={r.has_lab}
                onChange={(e) => updateRow(i, "has_lab", e.target.checked)}
              />{" "}
              lab
            </label>
            <input
              type="number"
              min="2"
              step="2"
              disabled={!r.has_lab}
              value={r.has_lab ? r.lab_hours : ""}
              placeholder={r.has_lab ? "" : "—"}
              onChange={(e) => updateRow(i, "lab_hours", e.target.value)}
            />
            <button className="btn-remove" onClick={() => removeRow(i)}>
              ✕
            </button>
          </div>
        ))}

        <button className="btn-add" onClick={addRow}>
          + Add subject row
        </button>
        <br />
        <button className="btn-generate" disabled={loading} onClick={generate}>
          {loading ? "Generating…" : "Generate Timetable"}
        </button>

        {error && <div className="status err">{error}</div>}
        {result && <div className="status ok">Timetable generated ({result.status}).</div>}
      </div>

      {result &&
        BATCHES.map((b) => (
          <div className="grid-wrap" key={b}>
            <h2>Batch {b}</h2>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  {cols.map((c, idx) =>
                    c.lunch ? (
                      <th key={"lunch-" + idx} className="lunch-col">
                        Lunch
                        <br />
                        12–1
                      </th>
                    ) : (
                      <th key={"p-" + c.index}>{c.label}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {result.timetable[b].map((row, d) => (
                  <tr key={d}>
                    <td className="day-label">Day {d + 1}</td>
                    {cols.map((c, idx) => {
                      if (c.lunch) {
                        return (
                          <td key={"lunch-cell-" + idx} className="lunch-col">
                            <span className="empty-cell">🍴</span>
                          </td>
                        );
                      }
                      const cell = row[c.index];
                      return (
                        <td key={"cell-" + c.index}>
                          {cell ? (
                            <div>
                              <div className="cell-subj">{cell.subject}</div>
                              <div className="cell-staff">{cell.staff}</div>
                              <div className={"cell-type " + cell.type}>{cell.type}</div>
                            </div>
                          ) : (
                            <span className="empty-cell">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}