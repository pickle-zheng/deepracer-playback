import React, { useRef, useEffect, useState } from "react";
import _ from "lodash";

import styles from "./WayPoints.module.scss";

const WayPoints = ({ data }) => {
  const [canvasSize, setCanvasSize] = useState({ height: 0, width: 0 });

  const [showing, setShowing] = useState([]);

  const [groupedData, setGroupedData]= useState({});

  type IndivisualWayPoint = {
    X: string,
    Y: string,
    action: string,
    all_wheels_on_track: boolean,
    closest_waypoint: string,
done: number,
episode: number,
episode_status: string,
pause_duration: string,
progress: boolean,
reward: string,
steer:string,
steps: number,
throttle: string,
track_len: number,
tstamp:string,
yaw:string
  }
  type EpisodeData = {
    index: IndivisualWayPoint[]
  }

  const dataByEpisode = (flatData: []):EpisodeData => {
    const grouped: EpisodeData = _.groupBy(flatData, (step) => {
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
    newShowingState[index] = showing[index] === true ? false : true;
    setShowing(newShowingState);
  };

  // update grouped or mapped data when new data comes in
  useEffect(() => {
    setGroupedData( dataByEpisode(data));

    let initialShowing = []
    Object.keys(dataByEpisode(data)).forEach((key, i) => {
      initialShowing[i] = true
    });
    setShowing(initialShowing)
    setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    });
  }, [data]);

  // redraw canvas with showing or data changed
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId: number;
    //Our draw came here
    const render = () => {
      frameCount++;
      draw(context, frameCount, groupedData);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
},[groupedData,showing,canvasSize]);

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
            className={`${styles.button} ${showing[i] === false ? styles.off : null
              }`}
            onClick={() => toggleRuns(i)}
            key={i}
          >
            Run {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WayPoints;
