import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [translate, setTranslate] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("translate", translate);
    formData.append("target_lang", targetLang);

    try {
      const response = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error: " + response.statusText);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Transcribe & Translate Media</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Upload video/audio file:
            <input type="file" accept="audio/*,video/*" onChange={handleFileChange} />
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={translate}
              onChange={(e) => setTranslate(e.target.checked)}
            />
            Translate
          </label>
        </div>
        {translate && (
          <div>
            <label>
              Target Language (e.g., en):
              <input
                type="text"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              />
            </label>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {error && (
        <div style={{ color: "red" }}>
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Transcription</h2>
          <p>{result.transcription}</p>
          <h2>SRT File</h2>
          <pre style={{ background: "#f0f0f0", padding: "10px" }}>{result.srt}</pre>
        </div>
      )}
    </div>
  );
}

export default App;