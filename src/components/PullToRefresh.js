import React, { useState, useRef, useEffect } from "react";
import { HiArrowDown } from "react-icons/hi2";

const PullToRefresh = ({ children }) => {
  const [pulling, setPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);

  const PULL_THRESHOLD = 80;

  const handleTouchStart = (e) => {
    if (window.scrollY === 0 && !isRefreshing) {
      setStartY(e.touches[0].clientY);
      setPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!pulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0) {
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > PULL_THRESHOLD) {
      setIsRefreshing(true);
    }
    setPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    if (isRefreshing) {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [isRefreshing]);

  const containerStyle = {
    transition: "transform 0.3s",
    transform: `translateY(${
      isRefreshing
        ? PULL_THRESHOLD
        : Math.min(pullDistance, PULL_THRESHOLD * 1.5)
    }px)`,
    position: "relative",
    zIndex: 1,
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={containerStyle}
    >
      <div
        className="absolute top-0 left-0 right-0 flex justify-center items-center -mt-14"
        style={{
          opacity: isRefreshing || pulling ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <div className="bg-brand-light-dark p-3 rounded-full shadow-lg">
          {isRefreshing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-brand-primary"></div>
          ) : (
            <HiArrowDown
              className="h-6 w-6 text-brand-primary transition-transform duration-200"
              style={{
                transform: `rotate(${
                  (pullDistance / PULL_THRESHOLD) * 180
                }deg)`,
              }}
            />
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default PullToRefresh;
