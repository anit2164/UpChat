import { useState, useEffect, useCallback } from "react";
import { Dropdown, Space } from "antd";
import PinChatDetailsStyle from "./pinChatsDetails.module.css";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
import { ReactComponent as ViewHRDetailsSVG } from "@SVG/viewHrDetails.svg";
import { ChannelMenu } from "@/constants/application";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import ChatListing from "../chat-list/chatListing";

firebase.initializeApp(firebaseConfig);

const PinChatDetails = ({ dataFalse, LastPinnedGroups, setDataFalse }) => {
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [activeUser, setActiveUser] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [showPinnedChatsList, setShowPinnedChatsList] = useState(false);
  const [listingChats, setListingChats] = useState([]);
  const [pinnedChatsItem, setPinnedChatsItem] = useState();

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
      label: ChannelMenu.LEAVE,
      key: ChannelMenu.LEAVE,
      icon: <LeaveSVG />,
    },
  ];
  useEffect(() => {
    // const filterData = dataFalse?.filter((item) => {
    //   return item?.isPinned === true;
    // });
    let filterDataNew = dataFalse?.map((val) => {
      return { ...val, color: getRandomColor() };
    });
    setUpdateData(filterDataNew);
  }, [dataFalse]);

  updateData?.sort(
    (a, b) =>
      // moment(new Date(b?.lastMessageTime).toLocaleTimeString(), "hh:mm") -
      // moment(new Date(a?.lastMessageTime).toLocaleTimeString(), "hh:mm")
      b?.lastMessageTime - a?.lastMessageTime
  );

  let tempObj;

  const channelDropdown = useCallback(async (value, item) => {
    tempObj = item;
    tempObj.isPinned = false;
    if (value?.key === "Unpin Channel") {
      try {
        // const firestore = firebase.firestore();
        // const collectionRef = firestore.collection("channels");
        // const snapshot = collectionRef.doc(tempObj.id);

        // await snapshot.set(tempObj);

        // const dataArray = snapshot?.docs?.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));
        const firestore = firebase.firestore();
        const collectionRef = firestore.collection("ChannelUserMapping").doc(item?.enc_channelID).collection("user").get().then((querySnapshot )=>{
          querySnapshot.forEach((doc) => {
            const user = doc.data();
            user.isPinned = false;
            doc.ref.set(user)
          });
        })

        // setDataNew(dataArray);
        // setTempArr(dataArray);
        LastPinnedGroups();
      } catch (error) {
        console.error(error);
      }
    } else if (value?.key === "View HR Detail Page") {
      window.open(
        `http://3.218.6.134:9093/allhiringrequest/${item?.hrID}`,
        "_blank"
      );
    }
  }, []);

  const pinnedChatsDetails = (item) => {
    if (item?.enc_channelID !== pinnedChatsItem?.enc_channelID) {
      setActiveUser(true);
      setPinnedChatsItem(item);
      setShowPinnedChatsList(true);
      try {
        const firestore = firebase.firestore();
        const unsubscribe = firestore
          .collection(`ChannelChatsMapping/${item?.enc_channelID}/chats`)
          .orderBy("date", "asc")
          .onSnapshot((snapshot) => {
            const messagesData = snapshot.docs.map((doc) => doc.data());
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

  // const updateChannel = async (date) => {
  //   pinnedChatsItem.lastMessageTime = date;
  //   try {
  //     const firestore = firebase.firestore();
  //     const collectionRef = firestore.collection("channels");
  //     const snapshot = collectionRef.doc(pinnedChatsItem.enc_channelID);
  //     await snapshot.set(pinnedChatsItem);
  //     let _data = await collectionRef.get();
  //     const dataArray = _data?.docs?.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     // setDataFalse(dataArray);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const updateChannelDateTime = async (enc_channelID) => {
    pinnedChatsItem.lastMessageTime = new Date();
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection("channels");
      const snapshot = collectionRef.doc(enc_channelID);
      await snapshot.set(pinnedChatsItem);
      let _data = await collectionRef.get();
      const dataArray = _data?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataFalse(dataArray);
    } catch (error) {
      console.error(error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      PinChatDetailsStyle.blueThumb,
      PinChatDetailsStyle.darkRedThumb,
      PinChatDetailsStyle.greenThumb,
      PinChatDetailsStyle.yellowThumb,
      PinChatDetailsStyle.orangeThumb,
      PinChatDetailsStyle.skyBlueThumb,
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };



  return (
    <>
      <div className={PinChatDetailsStyle.chatWrapper}>
        {updateData?.map((item) => {
          return (
            <div
              className={`${PinChatDetailsStyle.chatItem} ${PinChatDetailsStyle.unreadMsg}`}
            >
              <div
                className={PinChatDetailsStyle.dFlex}
                onClick={() => pinnedChatsDetails(item)}
              >
                <div
                  className={` ${PinChatDetailsStyle.chatInitialThumb} ${item?.color} `}
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
                <div className={PinChatDetailsStyle.timeStamp}>
                  {new Date(item?.lastMessageTime * 1000)
                    .toLocaleTimeString()
                    .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
                </div>
                {/* <div className={PinChatDetailsStyle.unreadNum}>5</div> */}
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
        {updateData?.length === 0 && (
          <span className={PinChatDetailsStyle.noDataFound}>No data found</span>
        )}
      </div>
      {showPinnedChatsList === true && (
        <ChatListing
          pinnedChatsDetails={pinnedChatsDetails}
          showPinnedChatsList={showPinnedChatsList}
          listingChats={listingChats}
          allChannelItem={pinnedChatsItem}
          // updateChannel={updateChannel}
          setShowPinnedChatsList={setShowPinnedChatsList}
          activeUser={activeUser}
          setPinnedChatsItem={setPinnedChatsItem}
          setActiveUser={setActiveUser}
          updateChannelDateTime={updateChannelDateTime}
        />
      )}
    </>
  );
};

export default PinChatDetails;
