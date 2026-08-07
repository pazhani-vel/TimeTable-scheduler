import React from "react";

export default function Header({ onLoadPreset, onReset, onPrint, hasResult }) {
  return (
    <header className="dept-header">
      <div className="dept-header-container">
        <div className="dept-brand">
          <div className="dept-crest">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div className="dept-titles">
            <div className="dept-college-tag">COLLEGE OF ENGINEERING & TECHNOLOGY</div>
            <h1 className="dept-main-title">Department of Information Technology</h1>
            <p className="dept-sub-title">Automated Batch Timetable Management System</p>
          </div>
        </div>

        <div className="dept-header-actions">
          <div className="dept-badge-group">
            <span className="badge badge-blue">Batches A & B</span>
          </div>

          <div className="dept-btn-group">
            <button className="btn btn-outline" onClick={onLoadPreset} title="Populate realistic sample subjects for Batch A & B">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Load Sample Preset
            </button>

            <button className="btn btn-ghost" onClick={onReset} title="Clear all subject rows">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Reset
            </button>

            {hasResult && (
              <button className="btn btn-navy" onClick={onPrint} title="Print formal timetable report">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Print / Save PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
