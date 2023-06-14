import React, { useState, useEffect, useRef, useCallback } from "react";
import "../index.css";
import { useSpring } from "react-spring";
import { pdfjs } from "react-pdf";
import storageFunctions from "../storage_";
import anime from "animejs";
import fetchFunctions from "../fetch_";
import {
  highlighter,
  image,
  textplanation,
  yellowsun,
  bluemoon
} from "../userwalkthrough/index";



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ReadingAssistance = ({fileHash, triggerHistoryUpdate}) => {
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
  const [isNightModeActive, setIsNightModeActive] = useState(false);
  const [hoverAction, setHoverAction] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [comments, setComments] = useState({});
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState(null);
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  let synth = window.speechSynthesis;
  let voices = [];
  const POPUP_WIDTH = 200; // Replace with the desired width of your pop-up interface




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
    transform: hoverAction === "image" ? "scale(1.2)" : "scale(1)",
    // config: { tension: 170, friction: 26 },
  });

  const copyProps = useSpring({
    transform: hoverAction === "copy" ? "scale(1.2)" : "scale(1)",
    // config: { tension: 170, friction: 26 },
  });

  const highlightProps = useSpring({
    transform: hoverAction === "highlight" ? "scale(1.2)" : "scale(1)",
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

        if (type === "text") {
          storageFunctions.textToExplanation(fileHash, selection, (data) => {
            if (data.error) {
              setResult(`Error: ${data.error}`);
            } else if (data) {
              setResult(data);
              addToHistory(selection, data, "textToExplanation");
              triggerHistoryUpdate(selection);
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
                triggerHistoryUpdate(selection);

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
    const firstVisit = localStorage.getItem("firstVisit");
    if (!firstVisit) {
      setFirstTimeUser(true);
      localStorage.setItem("firstVisit", "no");
    }
  }, []);

  const handleMouseUp = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText.trim() !== "") {
      setSelection(selectedText);
      setResult(""); // Reset the result when new text is selected
  
      // Get the bounding box of the parent div
      const container = con.current.getBoundingClientRect();
  
      // Calculate the maximum left and right positions for the pop-up
      const maxLeftPosition = container.left + container.width - POPUP_WIDTH;
      const maxRightPosition = container.left + container.width;
  
      // Adjust the x-coordinate to keep the pop-up within the text content area
      const mouseX = window.event.clientX;
      let popupX;
  
      if (mouseX > maxLeftPosition) {
        popupX = maxLeftPosition;
      } else if (mouseX < maxRightPosition) {
        popupX = maxRightPosition - POPUP_WIDTH;
      } else {
        popupX = mouseX;
      }
  
      // Calculate the y-coordinate of the pop-up
      const mouseY = window.event.clientY;
      const popupY = mouseY - container.top;
  
      setMouse({ x: popupX, y: popupY });
      setAction(null); // Reset action when new text is selected
    } else {
      setSelection(null);
    }
  };
  
  

  useEffect(() => {


    const fetchFileContent = () => {
      try {
        const blob = fetchFunctions.download_file(fileHash, async (blob) => {
          const textContent = await extractTextFromBlob(blob);
          setFileTextContent(textContent);
          setFileBlob(blob);
        });
      } catch (error) {
        console.error("Error retrieving file content:", error);
      }
    };
    if(fileHash) fetchFileContent();
    
  }, [fileHash]);

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

  // const handleDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // };

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
    setIsNoteOpen((prev) => !prev);
  };
  // Handle note change
  const handleNoteChange = (event) => setNote(event.target.value);

  const highlightText = () => {
    try {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let span = document.createElement("span");
        span.className = "highlighted-text"; // Add the class name for highlighting
  
        if (range.startContainer.parentNode.classList.contains("highlighted-text")) {
          const parent = range.startContainer.parentNode;
          const originalText = document.createTextNode(parent.textContent);
          parent.parentNode.replaceChild(originalText, parent);
        } else {
          range.surroundContents(span);
        }
  
        selection.removeAllRanges();
        selection.addRange(range);
        setHighlightedText(selection.toString());
      }
    } catch (error) {
      console.error("An error occurred while highlighting:", error);
    }
  };
  

  const handleNoteSubmit = (pageIndex, paragraphIndex) => {
    if (!note) return;
    setComments({
      ...comments,
      [`${pageIndex}-${paragraphIndex}`]: [
        ...(comments[`${pageIndex}-${paragraphIndex}`] || []),
        note,
      ],
    });
    handleNoteToggle();
    setNote("");
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
    <div className="bigcontainer" ref={con} style={{ position: "relative", overflow: 'auto' }}>
      <h2>Reading Assistance</h2>
      {numPages && <div>Number of Pages: {numPages}</div>}
      {fileTextContent.split("-- PAGE START -- ").map((page, pageIndex) => (
        <div key={pageIndex} className="page-content">
          {pageIndex > 0 && <hr />}
          {page.split("\n\n").map((paragraph, paragraphIndex) => (
            <div className="paragraph-container" key={paragraphIndex}>
              {comments[`${pageIndex}-${paragraphIndex}`] && (
                <div className="comment-indicator">
                  {comments[`${pageIndex}-${paragraphIndex}`].map(
                    (comment, commentIndex) => (
                      <div key={commentIndex} className="comment">
                        {comment}
                      </div>
                    )
                  )}
                </div>
              )}
              <p
                className="paragraph-text"
                onMouseUp={() => {
                  const selectedText = window.getSelection().toString();
                  if (selectedText.trim() !== "") {
                    setSelection(selectedText);
                    setResult("");
  
                    // Get the bounding box of the parent div
                    const container = con.current.getBoundingClientRect();
  
                    // Adjust mouse position to be relative to the parent div
                    const mousePosition = {
                      x: window.event.clientX - container.left,
                      y: window.event.clientY - container.top,
                    };
                    setMouse(mousePosition);
                    setAction(null);
  
                    // Set the selected page and paragraph indexes here
                    setSelectedPageIndex(pageIndex);
                    setSelectedParagraphIndex(paragraphIndex);
  
                    // Open the note taking area when a text is selected
                    setIsNoteOpen(false);
                  } else {
                    setSelection(null);
                    setIsNoteOpen(false); // Close note taking area if no text is selected
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
  <img
    className={`night-mode-button ${isNightModeActive ? "active" : ""}`}
    src={isNightModeActive ? yellowsun : bluemoon}
    alt={isNightModeActive ? "Yellow Sun" : "Bluemoon"}
    onClick={toggleNightMode}
    style={{
      top: "166px !important",
      left: "187px",
      width: "26px",
      height: "26px",
      borderRadius: "10px",
      cursor: "pointer",
    }}
  />
)}
  
      {selection && (
        <div
          className={["popup", selection ? "active" : ""].join(" ")}
          style={{
            position: "absolute",
            left: mouse.x,
            top: mouse.y,
          }}
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
              <img src={textplanation} alt="Text" />
            </span>
            <span
              className={action === "image" ? "active-action" : ""}
              id="image"
              onClick={setActionType}
              style={imageProps}
              onMouseEnter={() => setHoverAction("image")}
              onMouseLeave={() => setHoverAction(null)}
            >
              <img src={image} alt="" />
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
  <img src={highlighter} alt="Highlight" /> {/* Use the highlighter icon */}
</span>

          </div>
  
          {isHistoryExpanded && (
            <div
              className={
                isNightModeActive
                  ? "history expanded night-mode"
                  : "history collapsed"
              }
              onClick={toggleHistory}
            >
              <h2>
                History{" "}
                {isHistoryExpanded && (
                  <img
                    src=""
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
                        "historyItem" +
                        (isNightModeActive ? " night-mode" : "")
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
          )}
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
  };
  
  export default ReadingAssistance;
  
