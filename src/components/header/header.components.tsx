import React, { useEffect, useState, useContext } from "react";
import ArrowDownSVG from "../../assets/svg/arrowDown.svg";
import HeaderStyle from "./header.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firebaseConfig from "../../firebase";
import MyContext from "../chat-list/myContext";
import { limits } from "../../constants/constantLimit";

firebase.initializeApp(firebaseConfig);

const Header = ({ setToggle, showUpChat, setShowUpChat }: any) => {
  const [data, setData] = useState([]);
  const [useName, setUsername] = useState("");
  const { totalCount, totalCountPinned }: any = useContext(MyContext);
  const firestore = firebase.firestore();
  const [unreadCounts, setUnreadCounts] = useState<any>({});
  const [count, setCount] = useState(0);
  const [readCountTrue, setReadCountTrue] = useState([]);
  let tempCountData: any = [];

  // useEffect(() => {
  //   // Retrive Data
  //   const fetchData = async () => {
  //     try {
  //       const firestore = firebase.firestore();
  //       const collectionRef = firestore.collection("channels");
  //       const snapshot = await collectionRef.get();

  //       const dataArray: any = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       setData(dataArray);
  //     } catch (error: any) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  const loginUserId = localStorage.getItem("EmployeeID");

  const tempInfoData = async (data: any) => {
    let countArr: any = {};
    const readOrUnread = firestore.collectionGroup("user_chats");
    readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)
      .limit(limits.pageSize)
      .onSnapshot((snapshot: any) => {
        const unreadCount = snapshot.docs.length;

        setUnreadCounts((prevCounts: any) => ({
          ...prevCounts,
          [data]: unreadCount,
        }));
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCountData.push(countArr);
        setReadCountTrue(tempCountData);
      });
  };

  const getData: any = (tempArr: any) => {
    // const collectionRef = firestore.collection("channels");
    // if (tempArr?.length > 0) {
    //   const batch = tempArr.splice(0, 30);
    //   collectionRef
    //     .where("enc_channelID", "in", batch)
    //     .limit(limits.pageSize)
    //     .onSnapshot((querySnapshot: any) => {
    //       const mergedResults: any = [];
    //       querySnapshot.forEach((doc: any) => {
    //         const channelData = doc.data();
    //         channelData.unreadCount =
    //           unreadCounts[channelData.enc_channelID] || 0;
    //         mergedResults.push(channelData);
    //       });

    //       setData(mergedResults);
    //     });
    // }
    const collectionRef = firestore.collection("channels");
    if (tempArr?.length > 0) {
        const batch = tempArr.splice(0, 30);
        collectionRef
            .where("enc_channelID", "in", batch)
            .limit(limits.pageSize)
            .onSnapshot((querySnapshot:any) => {

                const mergedResults:any = [];
                querySnapshot.forEach((doc:any) => {
                    const channelData = doc.data();
                    channelData.unreadCount = unreadCounts[channelData.enc_channelID] || 0;
                    mergedResults.push(channelData);
                });
                setData(mergedResults);
            });
    }
  };
  // useEffect(() => {
  //   let result: any = [];

  //   data?.map((item: any) => {
  //     const data2: any = readCountTrue.find(
  //       (temp: any) => item.enc_channelID === temp.enc_ChannelIDCount
  //     );

  //     setTimeout(() => {
  //       if (data2) {
  //         item.readCount = data2.readCount;
  //       }
  //       result.push(item);
  //     });
  //   }, 500);
  //   const scrollDown = localStorage.getItem("scrollDown");
  //   if (scrollDown == "false" || scrollDown == "null") {

  //     setTimeout(() => {
  //       const totalReadCount = result.reduce(
  //         (total: any, item: any) => total + item.readCount,
  //         0
  //       );

  //       setCount(totalReadCount);
  //     }, 600);
  //   } else {
  //     setCount(0);
  //   }
  //   // setUpdateData(result);
  //   // setData(data);
  // }, [data, readCountTrue, unreadCounts]);

  useEffect(() => {
    let totalCount = 0;

    Object.entries(unreadCounts).map(([key, value]:any) => {
        totalCount += value
    })
    setCount(totalCount)

}, [data, readCountTrue, unreadCounts]);

  useEffect(() => {
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

        // getData(tempArr);
        setTimeout(getData(tempArr), 60000);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loggedInData = JSON.parse(
      localStorage.getItem("userSessionInfo") || "{}"
    );
    setUsername(loggedInData?.FullName);
  }, []);



  return (

    <div className={HeaderStyle.container} onClick={() => { setToggle(false); setShowUpChat(!showUpChat); }}>
      <div className={HeaderStyle.containerBody}>
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          className={HeaderStyle.avatar}
          alt="avatar"
          style={{
            cursor: "pointer",
          }}
        />
        <div className={HeaderStyle.title}>{useName}</div>
      </div>
      <div className={HeaderStyle.titleRight}>
        {!isNaN(count) && count !== 0 && (
          <span className={HeaderStyle.unreadNum}>{count}</span>
        )}
        <ArrowDownSVG />
      </div>
    </div>
  );
};

export default Header;
