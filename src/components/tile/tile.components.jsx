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
import ChatListing from "../chat-list/chatListing";
import moment from "moment/moment";

firebase.initializeApp(firebaseConfig);

const Tile = ({
  search,
  data,
  LastPinnedGroups,
  LastSnoozeGroups,
  setData,
}) => {
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);

  let tempObj;
  let snoozeObj;

  const channelDropdown = useCallback(async (value, item) => {
    if (value?.key === "PIN Channel") {
      tempObj = item;
      tempObj.isPinned = true;
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
  }, []);
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
    // {
    //   label: ChannelMenu.CHANNEL_LIBRARY,
    //   key: ChannelMenu.CHANNEL_LIBRARY,
    //   icon: <ChannelLibrarySVG />,
    // },
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

  filterData.sort(
    (a, b) =>
      moment(
        new Date(b?.lastMessageTime?.seconds * 1000).toLocaleTimeString(),
        "hh:mm"
      ) -
      moment(
        new Date(a?.lastMessageTime?.seconds * 1000).toLocaleTimeString(),
        "hh:mm"
      )
  );

  const [showChat, setShowList] = useState(false);
  const [listingChats, setListingChats] = useState([]);
  const [allChannelItem, setAllChannelItem] = useState();

  const showChatList = async (item) => {
    setAllChannelItem(item);
    setShowList(true);
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

  const updateChannel = async (date) => {
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
      TileStyle.blueThumb,
      TileStyle.darkRedThumb,
      TileStyle.greenThumb,
      TileStyle.yellowThumb,
      TileStyle.orangeThumb,
      TileStyle.skyBlueThumb,
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <>
      <div className={TileStyle.chatWrapper}>
        {filterData?.map((item) => {
          return (
            <div className={`${TileStyle.chatItem} ${TileStyle.unreadMsg}`}>
              <div
                className={TileStyle.dFlex}
                onClick={() => showChatList(item)}
              >
                <div
                  className={` ${
                    TileStyle.chatInitialThumb
                  } ${getRandomColor()} `}
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
                <div className={TileStyle.timeStamp}>
                  {new Date(item?.lastMessageTime * 1000)
                    .toLocaleTimeString()
                    .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
                </div>
                {/* <div className={TileStyle.unreadNum}>5</div> */}
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
      {showChat === true && (
        <ChatListing
          showChatList={showChatList}
          showChat={showChat}
          listingChats={listingChats}
          allChannelItem={allChannelItem}
          updateChannel={updateChannel}
          setShowList={setShowList}
        />
      )}
    </>
  );
};

export default Tile;
