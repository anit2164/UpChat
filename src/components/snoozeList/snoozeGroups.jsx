import { useState, useEffect, useCallback } from "react";
import { Dropdown, Space } from "antd";
import SnoozeGroupsStyle from "./snoozeGroups.module.css";
// import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as ViewHRDetailsSVG } from "@SVG/viewHrDetails.svg";

import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
import { ReactComponent as SnoozeSVG } from "@SVG/snooze.svg";
import { ReactComponent as MoveToActiveSVG } from "@SVG/moveToActive.svg";
import { ChannelMenu } from "@/constants/application";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import ChatListing from "../chat-list/chatListing";

firebase.initializeApp(firebaseConfig);

const SnoozeGroupDetails = ({ data, LastSnoozeGroups }) => {
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const items = [
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
      label: ChannelMenu.MOVE_TO_ACTIVE,
      key: ChannelMenu.MOVE_TO_ACTIVE,
      icon: <MoveToActiveSVG />,
    },
    {
      label: ChannelMenu.LEAVE,
      key: ChannelMenu.LEAVE,
      icon: <LeaveSVG />,
    },
  ];

  const filterData = data?.filter((item) => {
    return item?.isSnoozed === true;
  });

  let moveToActiveObj;

  const channelDropdown = useCallback(
    async (value, item) => {
      if (value?.key === "Move To Active") {
        moveToActiveObj = item;
        moveToActiveObj.isSnoozed = false;
        try {
          const firestore = firebase.firestore();
          const collectionRef = firestore.collection("channels");
          const snapshot = collectionRef.doc(moveToActiveObj.id);

          await snapshot.set(moveToActiveObj);

          const dataArray = snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setDataNew(dataArray);
          setTempArr(dataArray);
          LastSnoozeGroups();
        } catch (error) {
          console.error(error);
        }
      }
    },
    [LastSnoozeGroups]
  );
  
  const [showSnoozeChatsList, setShowSnoozeChatsList] = useState(false);
  const [listingChats, setListingChats] = useState([]);

  const snoozeChatsDetails = (item) => {
    setShowSnoozeChatsList(true);
    try {
      const firestore = firebase.firestore();
      const unsubscribe = firestore
        .collection(`ChannelChatsMapping/${item?.id}/chats`)
        .onSnapshot((snapshot) => {
          const messagesData = snapshot.docs.map((doc) => doc.data());
          setListingChats(messagesData);
        });

      return () => {
        // Unsubscribe from Firestore snapshot listener when component unmounts
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  };


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
                  onClick={()=>snoozeChatsDetails(item)}
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
                    onClick: (value) => {
                      channelDropdown(value, item);
                    },
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
      {showSnoozeChatsList === true && (
      <ChatListing snoozeChatsDetails={snoozeChatsDetails} showSnoozeChatsList={showSnoozeChatsList} listingChats={listingChats}
      />
      )}
    </>
  );
};

export default SnoozeGroupDetails;
