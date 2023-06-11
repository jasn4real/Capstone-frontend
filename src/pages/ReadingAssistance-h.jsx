import React, { useState, useEffect, useRef, useCallback } from "react";
import "../index.css";
import { useSpring, animated } from "react-spring";
import storageFunctions from "../storage_";
import anime from "animejs";
import {extractTextAndImageFromPDF, custom_split_by_jeans_format} from '../pdf-wrapper_';

import fetchFunctions from "../fetch_";
import {
  nightmode,
  highlighter,
  image,
  textex,
  explain,
  highlightword,
  imgres,
  popupbar,
  readas,
  readcomp,
  recents,
} from "../userwalkthrough/index";

import { Document, Page, pdfjs } from "react-pdf";



const ReadingAssistance = ({ fileHash, triggerHistoryUpdate }) => {
  const [selection, setSelection] = useState("");
  const [result, setResult] = useState("");
  const [action, setAction] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [fileTextContent, setFileTextContent] = useState("");
  const [isNightModeActive, setIsNightModeActive] = useState(false);
  const [hoverAction, setHoverAction] = useState(false);
  const [comments, setComments] = useState({});
  const con = useRef(null);
  const extractTextFromBlob = async (url) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    try {
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
              triggerHistoryUpdate(selection);

              // setResult(data);
              // addToHistory(selection, data, "textToExplanation");
            } else {
              setResult("No data returned");
            }
          });
        } else if (type === "image") {
          storageFunctions.textToImage(fileHash, selection, (data) => {
            if (data) {
              // setResult(data);
              // addToHistory(selection, data, "textToImage");
              triggerHistoryUpdate(selection);
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
    if(!fileHash) return;
    const fetchFileContent = async () => {
      try {
        // const textContent = await extractTextFromBlob(fetchFunctions.pdf_download_url_prefix + fileHash);

        const textContent = await custom_split_by_jeans_format(fetchFunctions.pdf_download_url_prefix + fileHash);
        console.log(textContent);
        setFileTextContent(textContent);

      } catch (error) {
        console.error("Error retrieving file content:", error);
      }
    };

    fetchFileContent();
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

  if (!fileTextContent) {
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
      }
    } catch (error) {
      console.error("An error occurred while highlighting:", error);
    }
  };

  return (
    <div className="bigcontainer" style={{ position: "relative", overflow: 'auto' }}>
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
          style={{
            backgroundColor: isNightModeActive ? "#fff" : "#000080",
            position: "",
            top: "10px",
            right: "10px",
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
              <img src={textex} alt="Text" />
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


          
        </div>
      )}
    </div>
  );
};

export default ReadingAssistance;

