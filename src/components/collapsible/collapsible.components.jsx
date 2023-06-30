import CollapseStyle from "./collapsible.module.css";
import { ReactComponent as ChatSVG } from "@SVG/chat.svg";
import { ReactComponent as ArrowDownSVG } from "@SVG/arrowDown.svg";
import { useState } from "react";
const Collapse = ({ setToggle, toggle }) => {
  const [showClass, setShowClass] = useState(true);
  return (
    <div
      className={` ${CollapseStyle.container} ${
        showClass ? CollapseStyle.toggleClose : ""
      } `}
      onClick={() => {
        setToggle(!toggle);
        setShowClass(false);
      }}
    >
      <div>
        <ChatSVG />
        <div className={CollapseStyle.label}>Upchat</div>
      </div>
      <div className={CollapseStyle.toggleCloseRight}>
        <span className={CollapseStyle.unreadNum}>17</span>
        <ArrowDownSVG className={CollapseStyle.fiChevronLeft} />
      </div>
    </div>
  );
};

export default Collapse;
