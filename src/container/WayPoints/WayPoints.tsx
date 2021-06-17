import React, { useRef, useEffect, useState } from "react";
import _ from "lodash";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-regular-svg-icons";

import styles from "./WayPoints.module.scss";

const WayPoints = ({ data }) => {
  const [canvasSize, setCanvasSize] = useState({ height: 0, width: 0 });

  const [showing, setShowing] = useState([]);

  const dataByEpisode = (flatData: []) => {
    const grouped = _.groupBy(flatData, (step) => {
      return step.episode;
    });
    return grouped;
  };

  const canvasRef = useRef(null);

  const draw = (ctx, frameCount, waypointsByEpisode) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const [key, value] of Object.entries(waypointsByEpisode)) {
      if (showing[key] || showing[key] === undefined) {
        waypointsByEpisode[key].forEach((waypoint) => {
          switch (key) {
            case "0":
              ctx.fillStyle = `rgba(93, 115, 126, ${waypoint.throttle})`;
              break;
            case "1":
              ctx.fillStyle = `rgba(100, 182, 172, ${waypoint.throttle})`;
              break;
            case "2":
              ctx.fillStyle = `rgba(225, 85, 0, ${waypoint.throttle})`;
              break;
            case "3":
              ctx.fillStyle = `rgba(218, 255, 239, ${waypoint.throttle})`;
              break;
            default:
              ctx.fillStyle = "#000";
              break;
          }
          ctx.beginPath();
          ctx.arc(
            parseFloat(waypoint.X) * 50 + canvasSize.width / 2,
            parseFloat(waypoint.Y) * 50 + canvasSize.height / 2,
            2,
            0,
            2 * Math.PI
          );
          ctx.fill();
        });
      }
    }
  };

  const toggleRuns = (index) => {
    let newShowingState = [...showing];
    newShowingState[index] = showing[index] ? false : true;
    setShowing(newShowingState);
  };

  useEffect(() => {
    const groupedData = dataByEpisode(data);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId;

    //Our draw came here
    const render = () => {
      frameCount++;
      draw(context, frameCount, groupedData);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    setCanvasSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [data, showing]);

  return (
    <div>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
      />
      <div className={styles.gui}>
        {Object.keys(dataByEpisode(data)).map((key, i) => (
          <div
            className={`${styles.button} ${
              showing[i] === false ? styles.off : null
            }`}
            onClick={() => toggleRuns(i)}
            key={i}
          >
            <FontAwesomeIcon icon={faPlayCircle} />
            Run {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WayPoints;
