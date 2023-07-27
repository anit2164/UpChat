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
  readCount,
  channelIdData
}) => {
  const [dataNew, setDataNew] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [activeUser, setActiveUser] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [showChat, setShowList] = useState(false);
  const [listingChats, setListingChats] = useState([]);
  const [allChannelItem, setAllChannelItem] = useState();
  const [counting, setCounting] = useState("");

  let tempObj;
  let snoozeObj;

  console.log(data,"data");
  

  const channelDropdown = useCallback(async (value, item) => {
    if (value?.key === "PIN Channel") {
      // tempObj = item;
      // tempObj.isPinned = true;
      try {
        const firestore = firebase.firestore();
        const collectionRef = firestore
          .collection("ChannelUserMapping")
          .doc(item?.enc_channelID)
          .collection("user")
          .limit(10)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const user = doc.data();
              user.isPinned = true;
              doc.ref.set(user);
            });
          });

        // await querySnapshot.set(tempObj);
        // console.log(snapshot,"snapshot");

        // const dataArray = collectionRef?.docs?.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));

        // setDataNew(dataArray);
        // setTempArr(dataArray);
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
    // const filterData = data?.filter((item) => {
    //   return item?.isPinned === false;
    // });
    const color = "color";
    for (let i = 0; i < data.length; i++) {
      data[i][color] = getRandomColor();
    }
    setUpdateData(data);
  }, [data]);

  updateData?.sort(
    (a, b) =>
      // moment(new Date(b?.lastMessageTime).toLocaleTimeString(), "hh:mm") -
      // moment(new Date(a?.lastMessageTime).toLocaleTimeString(), "hh:mm")
      b?.lastMessageTime - a?.lastMessageTime
  );

  const showChatList = async (item) => {
    if (item?.enc_channelID !== allChannelItem?.enc_channelID) {
      setActiveUser(true);
      setAllChannelItem(item);
      setShowList(true);
      try {
        const firestore = firebase.firestore();
        const unsubscribe = firestore
          .collection(`ChannelChatsMapping/${item?.enc_channelID}/chats`)
          .orderBy("date", "asc")
          .onSnapshot((snapshot) => {
            const messagesData = snapshot.docs.map((doc) => doc.data());
            setListingChats(messagesData);
          });

        const userChats = firestore
          .collectionGroup("user_chats")
          .where("userEmpID", "==", "ChatUser_Anit")
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
            .where("userEmpID", "==", "ChatUser_Anit")
            .where("enc_channelID", "==", item?.enc_channelID)
            .limit(10)
            .get();
          querySnapshot.docs.forEach((snapshot) => {
            snapshot.ref.update(tempObj);
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

  // const updateChannel = async (date) => {
  //   allChannelItem.lastMessageTime = date;
  //   try {
  //     const firestore = firebase.firestore();
  //     const collectionRef = firestore.collection("channels");
  //     const snapshot = collectionRef.doc(allChannelItem.id);
  //     await snapshot.set(allChannelItem);
  //     let _data = await collectionRef.get();
  //     const dataArray = _data?.docs?.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setData(dataArray);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const updateChannelDateTime = async (enc_channelID) => {
    allChannelItem.lastMessageTime = new Date();
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection("channels");
      const snapshot = collectionRef.doc(enc_channelID);
      await snapshot.set(allChannelItem);
      let _data = await collectionRef.limit(10).get();
      const dataArray = _data?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataArray);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {

  //   try {
  //     const firestore = firebase.firestore();
  //     const unsubscribe = firestore
  //       .collection(`ChannelUserMapping/
  //       0EA007f0V3pfTN6Th6GB/user`).get()
  //       .then((snapshot) => {
  //         console.log(snapshot,"snapshot")
  //       //  snapshot.forEach((doc) => {
  //       //   console.log(doc,"docccc")
  //       //     const user = doc.data();
  //       //     console.log(user,"USER12345");
  //       //   });
  //       });

  //   } catch (error) {
  //     console.error(error,"errororo");
  //   }
  // }, []);

  // const tempID = async() =>{

  //   const firestore = firebase.firestore();
  //   // const readOrUnread = firestore.collection("user_chats").where("isRead","==",false).where("enc_channelID","==","0RX4qTqAQRGnZEeZF83p").where("userEmpID","==","ChatUser_Himani").get();
  //   const readOrUnread = firestore.collectionGroup("user_chats")
  //   const query =  readOrUnread.where("isRead","==",false).where("enc_channelID","==","dJUuo4xXKcQYc3hFcTET").where("userEmpID","==","up1322")
  //   const snapshot = await query.get();
  //   console.log(snapshot?.docs?.length,"snapshot");
  // }

  //   useEffect(()=>{
  //     tempID()
  //   },[])
  // const count = async (data) =>{
  //   console.log(data,"data")
  //   const firestore = firebase.firestore();
  //   const readOrUnread = firestore.collectionGroup("user_chats")
  //       const query =  readOrUnread.where("isRead","==",false).where("enc_channelID","==",data).where("userEmpID","==","up1322")
  //       const snapshot1 = await query.get();
  //       console.log(snapshot1,"snapshot1?.docs?.length")
  //   return 2
  // }

  return (
    <>
      <div className={TileStyle.chatWrapper}>
        {updateData?.map((item) => {
          return (
            <div className={`${TileStyle.chatItem} ${item?.readCount!==0 ? TileStyle.unreadMsgTile :"" }`}>
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
                {item?.readCount !== 0  && (
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
          // updateChannel={updateChannel}
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
