import React from "react";

export default function MetaSettings({ days, setDays, periods, setPeriods, loading, onGenerate }) {
  return (
    <div className="meta-card">
      <div className="meta-card-header">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Academic Schedule Parameters
        </h3>
      </div>

      <div className="meta-card-body">
        <div className="meta-field-group">
          <div className="meta-field">
            <label>Working Days per Week</label>
            <div className="input-with-suffix">
              <input
                type="number"
                value={days}
                min="1"
                max="7"
                onChange={(e) => setDays(e.target.value)}
              />
              <span className="suffix">Days (Mon–Fri)</span>
            </div>
          </div>

          <div className="meta-field">
            <label>Daily Class Periods</label>
            <div className="input-with-suffix">
              <input
                type="number"
                value={periods}
                min="4"
                max="12"
                step="2"
                onChange={(e) => setPeriods(e.target.value)}
              />
              <span className="suffix">Periods / Day</span>
            </div>
          </div>
        </div>

        <div className="meta-action-col">
          <button
            className="btn btn-primary btn-lg btn-generate"
            disabled={loading}
            onClick={onGenerate}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Running Constraint Solver…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Generate Department Timetable
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
