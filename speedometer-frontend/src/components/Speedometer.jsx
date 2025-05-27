"use client"

import { useState, useEffect } from "react"

const Speedometer = () => {
  const [speed, setSpeed] = useState(0)
  const [targetSpeed, setTargetSpeed] = useState(0)
  const [history, setHistory] = useState([])
  const [maxSpeed, setMaxSpeed] = useState(0)

  // Smooth speed animation
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      if (Math.abs(speed - targetSpeed) > 0.5) {
        const diff = targetSpeed - speed
        setSpeed((prev) => prev + diff * 0.1) // Smooth easing
      } else {
        setSpeed(targetSpeed)
      }
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [speed, targetSpeed])

  useEffect(() => {
    // Simulate real-time speed updates for demo
    const interval = setInterval(() => {
      const newSpeed = Math.floor(Math.random() * 220)
      setTargetSpeed(newSpeed)
      setMaxSpeed((prev) => Math.max(prev, newSpeed))

      // Add to history
      setHistory((prev) => [{ speed: newSpeed, timestamp: new Date() }, ...prev.slice(0, 9)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Calculate rotation for needle (0km/h = -135deg, 220km/h = 135deg)
  const needleRotation = -135 + (speed / 220) * 270

  // Calculate speed percentage for arc
  const speedPercentage = Math.min((speed / 220) * 100, 100)

  // Generate tick marks with proper positioning
  const generateTicks = () => {
    const ticks = []
    const totalTicks = 23 // 0 to 220 in steps of 10

    for (let i = 0; i < totalTicks; i++) {
      const angle = -135 + (i * 270) / (totalTicks - 1)
      const isMainTick = i % 2 === 0
      const value = i * 10
      const isMajorTick = i % 4 === 0

      ticks.push(
        <div
          key={i}
          className="tick"
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "50% 100%",
            position: "absolute",
            top: "0",
            left: "50%",
            width: "2px",
            height: "50%",
            marginLeft: "-1px",
          }}
        >
          <div
            className={`tick-mark ${isMajorTick ? "major" : isMainTick ? "main" : "minor"}`}
            style={{
              width: "100%",
              marginTop: isMajorTick ? "15px" : isMainTick ? "20px" : "25px",
              height: isMajorTick ? "35px" : isMainTick ? "25px" : "15px",
              background: isMajorTick ? "#00ff88" : isMainTick ? "rgba(0, 255, 136, 0.8)" : "rgba(255, 255, 255, 0.4)",
              boxShadow: isMajorTick ? "0 0 10px rgba(0, 255, 136, 0.5)" : "none",
            }}
          />
          {isMajorTick && (
            <div
              className="tick-label"
              style={{
                transform: `rotate(${-angle}deg)`,
                position: "absolute",
                top: "55px",
                left: "50%",
                transform: `translateX(-50%) rotate(${-angle}deg)`,
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#00ff88",
                textShadow: "0 0 10px rgba(0, 255, 136, 0.5)",
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </div>
          )}
        </div>,
      )
    }
    return ticks
  }

  return (
    <div className="speedometer-app">
      {/* Animated background */}
      <div className="bg-grid"></div>
      <div className="bg-particles"></div>

      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="title-text">VELOCITY</span>
            <span className="title-sub">MONITOR</span>
          </h1>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>LIVE</span>
          </div>
        </header>

        <div className="main-display">
          {/* Primary Speedometer */}
          <div className="speedometer-section">
            <div className="speedometer">
              {/* Outer ring */}
              <div className="outer-ring">
                <svg className="speed-arc-svg" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00ff88" />
                      <stop offset="70%" stopColor="#ffff00" />
                      <stop offset="100%" stopColor="#ff4444" />
                    </linearGradient>
                  </defs>
                  {/* Background arc */}
                  <path
                    d="M 30 170 A 70 70 0 1 1 170 170"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Speed arc */}
                  <path
                    d="M 30 170 A 70 70 0 1 1 170 170"
                    fill="none"
                    stroke="url(#arcGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(speedPercentage * 439.82) / 100} 439.82`}
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(0, 255, 136, 0.6))",
                      transition: "stroke-dasharray 0.5s ease-out",
                    }}
                  />
                </svg>
              </div>

              {/* Tick marks */}
              <div className="ticks-container">{generateTicks()}</div>

              {/* Needle */}
              <div
                className="needle"
                style={{
                  transform: `rotate(${needleRotation}deg)`,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "4px",
                  height: "45%",
                  transformOrigin: "50% 100%",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: 3,
                  marginLeft: "-2px",
                  marginTop: "-45%",
                }}
              >
                <div
                  className="needle-line"
                  style={{
                    width: "100%",
                    height: "85%",
                    background: "linear-gradient(to top, #ff4444, #ff8888)",
                    borderRadius: "2px",
                    boxShadow: "0 0 20px rgba(255, 68, 68, 0.8)",
                  }}
                ></div>
                <div
                  className="needle-tip"
                  style={{
                    position: "absolute",
                    top: "-5px",
                    left: "50%",
                    width: "10px",
                    height: "10px",
                    background: "#ff4444",
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0 0 15px rgba(255, 68, 68, 0.8)",
                  }}
                ></div>
              </div>

              {/* Center hub */}
              <div className="center-hub">
                <div className="hub-inner"></div>
              </div>

              {/* Speed readout */}
              <div className="speed-readout">
                <div className="speed-value">{Math.round(speed)}</div>
                <div className="speed-unit">KM/H</div>
              </div>
            </div>
          </div>

          {/* Side panels */}
          <div className="side-panels">
            {/* Stats panel */}
            <div className="panel stats-panel">
              <h3 className="panel-title">STATISTICS</h3>
              <div className="stat-item">
                <span className="stat-label">CURRENT</span>
                <span className="stat-value">{Math.round(speed)} KM/H</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">MAX SPEED</span>
                <span className="stat-value">{maxSpeed} KM/H</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">STATUS</span>
                <span className="stat-value status-active">ACTIVE</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">ZONE</span>
                <span
                  className={`stat-value ${speed > 120 ? "danger-zone" : speed > 80 ? "warning-zone" : "safe-zone"}`}
                >
                  {speed > 120 ? "DANGER" : speed > 80 ? "CAUTION" : "SAFE"}
                </span>
              </div>
            </div>

            {/* History panel */}
            <div className="panel history-panel">
              <h3 className="panel-title">RECENT ACTIVITY</h3>
              <div className="history-list">
                {history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-time">{item.timestamp.toLocaleTimeString()}</div>
                    <div className="history-speed">{item.speed} KM/H</div>
                    <div className="history-bar">
                      <div className="history-fill" style={{ width: `${(item.speed / 220) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .speedometer-app {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          color: #ffffff;
          font-family: 'Orbitron', 'Courier New', monospace;
          position: relative;
          overflow: hidden;
        }

        .bg-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
          z-index: 1;
        }

        .bg-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(0, 191, 255, 0.1) 0%, transparent 50%);
          animation: particleFloat 15s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes particleFloat {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .container {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          border-bottom: 1px solid rgba(0, 255, 136, 0.3);
          padding-bottom: 1rem;
        }

        .title {
          margin: 0;
        }

        .title-text {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          background: linear-gradient(45deg, #00ff88, #00bfff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
        }

        .title-sub {
          display: block;
          font-size: 1rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.7);
          margin-top: -0.5rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #00ff88;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .main-display {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 3rem;
          align-items: start;
        }

        .speedometer-section {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .speedometer {
          position: relative;
          width: 400px;
          height: 400px;
          margin: 2rem;
        }

        .outer-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          padding: 20px;
        }

        .speed-arc-svg {
          width: 100%;
          height: 100%;
        }

        .ticks-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .center-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #333, #666);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 4;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }

        .hub-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: #00ff88;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
        }

        .speed-readout {
          position: absolute;
          bottom: 25%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 2;
        }

        .speed-value {
          font-size: 3rem;
          font-weight: 700;
          color: #00ff88;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
          line-height: 1;
        }

        .speed-unit {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.2em;
          margin-top: 0.5rem;
        }

        .side-panels {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .panel {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .panel-title {
          margin: 0 0 1.5rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #00ff88;
          letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(0, 255, 136, 0.3);
          padding-bottom: 0.5rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.5rem 0;
        }

        .stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-weight: 600;
          color: #ffffff;
        }

        .status-active {
          color: #00ff88 !important;
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .safe-zone {
          color: #00ff88 !important;
        }

        .warning-zone {
          color: #ffff00 !important;
        }

        .danger-zone {
          color: #ff4444 !important;
        }

        .history-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .history-item {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border-left: 3px solid #00ff88;
        }

        .history-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.25rem;
        }

        .history-speed {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .history-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .history-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88, #00bfff);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        @media (max-width: 1024px) {
          .main-display {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .speedometer {
            width: 300px;
            height: 300px;
          }
          
          .speed-value {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .title-text {
            font-size: 2rem;
          }
          
          .speedometer {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  )
}

export default Speedometer
