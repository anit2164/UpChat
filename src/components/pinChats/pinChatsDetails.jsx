import { useState, useEffect } from "react";
import { Dropdown, Space } from "antd";
import PinChatDetailsStyle from "./pinChatsDetails.module.css";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
import { ReactComponent as SnoozeSVG } from "@SVG/snooze.svg";

const PinChatDetails = ({ search, data }) => {
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlVQMTMwMiIsIkxvZ2luVXNlcklkIjoiMTciLCJMb2dpblVzZXJUeXBlSWQiOiIyIiwibmJmIjoxNjg3MzI1MTA3LCJleHAiOjE2ODczNjExMDcsImlhdCI6MTY4NzMyNTEwN30.9Ge1Y5QGQrf7g40GvI9FsgJ7QWIQrU0MTSHwBbFXZzo";

  //   const tempToken = localStorage.setItem("token", token);

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
      <div className={PinChatDetailsStyle.chatWrapper}>
        {filterData?.map((item) => {
          console.log(item?.isPinned, "pindata");
          return (
            <div
              className={`${PinChatDetailsStyle.chatItem} ${PinChatDetailsStyle.unreadMsg}`}
            >
              <div className={PinChatDetailsStyle.dFlex}>
                <div
                  className={` ${PinChatDetailsStyle.chatInitialThumb} ${PinChatDetailsStyle.blueThumb} `}
                >
                  {item?.companyInitial}
                </div>
                <div className={PinChatDetailsStyle.chatGroupDetails}>
                  <div className={PinChatDetailsStyle.channelName}>
                    {item?.companyName} | {item?.role}
                  </div>
                  <span className={PinChatDetailsStyle.hrStatus}>
                    {item?.hrNumber} | {item?.hrStatus}
                  </span>
                </div>
              </div>
              <div className={PinChatDetailsStyle.dFlexTime}>
                <div className={PinChatDetailsStyle.timeStamp}>12:30 PM</div>
                <div className={PinChatDetailsStyle.unreadNum}>5</div>
                <Dropdown
                  className={PinChatDetailsStyle.dotMenuMain}
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <span className={PinChatDetailsStyle.dotMenu}></span>
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PinChatDetails;
