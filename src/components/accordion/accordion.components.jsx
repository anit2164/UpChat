import { Fragment, useState } from "react";
import AccordionStyle from "./accordion.module.css";
import { ReactComponent as ArrowDownSVG } from "@SVG/arrowDown.svg";
import Tile from "@Components/tile/tile.components";

const Accordion = ({ icon, label, isCollapsible, search }) => {
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
      {showBody && <Tile search={search} />}
    </Fragment>
  );
};

export default Accordion;
