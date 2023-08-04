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
  const [tempArrFalse, setTempArrFalse] = useState([]);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const loginUserId = localStorage.getItem("EmployeeID");

  let tempCountData = [];
  let resetCount;
  let lastDocument;
  let pageSize = 10;

  const tempInfoData = async (data) => {
    let countArr = {};
    const firestore = firebase.firestore();
    const readOrUnread = firestore.collectionGroup("user_chats");
    const query = readOrUnread
      .where("isRead", "==", true)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)
      .onSnapshot((snapshot) => {
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCountData.push(countArr);
        setReadCountTrue(tempCountData);
      });
  };

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
    const color = "color";
    for (let i = 0; i < dataFalse.length; i++) {
      dataFalse[i][color] = getRandomColor();
    }
    setUpdateData(dataFalse);
  }, [dataFalse]);

  updateData?.sort((a, b) => b?.lastMessageTime - a?.lastMessageTime);

  // let tempObj;

  const channelDropdown = useCallback(async (value, item) => {
    // tempObj = item;
    // tempObj.isPinned = false;
    if (value?.key === "Unpin Channel") {
      try {
        const firestore = firebase.firestore();
        const collectionRef = firestore
          .collection("ChannelUserMapping")
          .doc(item?.enc_channelID)
          .collection("user")
          .where("userEmpId", "==", loginUserId)
          .limit(pageSize)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const user = doc.data();
              user.isPinned = false;
              doc.ref.set(user);
            });
          });
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

  const pinnedChatsDetails = async (item) => {
    if (item?.enc_channelID !== pinnedChatsItem?.enc_channelID) {
      resetCount = item;
      resetCount.readCount = 0;
      setActiveUser(true);
      setPinnedChatsItem(item);
      setShowPinnedChatsList(true);
      try {
        const firestore = firebase.firestore();
        let reduceFirebaseCall = [];
        const unsubscribe = firestore
          .collection(`ChannelChatsMapping/${item?.enc_channelID}/chats`)
          .orderBy("date", "asc")
          .onSnapshot((snapshot) => {
            const messagesData = snapshot.docs.map((doc) => doc.data());
            setListingChats(messagesData);
            reduceFirebaseCall = snapshot;
          });
        // Reduce firebase call
        if (reduceFirebaseCall?.docs?.length > 0) {
          lastDocument =
            reduceFirebaseCall?.docs[reduceFirebaseCall?.docs?.length - 1];
        }
        const userChats = firestore
          .collectionGroup("user_chats")
          .where("userEmpID", "==", loginUserId)
          .where("enc_channelID", "==", item?.enc_channelID);

        const tempUserchats = await userChats.get();
        const dataArray = tempUserchats?.docs?.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (let i = 0; i < dataArray.length; i++) {
          let tempObj = dataArray[i];
          tempObj.isRead = true;

          const querySnapshot = await firestore
            .collectionGroup("user_chats")
            .where("userEmpID", "==", loginUserId)
            .where("enc_channelID", "==", item?.enc_channelID)
            .limit(pageSize)
            .get();
          querySnapshot.docs.forEach((snapshot) => {
            snapshot.ref.update(tempObj);
          });
          // setUpdateData(resetCount);
        }

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateChannelDateTime = (enc_channelID) => {
    try {
      const firestore = firebase.firestore();
      let tempArr = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", loginUserId)
        .where("isPinned", "==", true)
        .limit(pageSize)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const user = doc.data();
            tempArr.push(user?.channelID.toString());
          });
          for (let i = 0; i < tempArr.length; i++) {
            tempInfoData(tempArr[i]);
          }
          // channelIdData(tempArr);
          const collectionRef = firestore.collection("channels");
          const queryPromises = [];
          pinnedChatsItem.lastMessageTime = new Date();
          while (tempArr?.length > 0) {
            const batch = tempArr?.splice(0, 30);
            const data = collectionRef.doc(enc_channelID);
            data.set(pinnedChatsItem);
            const query = collectionRef
              .where("enc_channelID", "in", batch)
              .limit(pageSize)
              .get();
            queryPromises.push(query);
          }

          Promise.all(queryPromises)
            .then((querySnapshots) => {
              const mergedResults = [];
              querySnapshots.forEach((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  mergedResults.push(doc.data());
                });
              });
              setDataFalse(mergedResults);
              setTempArr(mergedResults);
            })
            .catch((error) => {
              console.error(error);
            });
        });
    } catch (error) {
      console.error(error, "errororo");
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
              onClick={() => pinnedChatsDetails(item)}
            >
              <div className={PinChatDetailsStyle.dFlex}>
                <div
                  className={` ${PinChatDetailsStyle.chatInitialThumb} ${item?.color} `}
                >
                  {item?.companyInitial}
                </div>
                <div className={PinChatDetailsStyle.chatGroupDetails}>
                  <div className={PinChatDetailsStyle.channelName}>
                    {item?.companyName} |{" "}
                    {item.role.length > 27
                      ? `${item.role.substring(0, 27)}...`
                      : item.role}
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
                {item?.readCount !== 0 && (
                  <div className={PinChatDetailsStyle.unreadNum}>
                    {item?.readCount}
                  </div>
                )}
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
