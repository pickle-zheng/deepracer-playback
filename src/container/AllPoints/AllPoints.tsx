import React, { useRef } from "react";
import styles from "./AllPoints.module.scss";

const AllPoints = ({ data }) => {
  return <div className={styles.allPointsContainer}>{data.toString()}</div>;
};

export default AllPoints;
