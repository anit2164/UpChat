import { Fragment, useEffect, useState } from "react";
import AccordionStyle from "./accordion.module.css";
import { ReactComponent as ArrowDownSVG } from "@SVG/arrowDown.svg";
import Tile from "@Components/tile/tile.components";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

firebase.initializeApp(firebaseConfig);

const Accordion = ({
  icon,
  label,
  isCollapsible,
  search,
  data,
  LastPinnedGroups,
  LastSnoozeGroups,
  setData,
  readCount
}) => {
  const [showBody, setShowBody] = useState(true);

  const toggleAccordion = () => {
    setShowBody(!showBody);
  };

  return (
    <Fragment>
      <div
        className={AccordionStyle.container}
        onClick={isCollapsible ? toggleAccordion : null}
      >
        <div className={AccordionStyle.containerInnerHeader}>
          {icon}
          <div className={AccordionStyle.title}>{label}</div>
        </div>
        <div>
          <ArrowDownSVG />
        </div>
      </div>
      {showBody && (
        <Tile
          search={search}
          data={data}
          LastPinnedGroups={LastPinnedGroups}
          LastSnoozeGroups={LastSnoozeGroups}
          setData={setData}
          readCount={readCount}
        />
      )}
    </Fragment>
  );
};

export default Accordion;
