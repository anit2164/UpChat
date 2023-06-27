import { useState, useEffect, useCallback } from "react";
import { Dropdown, Space } from "antd";
import PinChatDetailsStyle from "./pinChatsDetails.module.css";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
// import { ReactComponent as SnoozeSVG } from "@SVG/snooze.svg";
import { ReactComponent as ViewHRDetailsSVG } from "@SVG/viewHrDetails.svg";
import { ChannelMenu } from "@/constants/application";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import ChatListing from "../chat-list/chatListing";

firebase.initializeApp(firebaseConfig);

const PinChatDetails = ({ data, LastPinnedGroups }) => {
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);

  const items = [
    {
      label: ChannelMenu.UNPIN_CHANNEL,
      key: ChannelMenu.UNPIN_CHANNEL,
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
    // {
    //   label: ChannelMenu.SNOOZE,
    //   key: ChannelMenu.SNOOZE,
    //   icon: <SnoozeSVG />,
    // },
    {
      label: ChannelMenu.LEAVE,
      key: ChannelMenu.LEAVE,
      icon: <LeaveSVG />,
    },
  ];

  const filterData = data?.filter((item) => {
    return item?.isPinned === true;
  });

  let tempObj;

  const channelDropdown = useCallback(async (value, item) => {
    tempObj = item;
    tempObj.isPinned = false;
    if (value?.key === "Unpin Channel") {
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
      console.log("Snooze");
    }
  }, []);

  const [showPinnedChatsList, setShowPinnedChatsList] = useState(false);
  const [listingChats, setListingChats] = useState([]);
  const [pinnedChatsItem, setPinnedChatsItem] = useState();

  const pinnedChatsDetails = (item) => {
    setPinnedChatsItem(item);
    setShowPinnedChatsList(true);
    try {
      const firestore = firebase.firestore();
      const unsubscribe = firestore
        .collection(`ChannelChatsMapping/${item?.id}/chats`)
        .orderBy("date", "asc")
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
      <div className={PinChatDetailsStyle.chatWrapper}>
        {filterData?.map((item) => {
          return (
            <div
              className={`${PinChatDetailsStyle.chatItem} ${PinChatDetailsStyle.unreadMsg}`}
            >
              <div className={PinChatDetailsStyle.dFlex}>
                <div
                  className={` ${PinChatDetailsStyle.chatInitialThumb} ${PinChatDetailsStyle.blueThumb} `}
                  onClick={() => pinnedChatsDetails(item)}
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
                    onClick: (value) => {
                      channelDropdown(value, item);
                    },
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
        {filterData?.length === 0 && (
          <span className={PinChatDetailsStyle.noDataFound}>No data found</span>
        )}
      </div>
      {showPinnedChatsList === true && (
        <ChatListing
          pinnedChatsDetails={pinnedChatsDetails}
          showPinnedChatsList={showPinnedChatsList}
          listingChats={listingChats}
          allChannelItem={pinnedChatsItem}
        />
      )}
    </>
  );
};

export default PinChatDetails;
