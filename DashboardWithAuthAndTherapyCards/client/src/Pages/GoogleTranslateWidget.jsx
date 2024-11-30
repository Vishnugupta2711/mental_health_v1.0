import React, { useEffect } from "react";
import "../App.css"

const GoogleTranslateWidget = () => {
  useEffect(() => {
    const loadGoogleTranslateScript = () => {
      // Check if the script already exists
      if (
        !document.querySelector(
          'script[src="//translate.google.com/translate_a/element.js"]'
        )
      ) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        // When the script loads, initialize the widget
        script.onload = () => {
          if (window.google && window.google.translate) {
            window.googleTranslateElementInit();
          }
        };
      } else {
        // If script already exists, initialize the widget
        if (window.google && window.google.translate) {
          window.googleTranslateElementInit();
        }
      }
    };

    // Define the Google Translate init function globally
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // Default language
          includedLanguages: "en,ta,te,kn,ml,hi,es,fr,de,zh-CN,ja,ru", // Add desired languages
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    // Load the Google Translate script
    loadGoogleTranslateScript();
  }, []); // Run only once on mount

  return (
    <div
      id="google_translate_element"
      style={{
        position: "fixed",
        top: "30rem", // Slightly below the top for a balanced look
        right: "22px", // Add some space from the right edge
        zIndex: 1000, // Ensure it stays on top
        backgroundColor: "#A855F7", // Clean white background
        border: "2px solid #A855F7", // Subtle border for a card-like look
        borderRadius: "8px", // Rounded corners for a modern feel
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a soft shadow
        padding: "8px 12px", // Padding inside the widget
        fontFamily: "'Roboto', sans-serif", // Modern and clean font
        fontSize: "14px", // Small, readable font size
        textAlign: "center", // Center align text
      }}
    ></div>
  );
};

export default GoogleTranslateWidget;
