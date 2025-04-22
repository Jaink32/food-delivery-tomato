import React, { useEffect, useState } from "react";
import classes from "./search.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

Search.defaultProps = {
  searchRoute: "/search/",
  defaultRoute: "/",
  placeholder: "Search Food Mine!",
};

export default function Search({
  searchRoute,
  defaultRoute,
  margin,
  placeholder,
}) {
  const [term, setTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { searchTerm } = useParams();
  const [debouncedTerm] = useDebounce(term, 500);

  useEffect(() => {
    setTerm(searchTerm ?? "");
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm !== undefined && debouncedTerm !== (searchTerm ?? "")) {
      search(debouncedTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  const search = (termToSearch) => {
    console.log("Instant searching for:", termToSearch);
    termToSearch
      ? navigate(searchRoute + termToSearch)
      : navigate(defaultRoute);
  };

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTerm(transcript);
        search(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  return (
    <div className={classes.container} style={{ margin }}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setTerm(e.target.value)}
        value={term}
      />
      <button
        onClick={startListening}
        className={`${classes.micButton} ${
          isListening ? classes.listening : ""
        }`}
        title="Click to speak"
      >
        🎤
      </button>
    </div>
  );
}
