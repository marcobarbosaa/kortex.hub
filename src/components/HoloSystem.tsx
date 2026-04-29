import "./HoloSystem.css";

const HoloSystem = () => {
  return (
    <div className="holo-system-wrapper">
      <div className="holo-core-container">
        <div className="holo-box-wrapper">
          <div className="holo-box">
            <div className="holo-inner"></div>
            <div className="scan-effect"></div>
            <div className="holo-particles">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="holo-particle"></div>
              ))}
            </div>

            <div className="activation-rings">
              <div className="activation-ring"></div>
              <div className="activation-ring"></div>
              <div className="activation-ring"></div>
            </div>

            <div className="cube-transform">
              <div className="cube-face"></div>
              <div className="cube-face"></div>
              <div className="cube-face"></div>
              <div className="cube-face"></div>
              <div className="cube-face"></div>
              <div className="cube-face"></div>
            </div>
          </div>

          <div className="corner-accent top-left"></div>
          <div className="corner-accent top-right"></div>
          <div className="corner-accent bottom-left"></div>
          <div className="corner-accent bottom-right"></div>
        </div>

        <div className="holo-glow"></div>

        <div className="status-text">MOTOR DE CRESCIMENTO</div>

        <div className="frequency-spectrum">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="frequency-bar" style={{ animationDelay: `${(i % 5) * 0.2}s` }}></div>
          ))}
        </div>

        <div className="data-chips">
          <div className="data-chip">ESTRATÉGIA DE DADOS</div>
          <div className="data-chip">DESIGN DE ALTA CONVERSÃO</div>
          <div className="data-chip">AUTOMAÇÃO INTELIGENTE</div>
          <div className="data-chip">ESCALA PREVISÍVEL</div>
        </div>
      </div>
    </div>
  );
};

export default HoloSystem;
