import { Fragment, useEffect, useState } from "react";
import PinAccordianStyle from "./pinAccordian.module.css";
import { ReactComponent as ArrowDownSVG } from "@SVG/arrowDown.svg";
import Tile from "@Components/tile/tile.components";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import PinChatDetails from "../pinChats/pinChatsDetails";

firebase.initializeApp(firebaseConfig);

const PinAccordian = ({
  icon,
  label,
  isCollapsible,
  search,
  setDataFalse,
  LastPinnedGroups,
  dataFalse,
}) => {
  const [showBody, setShowBody] = useState(true);
  const [collapseClass, setCollapseClass] = useState(false);

  const toggleAccordion = () => {
    setShowBody(!showBody);
    setCollapseClass(!collapseClass);
  };

  return (
    <Fragment>
      <div
        className={PinAccordianStyle.container}
        onClick={isCollapsible ? toggleAccordion : null}
      >
        <div className={PinAccordianStyle.containerInnerHeader}>
          {icon}
          <div className={PinAccordianStyle.title}>{label}</div>
        </div>
        <div>
          <ArrowDownSVG
            className={
              collapseClass ? PinAccordianStyle?.accordionCollapsed : ""
            }
          />
        </div>
      </div>
      {showBody && (
        <PinChatDetails
          search={search}
          dataFalse={dataFalse}
          LastPinnedGroups={LastPinnedGroups}
          setDataFalse={setDataFalse}
        />
      )}
    </Fragment>
  );
};

export default PinAccordian;
