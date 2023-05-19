import React, {useState, useEffect, FC} from 'react';

type TypewriterProps = {
  text: string,
  speed?: number,
}

const Typewriter: FC<TypewriterProps> = ({text, speed = 100}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    startTyping();
  }, []);

  useEffect(() => {
    if (currentIndex >= text.length) {
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, speed);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex >= text.length) {
      return;
    }
    setCurrentText(currentText + text.charAt(currentIndex));
  }, [currentIndex]);

  function startTyping() {
    setCurrentIndex(0);
    setCurrentText("");
  }

  return <span>{currentText}</span>;
};

export default Typewriter;