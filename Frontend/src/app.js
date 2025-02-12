import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [translate, setTranslate] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("translate", translate);
    formData.append("target_lang", targetLang);

    const response = await fetch("http://localhost:8000/transcribe", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h1>Video/Audio Transcriber & Translator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={translate}
              onChange={(e) => setTranslate(e.target.checked)}
            />
            Translate
          </label>
          {translate && (
            <input
              type="text"
              placeholder="Target language (e.g., en)"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            />
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <h2>Transcription</h2>
          <p>{result.transcription}</p>
          <h2>SRT File</h2>
          <pre>{result.srt}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
