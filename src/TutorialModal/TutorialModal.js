import React, { useState, useEffect } from "react";
import "./tutorial-modal.css";

import {
  nightmode,
  highlighter,
  image,
  explain,
  highlightword,
  imgres,
  popupbar,
  readas, 
  readcomp,
  recents,
  binarylogo,
  confucius,
  textplanation,
  Caplogo2
} from "../userwalkthrough/index";

function TutorialModal({ onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);


  let synth = window.speechSynthesis;
  let voices = [];

  useEffect(() => {
    populateVoices();
  }, []);


  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[50];
    synth.speak(utterance);
  };

  function populateVoices() {
    voices = synth.getVoices();
    for (let i = 0; i < voices.length; i++) {
      console.log(`Voice ${i}: ${voices[i].name}, ${voices[i].lang}`);
    }
  }

  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  const nextSlide = () => {
    // Cancel any ongoing speech before moving to the next slide
    window.speechSynthesis.cancel();
    setCurrentSlide((prevSlide) => prevSlide + 1);
  };

  const closeTutorial = () => {
    window.speechSynthesis.cancel();
    onClose();
  };

  useEffect(() => {
    const handleSpeechSynthesisReady = () => {
      if (currentSlide < tutorialSlides.length) {
        tutorialSlides[currentSlide].speak();
      }
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      if (window.speechSynthesis.getVoices().length > 0) {
        handleSpeechSynthesisReady();
      } else {
        window.speechSynthesis.onvoiceschanged = handleSpeechSynthesisReady;
      }
    }
  }, [currentSlide]);

  const tutorialSlides = [
    {
      text: "",
      graphic: confucius,
      style: { maxWidth: "100%",}, // Set the maximum width of the image
      speak: () => {
        speak("");
      },
    },
    {
      text: "Welcome! To Binary Mind. This application will fundamentally change your reading habits",
      graphic: Caplogo2,
      speak: () => {
        speak("Welcome! To Binary Mind. This application will fundahmentally change your reading habits");
      },
    },
    {
      text: "On the left hand side is your recents tab. This is where you'll be able to quickly access other files you've uploaded in the past and all their relevant texts and queries",
      graphic: recents,
      speak: () => {
        speak(
          "on the left hand side is your recents tab. This is where you'll be able to quickly access other files you've uploaded in the past and all their relevant texts and queries"
        );
      },
    },
    {
      text: "In the center, you'll find your uploaded text in a window along with a host of powerful and useful functionalities. This is your Reading Assistance page. Simply highlight the pertinent text and select your action",
      graphic: popupbar,
      speak: () => {
        speak(
          "In the center, you'll find your uploaded text in a window, along with a host of powerful and useful functionalities. This is your Reeding Assistance page. Simply highlight the pertinent text and select your action"
        );
      },
    },
    {
      text: "If you ever run across a confusing word, sentence or even paragraph, highlighting the problematic text and selecting text to explanation will decipher, clarify, and explain what was said like a tutor guiding a student. It translates any written language",
      graphic: explain,
      speak: () => {
        speak(
          "if you ever run across a confusing word, sentence or even paragraph, highlighting the problematic text and selecting text two explanation will decipher, clarify, and explain what was said like a tutor guiding a student. It translates any written language"
        );
      },
    },
    {
      text: "We all often wish for visual aid when we read. It's common for us to read things we can't visualize because we've simply never seen them before or are unfamilar with the concept. Text to image provides on demand imagery for things, places and concepts",
      graphic: imgres,
      speak: () => {
        speak(
          "We all often wish for visual aid when we read. It's common for us to read things we cant visualize because we've simply never seen them before or are unfamilar with the concept. Text to image provides on demand imagery for things, places and concepts"
        );
      },
    },
    {
      text: "Highlight words and paragraphs you wish to stand out, parts of the reading text you know you'll want to come back to",
      graphic: highlightword,
      speak: () => {
        speak(
          "Highlight words and paragraphs you wish to stand out, parts of the reading text you know you'll want to come back to"
        );
      },
    },
    {
      text: "When the white background begins to stress your eyes during long or late night reading sessions, simply turn on the Night Mode feature by clicking the blue circle in the top left corner",
      graphic: nightmode,
      speak: () => {
        speak(
          "when the white background begins to stress your eyes during long or late night reading sessions, simply turn on the Night Mode feature by clicking the blue circle in the top left corner"
        );
      },
    },
    {
      text: "On the right hand side is the Reading Comprehension page. This will be your personal tutor. You can ask any question pertaining to the uploaded text on the right and The AI will explain and give context, like you're talking to an expert on the subject",
      graphic: readcomp,
      speak: () => {
        speak(
          "On the right hand side is the reading comprehension page. This will be your personal tutor. You can ask any question pertaining to the uploaded text on the right and The ay eye will explain and give context, like you're talking to an expert on the subject"
        );
      },
    },
    {
      text: "You have the option to choose from three different aptitude levels: Kids, General, and Advanced. This will allow each user to have an experience curated specifically for their use case",
      graphic: readcomp,
      speak: () => {
        speak(
          "you have the option to choose from three different aptitude levels: Kids, General, and Advanced. This will allow each user to have an experience curated specifically for their use case" 
        );
      },
    },
    {
      text: "All text and image query results from the Reading Assistance page will be displayed in this space, as well as all questions asked on the Reading Comprehension page and their respective responses.",
      graphic: readcomp,
      speak: () => {
        speak(
          "all text and image query results from the reading assistance page will be displayed in this space, as well as all questions asked on the reading comprehension page and their respective responses." 
        );
      },
    },
  ];

  return (
    <div className="tutorial-modal">
      <button className="close-button" onClick={closeTutorial}>
        &times;
      </button>
      <div className="slide-container">
        <img
          src={tutorialSlides[currentSlide].graphic}
          alt="Slide"
          className="slide-image"
        />
        <p className="slide-text">{tutorialSlides[currentSlide].text}</p>
      </div>
      {currentSlide < tutorialSlides.length - 1 && (
        <button className="next-button" onClick={nextSlide}>
          Next
        </button>
      )}
      {currentSlide === tutorialSlides.length - 1 && (
        <button className="done-button" onClick={closeTutorial}>
          Done
        </button>
      )}
    </div>
  );
}

export default TutorialModal;
