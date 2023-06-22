import { useState, useEffect } from "react";
import { Dropdown, Space } from "antd";
import TileStyle from "./tile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
import { ReactComponent as SnoozeSVG } from "@SVG/snooze.svg";

const Tile = ({ search, data }) => {
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlVQMTMwMiIsIkxvZ2luVXNlcklkIjoiMTciLCJMb2dpblVzZXJUeXBlSWQiOiIyIiwibmJmIjoxNjg3MzI1MTA3LCJleHAiOjE2ODczNjExMDcsImlhdCI6MTY4NzMyNTEwN30.9Ge1Y5QGQrf7g40GvI9FsgJ7QWIQrU0MTSHwBbFXZzo";

  // const tempToken = localStorage.setItem("token", token);

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
    return item?.isPinned === false;
  });

  return (
    <>
      <div className={TileStyle.chatWrapper}>
        {filterData?.map((item) => {
          return (
            <div className={`${TileStyle.chatItem} ${TileStyle.unreadMsg}`}>
              <div className={TileStyle.dFlex}>
                <div
                  className={` ${TileStyle.chatInitialThumb} ${TileStyle.blueThumb} `}
                >
                  {item?.companyInitial}
                </div>
                <div className={TileStyle.chatGroupDetails}>
                  <div className={TileStyle.channelName}>
                    {item?.companyName} | {item?.role}
                  </div>
                  <span className={TileStyle.hrStatus}>
                    {item?.hrNumber} | {item?.hrStatus}
                  </span>
                </div>
              </div>
              <div className={TileStyle.dFlexTime}>
                <div className={TileStyle.timeStamp}>12:30 PM</div>
                <div className={TileStyle.unreadNum}>5</div>
                <Dropdown
                  className={TileStyle.dotMenuMain}
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <span className={TileStyle.dotMenu}></span>
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </div>
          );
        })}
        {filterData?.length === 0 && (
          <span className={TileStyle.noDataFound}>No data found</span>
        )}
      </div>
    </>
  );
};

export default Tile;
