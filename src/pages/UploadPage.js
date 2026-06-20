import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  /* ── Drag & Drop handlers ── */
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Only PDF files are accepted." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: "File must be under 5 MB." }));
      return;
    }
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setResumeFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }, []);

  const handleFileInput = (e) => processFile(e.target.files?.[0]);

  /* ── Validation & submit ── */
  const validate = () => {
    const newErrors = {};
    if (!resumeFile) newErrors.resume = "Upload your resume to continue.";
    if (!jobDescription.trim()) newErrors.jd = "Paste a job description to continue.";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    // Phase 4: pass state to results page via router state
    navigate("/results", {
    state: { pdfFile: resumeFile, jobDescription, githubUsername },
  });
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const jdWordCount = jobDescription.trim()
    ? jobDescription.trim().split(/\s+/).length
    : 0;

  return (
    <div className="upload-page">
      {/* Back nav */}
      <button className="upload-back" onClick={() => navigate("/")}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to home
      </button>

      <div className="upload-container">
        {/* Header */}
        <div className="upload-header">
          <span className="upload-badge">AI-Powered Analysis</span>
          <h1 className="upload-title">
            Analyze your <span className="upload-title-accent">career profile</span>
          </h1>
          <p className="upload-subtitle">
            Upload your resume, paste a job description, and optionally share your GitHub.
            We'll surface what's working, what's missing, and what to do next.
          </p>
        </div>

        {/* Step 1 — Resume */}
        <div className="upload-card">
          <div className="upload-card-label">
            <span className="step-dot">1</span>
            <span>Resume</span>
            <span className="required-tag">Required</span>
          </div>

          <div
            className={`drop-zone ${isDragging ? "drop-zone--active" : ""} ${resumeFile ? "drop-zone--filled" : ""} ${errors.resume ? "drop-zone--error" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !resumeFile && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Resume upload area"
            onKeyDown={(e) => e.key === "Enter" && !resumeFile && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="drop-zone-input"
              onChange={handleFileInput}
              aria-hidden="true"
            />

            {resumeFile ? (
              <div className="drop-zone-filled">
                <div className="file-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="2" width="16" height="22" rx="2" fill="#6C63FF" opacity="0.2" />
                    <rect x="4" y="2" width="16" height="22" rx="2" stroke="#6C63FF" strokeWidth="1.5" />
                    <path d="M8 9h8M8 13h8M8 17h5" stroke="#6C63FF" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="21" cy="21" r="5" fill="#22C55E" />
                    <path d="M18.5 21l1.5 1.5L23 19" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="file-info">
                  <span className="file-name">{resumeFile.name}</span>
                  <span className="file-size">{(resumeFile.size / 1024).toFixed(0)} KB · PDF</span>
                </div>
                <button className="file-remove" onClick={removeFile} aria-label="Remove file">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="drop-zone-empty">
                <div className="drop-icon">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M18 24V12M18 12l-5 5M18 12l5 5" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 26c-3 0-5-2-5-5a5 5 0 014-4.9A8 8 0 1126 18.5c.2 0 .3 0 .5-.01A5 5 0 1128 28H8z" stroke="#A89CFF" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="drop-text">
                  <strong>Drop your resume here</strong>
                </p>
                <p className="drop-hint">or click to browse · PDF only · max 5 MB</p>
              </div>
            )}
          </div>

          {errors.resume && <p className="field-error">{errors.resume}</p>}
        </div>

        {/* Step 2 — Job Description */}
        <div className="upload-card">
          <div className="upload-card-label">
            <span className="step-dot">2</span>
            <span>Job description</span>
            <span className="required-tag">Required</span>
          </div>

          <textarea
            className={`jd-textarea ${errors.jd ? "jd-textarea--error" : ""}`}
            placeholder="Paste the full job posting here — title, responsibilities, qualifications, and any skills listed..."
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (errors.jd) setErrors((prev) => ({ ...prev, jd: undefined }));
            }}
            rows={8}
            aria-label="Job description"
          />
          <div className="jd-meta">
            {errors.jd && <p className="field-error">{errors.jd}</p>}
            <span className="jd-wordcount">{jdWordCount} words</span>
          </div>
        </div>

        {/* Step 3 — GitHub */}
        <div className="upload-card">
          <div className="upload-card-label">
            <span className="step-dot">3</span>
            <span>GitHub profile</span>
            <span className="optional-tag">Optional</span>
          </div>
          <p className="card-hint">
            Adding your GitHub lets us factor in your public projects, languages, and commit activity.
          </p>

          <div className="github-input-wrap">
            <span className="github-prefix">github.com/</span>
            <input
              type="text"
              className="github-input"
              placeholder="your-username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value.replace(/\s/g, ""))}
              aria-label="GitHub username"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          className="analyze-btn"
          onClick={handleSubmit}
          aria-label="Analyze my profile"
        >
          <span>Analyze my profile</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <p className="submit-note">
          Analysis takes about 15–30 seconds. Your data never leaves this session.
        </p>
      </div>
    </div>
  );
}
