import { useState, useEffect, useCallback } from "react";
import { Dropdown, Space } from "antd";
import TileStyle from "./tile.module.css";
import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
import { ReactComponent as SnoozeSVG } from "@SVG/snooze.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { ChannelMenu } from "@/constants/application";
import { ReactComponent as ViewHRDetailsSVG } from "@SVG/viewHrDetails.svg";

firebase.initializeApp(firebaseConfig);

const Tile = ({ search, data, LastPinnedGroups, LastSnoozeGroups }) => {
  console.log(LastSnoozeGroups, "LastSnoozeGroups");
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);

  let tempObj;
  let snoozeObj;

  const channelDropdown = useCallback(
    async (value, item) => {
      console.log(item, "item");
      if (value?.key === "PIN Channel") {
        tempObj = item;
        tempObj.isPinned = true;
        console.log(tempObj, "tempObj");
        try {
          const firestore = firebase.firestore();
          const collectionRef = firestore.collection("channels");
          const snapshot = collectionRef.doc(tempObj.id);

          await snapshot.set(tempObj);

          const dataArray = snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setDataNew(dataArray);
          setTempArr(dataArray);
          LastPinnedGroups();
        } catch (error) {
          console.error(error);
        }
      } else if (value?.key === "Snooze") {
        snoozeObj = item;
        snoozeObj.isSnoozed = true;
        console.log(snoozeObj, "snoozeObj");
        try {
          const firestore = firebase.firestore();
          const collectionRef = firestore.collection("channels");
          const snapshot = collectionRef.doc(snoozeObj.id);

          await snapshot.set(snoozeObj);

          const dataArray = snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setDataNew(dataArray);
          setTempArr(dataArray);
          // LastPinnedGroups();
          LastSnoozeGroups();
        } catch (error) {
          console.error(error);
        }
      }
    },
    [LastPinnedGroups, LastSnoozeGroups]
  );

  const items = [
    {
      label: ChannelMenu.PIN_CHANNEL,
      key: ChannelMenu.PIN_CHANNEL,
      icon: <PinSVG />,
    },
    {
      label: ChannelMenu.VIEW_HR_DETAILS,
      key: ChannelMenu.VIEW_HR_DETAILS,
      icon: <ViewHRDetailsSVG />,
    },
    {
      label: ChannelMenu.CHANNEL_LIBRARY,
      key: ChannelMenu.CHANNEL_LIBRARY,
      icon: <ChannelLibrarySVG />,
    },
    {
      label: ChannelMenu.SNOOZE,
      key: ChannelMenu.SNOOZE,
      icon: <SnoozeSVG />,
    },
    {
      label: ChannelMenu.LEAVE,
      key: ChannelMenu.LEAVE,
      icon: <LeaveSVG />,
    },
  ];

  const filterData = data?.filter((item) => {
      return item?.isPinned === false && item?.isSnoozed === false;
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
                    items: items,
                    onClick: (value) => {
                      channelDropdown(value, item);
                    },
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
