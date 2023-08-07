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
import { forIn } from "lodash";

firebase.initializeApp(firebaseConfig);

const Tile = ({
  search,
  data,
  LastPinnedGroups,
  LastSnoozeGroups,
  setData,
  channelIdData,
}) => {
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [activeUser, setActiveUser] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [showChat, setShowList] = useState(false);
  const [listingChats, setListingChats] = useState([]);
  const [allChannelItem, setAllChannelItem] = useState();
  const [counting, setCounting] = useState("");
  const [readCount, setReadCount] = useState([]);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const loginUserId = localStorage.getItem("EmployeeID");
  const firestore = firebase.firestore();
  updateData?.sort((a, b) => b?.lastMessageTime - a?.lastMessageTime);
  let tempObj;
  let snoozeObj;
  let pageSize = 10;
  let resetCount;
  let lastDocument;

  let tempCount = [];
  const tempInfo = async (data) => {
    let countArr = {};
    // const firestore = firebase.firestore();
    const readOrUnread = firestore.collectionGroup("user_chats");
    const query = readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)
      .onSnapshot((snapshot) => {
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCount.push(countArr);
        setReadCount(tempCount);
      });
  };

  const channelDropdown = useCallback(async (value, item) => {
    if (value?.key === "PIN Channel") {
      try {
        // const collectionRef = firestore
        //   .collection("ChannelUserMapping")
        //   .doc(item?.enc_channelID)
        //   .collection("user")
        //   .where("userEmpId", "==", loginUserId)
        //   .limit(pageSize)
        //   .onSnapshot((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //       const user = doc.data();
        //       user.isPinned = true;
        //       doc.ref.set(user);
        //     });
        //   });
        // listData();
        // LastPinnedGroups();
        // return () => {
        //   collectionRef();
        // };
        const docRef = firestore
          .collection("ChannelUserMapping")
          .doc(item?.enc_channelID)
          .collection("user")
          .where("userEmpId", "==", loginUserId);

        docRef
          .get()
          .then((querySnapshot) => {
            const document = querySnapshot.docs[0];
            if (document) {
              const documentRef = document.ref;
              return documentRef.update({
                isPinned: true,
              });
            }
          })
          .then(() => {
            console.log("Document updated successfully");
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      } catch (error) {
        console.error(error);
      }
    } else if (value?.key === "Snooze") {
      snoozeObj = item;
      snoozeObj.isSnoozed = true;
      try {
        // const firestore = firebase.firestore();
        const collectionRef = firestore.collection("channels");
        const snapshot = collectionRef.doc(snoozeObj.id);

        await snapshot.set(snoozeObj);

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
    } else if (value?.key === "View HR Detail Page") {
      window.open(
        `http://3.218.6.134:9093/allhiringrequest/${item?.hrID}`,
        "_blank"
      );
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

  useEffect(() => {
    const color = "color";
    for (let i = 0; i < data.length; i++) {
      data[i][color] = getRandomColor();
    }
    setUpdateData(data);
  }, [data]);

  const listData = () => {
    try {
      // const firestore = firebase.firestore();
      let tempArr = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", loginUserId)
        .where("isPinned", "==", false)
        .limit(pageSize)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const user = doc.data();
            tempArr.push(user?.channelID.toString());
          });
          for (let i = 0; i < tempArr.length; i++) {
            tempInfo(tempArr[i]);
          }
          // channelIdData(tempArr);
          const collectionRef = firestore.collection("channels");
          const queryPromises = [];

          while (tempArr?.length > 0) {
            const batch = tempArr?.splice(0, 30);
            collectionRef
              .where("enc_channelID", "in", batch)
              .limit(pageSize)
              // .get();
              // queryPromises.push(query);
              .onSnapshot((querySnapshot) => {
                const mergedResults = [];
                querySnapshot.forEach((doc) => {
                  mergedResults.push(doc.data());
                });
                setUpdateData(mergedResults);
                setTempArr(mergedResults);
              });
            // queryPromises.push(unsubscribe)
          }
        });
    } catch (error) {
      console.error(error, "errororo");
    }
  };

  const showChatList = async (item) => {
    if (item?.enc_channelID !== allChannelItem?.enc_channelID) {
      resetCount = item;
      resetCount.readCount = 0;
      setActiveUser(true);
      setAllChannelItem(item);
      setShowList(true);
      try {
        // const firestore = firebase.firestore();
        let reduceFirebaseCall = [];
        console.log("item?.enc_channelID", item?.enc_channelID);
        const unsubscribe = firestore
          .collection(`ChannelChatsMapping/${item?.enc_channelID}/chats`)
          .orderBy("date", "asc")
          .onSnapshot((snapshot) => {
            const messagesData = snapshot.docs.map((doc) => doc.data());
            console.log("messagesData", messagesData);
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

          firestore
            .collectionGroup("user_chats")
            .where("userEmpID", "==", loginUserId)
            .where("enc_channelID", "==", item?.enc_channelID)
            .limit(pageSize)
            .get()
            .then((querySnapshot) => {
              querySnapshot.docs.forEach((snapshot) => {
                snapshot.ref.update(tempObj);
              });
            });
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
      // UP0131
      // const firestore = firebase.firestore();
      let tempArr = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", loginUserId)
        .where("isPinned", "==", false)
        .limit(pageSize)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const user = doc.data();
            tempArr.push(user?.channelID.toString());
          });
          for (let i = 0; i < tempArr.length; i++) {
            tempInfo(tempArr[i]);
          }
          // channelIdData(tempArr);
          const collectionRef = firestore.collection("channels");
          const queryPromises = [];
          allChannelItem.lastMessageTime = new Date();
          while (tempArr?.length > 0) {
            const batch = tempArr?.splice(0, 30);
            const data = collectionRef.doc(enc_channelID);
            data.set(allChannelItem);
            const query = collectionRef
              .where("enc_channelID", "in", batch)
              .limit(10)
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
              setUpdateData(mergedResults);
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

  return (
    <>
      <div className={TileStyle.chatWrapper}>
        {updateData?.map((item) => {
          return (
            <div
              className={`${TileStyle.chatItem} ${
                item?.readCount !== 0 ? TileStyle.unreadMsgTile : ""
              }`}
              onClick={() => showChatList(item)}
            >
              <div className={TileStyle.dFlex}>
                <div
                  className={` ${TileStyle.chatInitialThumb} ${item?.color} `}
                >
                  {item?.companyInitial}
                </div>
                <div className={TileStyle.chatGroupDetails}>
                  <div className={TileStyle.channelName}>
                    {item?.companyName} |{" "}
                    {item?.role?.length > 27
                      ? `${item.role.substring(0, 27)}...`
                      : item.role}
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
                {item?.readCount !== 0 && (
                  <div className={TileStyle.unreadNum}>{item?.readCount}</div>
                )}
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
        {updateData?.length === 0 && (
          <span className={TileStyle.noDataFound}>No data found</span>
        )}
      </div>
      {showChat === true && (
        <ChatListing
          showChatList={showChatList}
          showChat={showChat}
          listingChats={listingChats}
          allChannelItem={allChannelItem}
          setAllChannelItem={setAllChannelItem}
          updateChannelDateTime={updateChannelDateTime}
          setShowList={setShowList}
          activeUser={activeUser}
          setActiveUser={setActiveUser}
        />
      )}
    </>
  );
};

export default Tile;
