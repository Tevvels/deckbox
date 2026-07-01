import React from "react";
import "../styles/Skeleton.css";
function Skeleton({ className }) {
  return (
    <div className={className}>
      {className === "singleDeck" && (
        <div className="skeleton_card singleDeck_card"></div>
      )}
      {(className === "myDeck" || className === "publicDisplay") && (
        <>
          <div className="skeleton_card myDeck_card"></div>
          <div className="skeleton_card myDeck_card"></div>
          <div className="skeleton_card myDeck_card"></div>
        </>
      )}
      {className === "searching" && (
        <>
          <div className="skeleton_card searching_card"></div>
          <div className="skeleton_card searching_card"></div>
          <div className="skeleton_card searching_card"></div>
        </>
      )}
    </div>
  );
}

export default Skeleton;
