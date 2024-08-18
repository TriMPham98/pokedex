import React, { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import "./ScrollToTop.css";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/pokemon-plink.mp3");
  }, []);

  const scrollToTop = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <ChevronUp size={24} />
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
