import React, { Fragment, useEffect, useState } from "react";
import AccordionStyle from "./accordion.module.css";
import ArrowDownSVG from "../../assets/svg/arrowDown.svg";
import Tile from "../tile/tile.components";
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
  readCount,
  setUpChat,
  upChat
}: any) => {
  const [showBody, setShowBody] = useState(true);
  const [collapseClass, setCollapseClass] = useState(false);

  const toggleAccordion: any = () => {
    setShowBody(!showBody);
    setCollapseClass(!collapseClass);
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
          <ArrowDownSVG
            className={collapseClass ? AccordionStyle?.accordionCollapsed : ""}
          />
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
          setUpChat={setUpChat}
          upChat={upChat}
        />
      )}
    </Fragment>
  );
};

export default Accordion;
