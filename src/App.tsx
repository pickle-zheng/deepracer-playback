import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Papa from "papaparse";

import WayPoints from "./container/WayPoints/WayPoints";

const App = () => {
  const [data, setData] = useState([]);
  type StepData = {
    episode: string;
    steps: number;
    X: number;
    Y: number;
    yaw: number;
    steer: number;
    throttle: number;
    action: string;
    reward: number;
    done: boolean;
    all_wheels_on_track: boolean;
    progress: number;
    closest_waypoint: number;
    track_len: number;
    tstamp: number;
    episode_status: string;
    pause_duration: number;
  };

  // const mapDataKeyValue = (originalData): StepData[] => {
  //   const keys = originalData[0]; // first object in the array contains the keys
  //   const steps = originalData.slice(1);
  //   return steps.map((step) => {
  //     const newObj = {};
  //     step.forEach((value: string, index: number) => {
  //       switch (keys[index]) {
  //         case "steps":
  //         case "X":
  //         case "Y":
  //         case "yaw":
  //         case "steer":
  //         case "throttle":
  //         case "reward":
  //         case "progress":
  //         case "closest_waypoint":
  //         case "track_len":
  //         case "tstamp":
  //         case "pause_duration":
  //           newObj[keys[index]] = Number.parseFloat(value);
  //           break;
  //         case "episode":
  //         case "action":
  //         case "episode_status":
  //           newObj[keys[index]] = value;
  //           break;
  //         case "done":
  //         case "all_wheels_on_track":
  //           newObj[keys[index]] = value === "False" ? false : true;
  //           break;
  //         default:
  //       }
  //     });
  //     return newObj;
  //   });
  // };
  // const fetchcsv = () => {
  //   return fetch("/data/0-iteration.csv").then((response) => {
  //     let reader = response.body.getReader();
  //     let decoder = new TextDecoder("utf-8");
  //     return reader.read().then((result) => {
  //       return decoder.decode(result.value);
  //     });
  //   });
  // };

  // const getCsvData = async () => {
  //   const csvData = await fetchcsv();
  //   if (csvData) {
  //     Papa.parse(csvData, {
  //       complete: (result) => {
  //         console.log(result.data);
  //         setData(mapDataKeyValue(result.data));
  //       }
  //     });
  //   }
  // };

  const getData = () => {
    fetch("/data/0-iteration-1.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className='App'>
      <WayPoints data={data} />
    </div>
  );
};

export default App;
