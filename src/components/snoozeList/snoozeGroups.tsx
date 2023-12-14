import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, Space } from "antd";
import SnoozeGroupsStyle from "./snoozeGroups.module.css";
// import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import ViewHRDetailsSVG from "../../assets/svg/viewHrDetails.svg";

import PinSVG from "../../assets/svg/pin.svg";
import ChannelLibrarySVG from "../../assets/svg/channelLibrary.svg";
import LeaveSVG from "../../assets/svg/leave.svg";
import SnoozeSVG from "../../assets/svg/snooze.svg";
import MoveToActiveSVG from "../../assets/svg/moveToActive.svg";
import { ChannelMenu } from "../../constants/application";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import ChatListing from "../chat-list/chatListing";
import { NetworkInfo } from "../../constants/network";
// import moment from "moment";

firebase.initializeApp(firebaseConfig);

const SnoozeGroupDetails = ({ data, LastSnoozeGroups, setData }: any) => {
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [activeUser, setActiveUser] = useState(false);
  const [showSnoozeChatsList, setShowSnoozeChatsList] = useState(false);
  const [listingChats, setListingChats] = useState([]);
  const [allChannelItem, setAllChannelItem] = useState<any>();
  const [updateData, setUpdateData] = useState([]);

  const items = [
    {
      label: ChannelMenu.VIEW_HR_DETAILS,
      key: ChannelMenu.VIEW_HR_DETAILS,
      icon: <ViewHRDetailsSVG />,
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

  useEffect(() => {
    const filterData = data?.filter((item: any) => {
      return item?.isSnoozed === true;
    });
    let filterDataNew = filterData?.map((val: any) => {
      return { ...val, color: getRandomColor() };
    });
    setUpdateData(filterDataNew);
  }, [data]);

  updateData?.sort(
    (a: any, b: any) =>
      // moment(new Date(b?.lastMessageTime).toLocaleTimeString(), "hh:mm") -
      // moment(new Date(a?.lastMessageTime).toLocaleTimeString(), "hh:mm")
      b?.lastMessageTime - a?.lastMessageTime
  );

  let moveToActiveObj;

  const channelDropdown = useCallback(
    async ({ value, item }: any) => {
      if (value?.key === "Move To Active") {
        moveToActiveObj = item;
        moveToActiveObj.isSnoozed = false;
        try {
          const firestore = firebase.firestore();
          const collectionRef = firestore.collection("channels");
          const snapshot: any = collectionRef.doc(moveToActiveObj.id);

          await snapshot.set(moveToActiveObj);

          const dataArray = snapshot?.docs?.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setDataNew(dataArray);
          setTempArr(dataArray);
          LastSnoozeGroups();
        } catch (error) {
          console.error(error);
        }
      } else if (value?.key === "View HR Detail Page") {
        window.open(
          `http://${NetworkInfo.VIEWHRDOMIN}/allhiringrequest/${item?.hrID}`,
          "_blank"
        );
      }
    },
    [LastSnoozeGroups]
  );

  const snoozeChatsDetails = (item: any) => {
    if (item?.id !== allChannelItem?.id) {
      setActiveUser(true);
      setAllChannelItem(item);
      setShowSnoozeChatsList(true);
      try {
        const firestore = firebase.firestore();
        const unsubscribe = firestore
          .collection(`ChannelChatsMapping/${item?.id}/chats`)
          .orderBy("date", "asc")
          .onSnapshot((snapshot) => {
            const messagesData: any = snapshot.docs.map((doc) => doc.data());
            setListingChats(messagesData);
          });
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateChannel = async (date: any) => {
    allChannelItem.lastMessageTime = date;
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection("channels");
      const snapshot = collectionRef.doc(allChannelItem.id);
      await snapshot.set(allChannelItem);
      let _data = await collectionRef.get();
      const dataArray = _data?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataArray);
    } catch (error) {
      console.error(error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      SnoozeGroupsStyle.blueThumb,
      SnoozeGroupsStyle.darkRedThumb,
      SnoozeGroupsStyle.greenThumb,
      SnoozeGroupsStyle.yellowThumb,
      SnoozeGroupsStyle.orangeThumb,
      SnoozeGroupsStyle.skyBlueThumb,
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <>
      <div className={SnoozeGroupsStyle.chatWrapper}>
        {updateData?.map((item: any) => {
          return (
            <div className={`${SnoozeGroupsStyle.chatItem}`}>
              <div
                className={SnoozeGroupsStyle.dFlex}
                onClick={() => snoozeChatsDetails(item)}
              >
                <div
                  className={` ${SnoozeGroupsStyle.chatInitialThumb} ${item?.color} `}
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
                <div className={SnoozeGroupsStyle.timeStamp}>
                  {new Date(item?.lastMessageTime * 1000)
                    .toLocaleTimeString()
                    .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
                </div>
                {/* <div className={SnoozeGroupsStyle.unreadNum}>5</div> */}
                <Dropdown
                  className={SnoozeGroupsStyle.dotMenuMain}
                  menu={{
                    items,
                    onClick: (value: any) => {
                      channelDropdown({ value, item });
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
        {updateData?.length === 0 && (
          <span className={SnoozeGroupsStyle.noDataFound}>No data found</span>
        )}
      </div>
      {showSnoozeChatsList === true && (
        <ChatListing
          snoozeChatsDetails={snoozeChatsDetails}
          showSnoozeChatsList={showSnoozeChatsList}
          listingChats={listingChats}
          allChannelItem={allChannelItem}
          updateChannel={updateChannel}
          setShowSnoozeChatsList={setShowSnoozeChatsList}
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          setAllChannelItem={setAllChannelItem}
        />
      )}
    </>
  );
};

export default SnoozeGroupDetails;
