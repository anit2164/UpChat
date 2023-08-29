import React, { useState, useEffect, useCallback, useContext } from "react";
import { Dropdown, Space } from "antd";
import TileStyle from "./tile.module.css";
import PinSVG from "../../assets/svg/pin.svg";
// import ChannelLibrarySVG from "@SVG/channelLibrary.svg";
import LeaveSVG from "../../assets/svg/leave.svg";
// import SnoozeSVG from "../../assets/svg/snooze.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { ChannelMenu } from "../../constants/application";
import ViewHRDetailsSVG from "../../assets/svg/viewHrDetails.svg";
import ChatListing from "../chat-list/chatListing";
import MyContext from "../chat-list/myContext";
import { limits } from "../../constants/constantLimit"


firebase.initializeApp(firebaseConfig);

const Tile = ({
  search,
  data,
  LastPinnedGroups,
  LastSnoozeGroups,
  setData,
  channelIdData,
  setUpChat,
  upChat
}: any) => {
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [activeUser, setActiveUser] = useState(false);
  const [updateData, setUpdateData] = useState<any>([]);
  const [showChat, setShowList] = useState(false);
  const [listingChats, setListingChats] = useState([]);
  const [allChannelItem, setAllChannelItem] = useState<any>();
  const [readCount, setReadCount] = useState([]);
  const [isReadInfo, setIsReadInfo] = useState({});
  const [loadedCount, setLoadedCount] = useState(0);
  const [showScroll, setShowScroll] = useState(false);
  const [isTileChat, setIsTileChat] = useState(false);

  const firestore = firebase.firestore();

  const { setTotalCount, setPinChat, tileChat, setTileChat }: any = useContext(MyContext);

  updateData?.sort((a: any, b: any) => b?.lastMessageTime - a?.lastMessageTime);

  let tempObj;
  let snoozeObj;
  let lastDocument: any;

  const loginUserId = localStorage.getItem("EmployeeID");

  let tempCount: any = [];
  const tempInfo = async (data: any) => {
    let countArr: any = {};
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

  var sum = 0;

  const channelDropdown = useCallback(async (value: any, item: any) => {
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
            // console.log("Document updated successfully");
          })
          .catch((error) => {
            // console.error("Error updating document:", error);
          });
      } catch (error) {
        console.error(error);
      }
    } else if (value?.key === "Snooze") {
      snoozeObj = item;
      snoozeObj.isSnoozed = true;
      try {
        const collectionRef = firestore.collection("channels");
        const snapshot: any = collectionRef.doc(snoozeObj.id);

        await snapshot.set(snoozeObj);

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
        `http://3.218.6.134:9093/allhiringrequest/${item?.hrID}`,
        "_blank"
      );
    }
  }, []);

  // const channelDropdown = useCallback(async (value: any, item: any) => {
  //   if (value?.key === "PIN Channel") {
  //     try {
  //       // const firestore = firebase.firestore();
  //       const collectionRef = firestore
  //         .collection("ChannelUserMapping")
  //         .doc(item?.enc_channelID)
  //         .collection("user")
  //         .where("userEmpId", "==", loginUserId)
  //         .limit(pageSize)
  //         .onSnapshot((querySnapshot) => {
  //           querySnapshot.forEach((doc) => {
  //             const user = doc.data();
  //             user.isPinned = true;
  //             doc.ref.set(user);
  //           });
  //         });

  //       try {
  //         // const firestore = firebase.firestore();
  //         let tempArr: any = [];
  //         const unsubscribe = firestore
  //           .collectionGroup(`user`)
  //           .where("userEmpId", "==", loginUserId)
  //           .where("isPinned", "==", false)
  //           .limit(pageSize)
  //           .get()
  //           .then((snapshot) => {
  //             snapshot.forEach((doc) => {
  //               const user = doc.data();
  //               tempArr.push(user?.channelID.toString());
  //             });
  //             for (let i = 0; i < tempArr.length; i++) {
  //               tempInfo(tempArr[i]);
  //             }
  //             // channelIdData(tempArr);
  //             const collectionRef = firestore.collection("channels");
  //             const queryPromises = [];

  //             while (tempArr?.length > 0) {
  //               const batch = tempArr?.splice(0, 30);
  //               const query = collectionRef
  //                 .where("enc_channelID", "in", batch)
  //                 .limit(pageSize)
  //                 .get();
  //               queryPromises.push(query);
  //             }

  //             Promise.all(queryPromises)
  //               .then((querySnapshots) => {
  //                 const mergedResults: any = [];
  //                 querySnapshots.forEach((querySnapshot) => {
  //                   querySnapshot.forEach((doc) => {
  //                     mergedResults.push(doc.data());
  //                   });
  //                 });
  //                 setUpdateData(mergedResults);
  //                 setTempArr(mergedResults);
  //               })
  //               .catch((error) => {
  //                 console.error(error);
  //               });
  //           });
  //       } catch (error) {
  //         console.error(error, "errororo");
  //       }

  //       LastPinnedGroups();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else if (value?.key === "Snooze") {
  //     snoozeObj = item;
  //     snoozeObj.isSnoozed = true;
  //     try {
  //       // const firestore = firebase.firestore();
  //       const collectionRef = firestore.collection("channels");
  //       const snapshot: any = collectionRef.doc(snoozeObj.id);

  //       await snapshot.set(snoozeObj);

  //       const dataArray: any = snapshot?.docs?.map((doc: any) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       setDataNew(dataArray);
  //       setTempArr(dataArray);
  //       LastSnoozeGroups();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else if (value?.key === "View HR Detail Page") {
  //     window.open(
  //       `http://3.218.6.134:9093/allhiringrequest/${item?.hrID}`,
  //       "_blank"
  //     );
  //   }
  // }, []);
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
    setTempArr(data);
  }, [data]);

  let resetCount;

  const showChatList = async (item: any) => {
    setUpChat("tilechat");
    setIsTileChat(true);
    setPinChat(false);
    setTileChat(true);

    if (item?.enc_channelID !== allChannelItem?.enc_channelID) {
      resetCount = item;
      resetCount.readCount = 0;
      const clickedChannel = updateData.find(
        (ele: any) => ele.enc_channelID === item.enc_channelID
      );
      for (var i = 0; i < updateData.length; i++) {
        sum += updateData[i]?.readCount;
      }
      setTotalCount(sum);
      setActiveUser(true);
      setAllChannelItem(item);
      setShowList(true);
      try {
        // const firestore = firebase.firestore();
        let reduceFirebaseCall: any = [];
        const unsubscribe = firestore
          .collection(`ChannelChatsMapping/${item?.enc_channelID}/chats`)
          .orderBy("date", "asc")
          .onSnapshot((snapshot) => {
            const messagesData: any = snapshot.docs.map((doc) => doc.data());
            setListingChats(messagesData);
            reduceFirebaseCall = snapshot;
          });

        const isReadCount = firestore
          .collectionGroup("user_chats")
          .where("userEmpID", "==", loginUserId)
          .where("enc_channelID", "==", item?.enc_channelID)
          .get();

        isReadCount.then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const updatedIsReadInfo = { ...isReadInfo, isRead: true };
            setIsReadInfo(updatedIsReadInfo);
          });
        });

        // Reduce firebase call
        if (reduceFirebaseCall.docs.length > 0) {
          lastDocument =
            reduceFirebaseCall.docs[reduceFirebaseCall.docs.length - 1];
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
          let tempObj: any = dataArray[i];
          tempObj.isRead = true;

          firestore
            .collectionGroup("user_chats")
            .where("userEmpID", "==", loginUserId)
            .where("enc_channelID", "==", item?.enc_channelID)
            .limit(limits.pageSize)
            .get()
            .then((querySnapshot) => {
              querySnapshot.docs.forEach((snapshot) => {
                snapshot.ref.update(tempObj);
              });
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

  const updateChannelDateTime = (enc_channelID: any) => {
    try {
      // const firestore = firebase.firestore();
      let tempArr: any = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", loginUserId)
        .where("isPinned", "==", false)
        .limit(limits.pageSize)
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
              .limit(limits.pageSize)
              .get();
            queryPromises.push(query);
          }

          Promise.all(queryPromises)
            .then((querySnapshots) => {
              const mergedResults: any = [];
              querySnapshots.forEach((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  mergedResults.push(doc.data());
                });
              });
              setData(mergedResults);
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

  useEffect(() => {
    for (var i = 0; i < updateData.length; i++) {
      sum += updateData[i]?.readCount;
    }
    setTotalCount(sum);
  }, [updateData]);


  useEffect(() => {
    for (var i = 0; i < updateData.length; i++) {
      sum += updateData[i]?.readCount;
    }
    setTotalCount(sum);
  }, [updateData]);

  useEffect(() => {
    if (showScroll) {
      loadMoreData(data);
    }
  }, [data, showScroll]);

  const loadMoreData = (dataup: any) => {
    setShowScroll(false);
    const newData = dataup.slice(0, loadedCount + 10);

    setUpdateData(newData);
    setLoadedCount(loadedCount + 10);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setShowScroll(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={TileStyle.chatWrapper}>
        {updateData?.map((item: any) => {
          return (
            <div
              className={`${TileStyle.chatItem} ${item?.readCount !== 0 ? TileStyle.unread : ""
                }`}
            >
              <div
                className={TileStyle.dFlex}
                onClick={() => showChatList(item)}
              >
                <div
                  className={` ${TileStyle.chatInitialThumb} ${item?.color} `}
                >
                  {item?.companyInitial}
                </div>
                <div className={TileStyle.chatGroupDetails}>
                  <div className={TileStyle.channelName}>
                    {item?.companyName} |{" "}
                    {item.role.length > 27
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
                {item?.readCount > 0 && (
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
      {tileChat === true && isTileChat === true && (
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
          setUpChat={setUpChat}
          upChat={upChat}
          setIsTileChat={setIsTileChat}
        />
      )}
    </>
  );
};

export default Tile;
