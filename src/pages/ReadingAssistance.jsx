import React, { useState, useEffect, useRef, useCallback } from "react";
import "../index.css";
import { useSpring, animated } from "react-spring";
import { Document, Page, pdfjs } from "react-pdf";
import storageFunctions from "../storage_";
import anime from "animejs";
import { BsPencilSquare } from "react-icons/bs";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ReadingAssistance = () => {
  const [selection, setSelection] = useState("");
  const [result, setResult] = useState("");
  const [action, setAction] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [isHistoryExpanded, setHistoryExpanded] = useState(false);
  const con = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [fileTextContent, setFileTextContent] = useState("");
  const [fileBlob, setFileBlob] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isNightModeActive, setIsNightModeActive] = useState(false);
  const [hoverAction, setHoverAction] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);
const [note, setNote] = useState("");
const [comments, setComments] = useState({});
const [selectedPageIndex, setSelectedPageIndex] = useState(null);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState(null);

  const extractTextFromBlob = async (blob) => {
    try {
      const url = URL.createObjectURL(blob);
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;

      let extractedText = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");

        // Insert a page marker at the start of each page's text.
        extractedText.push("-- PAGE START -- " + pageText.trim());
      }

      // Join the page text with multiple newline characters.
      return extractedText.join("\n\n");
    } catch (error) {
      console.error("Error extracting text content:", error);
      return null;
    }
  };

  const actionType = "someActionType";

  const [props, set] = useSpring(() => ({
    transform: hoverAction === actionType ? "scale(1.2)" : "scale(1)",
    // config: { tension: 170, friction: 26 },
  }));

  const textProps = useSpring({
    transform: hoverAction === "text" ? "scale(1.2)" : "scale(1)",
    // config: { tension: 170, friction: 26 },
  });

  const imageProps = useSpring({
    transform: hoverAction === "image" ? "scale(1)" : "scale(1)",
    // config: { tension: 170, friction: 26 },
  });

  const copyProps = useSpring({
    transform: hoverAction === "copy" ? "scale(1)" : "scale(1)",
    // config: { tension: 170, friction: 26 },
  });

  const highlightProps = useSpring({
    transform: hoverAction === "highlight" ? "scale(1)" : "scale(1)",
    // config: { tension: 170, friction: 16 },
  });

  const clearHistory = () => {
    if (history.length === 0) {
      alert("History Already Cleared");
    } else {
      if (window.confirm("Delete History?")) {
        setHistory([]);
      }
    }
  };

  const addToHistory = (text, result, action) => {
    const formattedResult = action === "image" ? result : result;
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        text,
        result: formattedResult,
        action,
        timestamp: new Date(),
      },
    ]);
  };

  const query = (evt) => {
    evt.preventDefault();
    const fileHash =
      "7c9b82a1225c3089059c8c67bb42116facd6273a27a4686093059c88caf1b6af";
    const queryText = evt.target.texttoexplanation.value;

    storageFunctions.textToExplanation(fileHash, queryText, (data) => {
      console.log(data);
      addToHistory(queryText, data, "textToExplanation");
    });
  };

  const onTextToImage = (evt) => {
    evt.preventDefault();
    const fileHash =
      "7c9b82a1225c3089059c8c67bb42116facd6273a27a4686093059c88caf1b6af";
    const query = evt.target.texttoimage.value;
    storageFunctions.textToImage(fileHash, selection, (data) => {
      setResult(data.url); // Use data.url instead of data
      addToHistory(selection, data, "textToImage");
    });
  };

  const printTextToExplanation = (evt) => {
    evt.preventDefault();
    const fileHash =
      "7c9b82a1225c3089059c8c67bb42116facd6273a27a4686093059c88caf1b6af";
    const data = storageFunctions.getFileDetail(fileHash, [
      "textToExplanation",
    ]);
    console.log(data);
  };

  const toggleNightMode = () => {
    setIsNightModeActive((prevState) => !prevState);
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll(".popup-detail").forEach((element) => {
      element.classList.toggle("night-mode");
    });
    document.querySelectorAll(".history.expanded").forEach((element) => {
      element.classList.toggle("night-mode");
    });
  };

  const getData = useCallback(
    (type) => {
      if (selection) {
        setResult("loading");
        setAction(type); // Set the action here
        const fileHash =
          "7c9b82a1225c3089059c8c67bb42116facd6273a27a4686093059c88caf1b6af";
        if (type === "text") {
          storageFunctions.textToExplanation(fileHash, selection, (data) => {
            if (data.error) {
              setResult(`Error: ${data.error}`);
            } else if (data) {
              setResult(data);
              addToHistory(selection, data, "textToExplanation");
            } else {
              setResult("No data returned");
            }
          });
        } else if (type === "image") {
          storageFunctions.textToImage(fileHash, selection, (data) => {
            // Wait for the image to load before setting the result
            const image = new Image();
            image.onload = () => {
              if (data) {
                setResult(data);
                addToHistory(selection, data, "textToImage");
              } else {
                setResult("No data returned");
              }
            };
            image.onerror = () => {
              setResult("Error loading image");
            };
            if (data) {
              image.src = data;
            } else {
              setResult("No data returned");
            }
          });
        }
      } else {
        setResult("No text selected");
      }
    },
    [selection]
  );

  const renderResult = () => {
    console.log("Action: ", action);
    console.log("Result: ", result);
    if (result === "") return null;
    if (result === "loading") return <p>Loading...</p>;

    if (action === "text") {
      if (typeof result === "string") {
        return <p>{result}</p>;
      } else if (result && typeof result === "object" && result.error) {
        return <p>Error: {result.error}</p>;
      } else {
        return <p>Unexpected result format</p>;
      }
    } else if (action === "image") {
      if (typeof result === "string") {
        return <img src={result} alt="" />;
      } else if (result && typeof result === "object" && result.url) {
        return <img src={result.url} alt="" />;
      } else {
        return <p>Unexpected result format</p>;
      }
    }

    return <p>Error</p>;
  };

  const toggleHistory = () => {
    setHistoryExpanded((prevState) => !prevState);
  };

  const setActionType = (e) => {
    const type = e.currentTarget.id;
    console.log("Action type:", type);
    if (type === "copy") {
      copyText();
      return;
    } else if (type === "highlight") {
      highlightText();
      return;
    }
    getData(type);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      const selectedText = window.getSelection().toString();
      if (selectedText.trim() !== "") {
        setSelection(selectedText);
        setResult(""); // Reset the result when new text is selected
        const mousePosition = {
          x: window.event.clientX,
          y: window.event.clientY,
        };
        setMouse(mousePosition);
        setAction(null); // Reset action when new text is selected
      } else {
        setSelection(null);
      }
    };

    if (con.current) {
      con.current.addEventListener("mouseup", handleMouseUp);

      return () => {
        con.current.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, []);

  useEffect(() => {
    const fileHash =
      "7c9b82a1225c3089059c8c67bb42116facd6273a27a4686093059c88caf1b6af";

    const fetchFileContent = async () => {
      try {
        const blob = await storageFunctions.getFileContent(fileHash);
        const textContent = await extractTextFromBlob(blob);
        setFileTextContent(textContent);
        setFileBlob(blob);
      } catch (error) {
        console.error("Error retrieving file content:", error);
      }
    };

    fetchFileContent();
  }, []);

  useEffect(() => {
    // Create an animation for the popup when it appears
    anime({
      targets: ".popup.active",
      scale: [0, 1],
      duration: 500,
      easing: "easeOutCubic",
    });
  }, [selection]);

  useEffect(() => {
    set({
      transform: hoverAction ? "scale(1.5)" : "scale(1)",
    });
  }, [hoverAction, set]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!fileTextContent || !fileBlob) {
    return <div>Loading...</div>;
  }

  const copyText = () => {
    navigator.clipboard.writeText(selection).then(
      () => {
        console.log("Copying to clipboard was successful!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  // Handle note open and close
  const handleNoteToggle = () => {
    setIsNoteOpen(prev => !prev);
  };
// Handle note change
const handleNoteChange = (event) => setNote(event.target.value);


  const highlightText = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      let range = selection.getRangeAt(0);
      let span = document.createElement("span");
      span.className = "highlighted-text"; // Add the class name for highlighting
      range.surroundContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
      setHighlightedText(selection.toString());
    }
    return { highlightedText, highlightText };
  };

  const handleNoteSubmit = (pageIndex, paragraphIndex) => {
    if (!note) return;
    setComments({
      ...comments,
      [`${pageIndex}-${paragraphIndex}`]: [
        ...(comments[`${pageIndex}-${paragraphIndex}`] || []),
        note
      ]
    });
    handleNoteToggle();
    setNote('');
  };

  
  
  // const handleMouseEnter = () => {
  //   anime({
  //     targets: ".popup.active",
  //     scale: 1.2,
  //     duration: 300,
  //     easing: "easeOutCubic",
  //   });
  // };

  // const handleMouseLeave = () => {
  //   anime({
  //     targets: ".popup.active",
  //     scale: 1,
  //     duration: 300,
  //     easing: "easeOutCubic",
  //   });
  // };

  return (
  <div className="bigcontainer" ref={con}>
    <h2>Reading Assistance</h2>
    {numPages && <pre>Number of Pages: {numPages}</pre>}
    {fileTextContent.split("-- PAGE START -- ").map((page, pageIndex) => (
      <div key={pageIndex} className="page-content">
        {pageIndex > 0 && <hr />}
        {page.split("\n\n").map((paragraph, paragraphIndex) => (
          <div className="paragraph-container" key={paragraphIndex}>
            <p className="paragraph-text"
              onMouseUp={() => {
                const selectedText = window.getSelection().toString();
                if (selectedText.trim() !== "") {
                  setSelection(selectedText);
                  setResult("");
                  const mousePosition = {
                    x: window.event.clientX,
                    y: window.event.clientY,
                  };
                  setMouse(mousePosition);
                  setAction(null);
                } else {
                  setSelection(null);
                }
              }}
            >
              {paragraph}
            </p>
          </div>
        ))}
      </div>
    ))}

    {selection && (
      <div
        className={[
          "night-mode-button",
          isNightModeActive ? "active" : "",
        ].join(" ")}
        onClick={toggleNightMode}
        style={{ backgroundColor: isNightModeActive ? "#fff" : "#000" }}
      />
    )}

    {selection && (
      <div
        className={["popup", selection ? "active" : ""].join(" ")}
        style={{ left: mouse.x, top: mouse.y }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-action">
          <span
            className={action === "text" ? "active-action" : ""}
            id="text"
            onClick={setActionType}
            style={textProps}
            onMouseEnter={() => setHoverAction("text")}
            onMouseLeave={() => setHoverAction(null)}
          >
            <img src="/icons/text.svg" alt="Text" />
          </span>
          <span
            className={action === "image" ? "active-action" : ""}
            id="image"
            onClick={setActionType}
            style={imageProps}
            onMouseEnter={() => setHoverAction("image")}
            onMouseLeave={() => setHoverAction(null)}
          >
            <img src="/icons/image.svg" alt="Image" />
          </span>
          <span
            className={action === "copy" ? "active-action" : ""}
            id="copy"
            onClick={setActionType}
            style={copyProps}
            onMouseEnter={() => setHoverAction("copy")}
            onMouseLeave={() => setHoverAction(null)}
          >
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z'/%3E%3C/svg%3E"
              alt="Copy"
            />
          </span>
          <span
            className={action === "highlight" ? "active-action" : ""}
            id="highlight"
            onClick={highlightText}
            style={highlightProps}
            onMouseEnter={() => setHoverAction("highlight")}
            onMouseLeave={() => setHoverAction(null)}
          >
            <img src="/icons/highlighter.svg" alt="Highlight" />
          </span>
        </div>
        <div
          className={
            isHistoryExpanded
              ? "history expanded" + (isNightModeActive ? " night-mode" : "")
              : "history collapsed" + (isNightModeActive ? " night-mode" : "")
          }
          onClick={toggleHistory}
        >
          <h2>
            History{" "}
            {isHistoryExpanded && (
              <img
                src="/icons/trash.png"
                onClick={clearHistory}
                style={{ cursor: "pointer" }}
                alt="Clear History"
              />
            )}
          </h2>
          {isHistoryExpanded && (
            <ul>
              {history.map((item, index) => (
                <li
                  key={index}
                  className={
                    "historyItem" + (isNightModeActive ? " night-mode" : "")
                  }
                >
                  <div className="historyItemNumber">{index + 1}</div>
                  <p className="historyItemP textBlock">
                    Text: {item.text}
                    <span className="historyItemBorder" />
                  </p>
                  <p className="historyItemP">
                    Action: {item.action}
                    <span className="historyItemBorder" />
                  </p>
                  <div className="resultBlock">
                    <p className="historyItemResult">
                      Result:{" "}
                      {item.action === "image" ? (
                        <img src={item.result.url} alt="" />
                      ) : (
                        item.result
                      )}
                    </p>
                  </div>
                  <p className="historyItemTimestamp">
                    {item.timestamp.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={
            "popup-detail " + (isNightModeActive ? "night-mode" : "light")
          }
          style={{ display: result ? "block" : "none" }}
        >
          {renderResult()}
        </div>
      </div>
    )}
  </div>
);
        }

export default ReadingAssistance;

