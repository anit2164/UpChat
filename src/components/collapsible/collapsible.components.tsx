import CollapseStyle from "./collapsible.module.css";
import ChatSVG from "../../assets/svg/chat.svg";
import ArrowDownSVG from "../../assets/svg/arrowDown.svg";
import React, { useState, useEffect } from "react";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { limits } from "../../constants/constantLimit";
// firebase.initializeApp(firebaseConfig);

const Collapse = ({ setToggle, toggle, showUpChat, setShowUpChat }: any) => {
  const firestore = firebase.firestore();
  const loginUserId = localStorage.getItem("EmployeeID");
  const [showClass, setShowClass] = useState(true);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const initializeApp = localStorage.getItem("initializeApp");

  if (initializeApp === "true") {
    firebase.initializeApp(firebaseConfig);
  }
  useEffect(() => {

    if (initializeApp === "true") {
      let tempArr: any = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", loginUserId)
        .limit(limits.pageSize)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            const user = doc.data();
            tempArr.push(user?.channelID.toString());
            tempInfoData(user?.channelID.toString());
          });

          getData(tempArr);
        });
      return () => unsubscribe();
    }
  }, [showUpChat]);

  let tempCountData: any = [];
  const tempInfoData = async (data: any) => {
    let countArr: any = {};
    const readOrUnread = firestore.collectionGroup("user_chats");
    readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)
      .limit(limits.pageSize)
      .onSnapshot((snapshot) => {
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCountData.push(countArr);
        setReadCountTrue(tempCountData);
      });
  };
  const getData = (tempArr: any) => {
    const collectionRef = firestore.collection("channels");
    if (tempArr?.length > 0) {
      const batch = tempArr.splice(0, 30);
      collectionRef
        .where("enc_channelID", "in", batch)
        .limit(limits.pageSize)
        .onSnapshot((querySnapshot) => {
          const mergedResults: any = [];
          querySnapshot.forEach((doc) => {
            mergedResults.push(doc.data());
          });
          setData(mergedResults);
        });
    }
  };
  useEffect(() => {
    let result: any = [];

    data?.map((item: any) => {
      const data2: any = readCountTrue.find(
        (temp: any) => item.enc_channelID === temp.enc_ChannelIDCount
      );

      setTimeout(() => {
        if (data2) {
          item.readCount = data2.readCount;
        }
        result.push(item);
      });
    }, 500);

    setTimeout(() => {
      const totalReadCount = result.reduce(
        (total: any, item: any) => total + item.readCount,
        0
      );
      setCount(totalReadCount);
    }, 600);
  }, [data, readCountTrue]);

  return (
    <div
      className={` ${showUpChat ? CollapseStyle.showupChatNone : CollapseStyle.container
        } ${!toggle ? CollapseStyle.toggleClose : ""} `}
      onClick={() => {
        localStorage.setItem("initializeApp", "true");
        localStorage.setItem("scrollDown", "false");

        setToggle(!toggle);
        setShowClass(false);
        setShowUpChat(!showUpChat);
      }}
    >
      {!showUpChat && (
        <>
          <div>
            <ChatSVG />
            {/* <div className={CollapseStyle.label}>Upchat</div> */}
          </div>
          <div className={CollapseStyle.toggleCloseRight}>
            {!isNaN(count) && count !== 0 && (
              <span className={CollapseStyle.unreadNum}>{count}</span>
            )}
            {/* <ArrowDownSVG className={CollapseStyle.fiChevronLeft} /> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Collapse;
