import React, { useEffect, useState } from "react";

const AccessibilityInstructions = React.forwardRef((props, ref) => {
  const [isGuidanceEnabled, setIsGuidanceEnabled] = useState(false);

  // Function to handle Text-to-Speech
  const speak = (text) => {
    if ("speechSynthesis" in window && isGuidanceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // Set language
      utterance.rate = 1; // Set speed
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isGuidanceEnabled) {
      speak(
        "Welcome to our website. To navigate, you can use voice commands or buttons. Say 'Hello Aura' to activate voice commands. Use the toggle button to enable or disable guidance."
      );
    }
  }, [isGuidanceEnabled]);

  // Expose functions to enable guidance and trigger speech
  React.useImperativeHandle(ref, () => ({
    enableGuidance: () => {
      setIsGuidanceEnabled(true);
      speak("Guidance is now enabled. Welcome to our website.");
    },
  }));

  const toggleGuidance = () => {
    setIsGuidanceEnabled((prev) => !prev);

    // Provide immediate feedback when toggled
    const feedback = !isGuidanceEnabled
      ? "Guidance is now enabled."
      : "Guidance is now disabled.";
    speak(feedback);
  };

  return (
    <button
      onClick={toggleGuidance}
      className={`fixed bottom-8 top-[38.2rem] right-[7rem] w-12 h-12 rounded-full shadow-lg z-50 ${
        isGuidanceEnabled ? "bg-green-500" : "bg-gray-500"
      } flex items-center justify-center`}
      aria-label={isGuidanceEnabled ? "Disable guidance" : "Enable guidance"}
      title={isGuidanceEnabled ? "Disable Guidance" : "Enable Guidance"}
    >
      <span
        style={{
          fontSize: "1.5rem",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {isGuidanceEnabled ? "✓" : "?"}
      </span>
    </button>
  );
});

export default AccessibilityInstructions;
