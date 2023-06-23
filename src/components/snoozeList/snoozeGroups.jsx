import { useState, useEffect } from "react";
import { Dropdown, Space } from "antd";
// import SnoozeGroupsStyle from "./pinChatsDetails.module.css";
import SnoozeGroupsStyle from "./snoozeGroups.module.css";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
import { ReactComponent as SnoozeSVG } from "@SVG/snooze.svg";

const SnoozeGroupDetails = ({ search, data }) => {
  const items = [
    {
      label: "PIN Channel",
      key: "0",
      icon: <PinSVG />,
    },
    {
      label: "View HR Detail Page",
      key: "1",
      icon: <BriefcaseSVG />,
    },
    {
      label: "Channel Library",
      key: "2",
      icon: <ChannelLibrarySVG />,
    },
    {
      label: "Snooze",
      key: "3",
      icon: <SnoozeSVG />,
    },
    {
      label: "Leave",
      key: "4",
      icon: <LeaveSVG />,
    },
  ];

  const filterData = data?.filter((item) => {
    return item?.isPinned === true;
  });

  return (
    <>
      <div className={SnoozeGroupsStyle.chatWrapper}>
        {filterData?.map((item) => {
          return (
            <div
              className={`${SnoozeGroupsStyle.chatItem} ${SnoozeGroupsStyle.unreadMsg}`}
            >
              <div className={SnoozeGroupsStyle.dFlex}>
                <div
                  className={` ${SnoozeGroupsStyle.chatInitialThumb} ${SnoozeGroupsStyle.blueThumb} `}
                >
                  {item?.companyInitial}
                </div>
                <div className={SnoozeGroupsStyle.chatGroupDetails}>
                  <div className={SnoozeGroupsStyle.channelName}>
                    {item?.companyName} | {item?.role}
                  </div>
                  <span className={SnoozeGroupsStyle.hrStatus}>
                    {item?.hrNumber} | {item?.hrStatus}
                  </span>
                </div>
              </div>
              <div className={SnoozeGroupsStyle.dFlexTime}>
                <div className={SnoozeGroupsStyle.timeStamp}>12:30 PM</div>
                <div className={SnoozeGroupsStyle.unreadNum}>5</div>
                <Dropdown
                  className={SnoozeGroupsStyle.dotMenuMain}
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <span className={SnoozeGroupsStyle.dotMenu}></span>
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </div>
          );
        })}
        {filterData?.length === 0 && (
          <span className={SnoozeGroupsStyle.noDataFound}>No data found</span>
        )}
      </div>
    </>
  );
};

export default SnoozeGroupDetails;
