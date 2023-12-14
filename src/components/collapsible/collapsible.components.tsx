import CollapseStyle from "./collapsible.module.css";
import ChatSVG from "../../assets/svg/chat.svg";
import ArrowDownSVG from "../../assets/svg/arrowDown.svg";
import React, { useState, useEffect } from "react";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { limits } from "../../constants/constantLimit";
import axios from "axios";
import faviIcon from "../../assets/images/favicon.png";
import icon from "../../assets/images/logo.png";
import { IsUserExistRequest } from "../../services/api";

const Collapse = ({ setToggle, toggle, showUpChat, setShowUpChat }: any) => {
  const loginUserId = localStorage.getItem("EmployeeID");
  const apiKey: any = localStorage.getItem("apiKey");
  const [showClass, setShowClass] = useState(true);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const firestore = firebase.firestore();
  const [count, setCount] = useState(0);
  const [data, setData] = useState<any>([]);
  const [userExist, setUserExist] = useState<any>([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [base64Image, setBase64Image] = useState(null);
  const [favicon, setFavicon] = useState(null);
  const [notificationFavicon, setNotificationFavicon] = useState(null);
  const [notificationData, setNotificationData] = useState([]);

  const initializeApp = localStorage.getItem("initializeApp");
  if (initializeApp === "true") {
    firebase.initializeApp(firebaseConfig);
  }
  useEffect(() => {
    if (userExist === true) {
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

          setTimeout(getData(tempArr), 60000);
        });

      return () => unsubscribe();
    }
  }, [showUpChat, userExist]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await IsUserExistRequest(loginUserId);
        setUserExist(response?.responseBody?.details);
        // setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const readCountFunc = (tempCountData: any) => {
    let result: any = [];
    const uniqueValues: string[] = Array.from(
      new Set(tempCountData.map((item: any) => item))
    );
    uniqueValues?.map((item: any) => {
      const data2: any = tempCountData.find(
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
  };

  let tempCountData: any = [];
  const tempInfoData = async (data: any) => {
    let countArr: any = {};
    const readOrUnread = firestore.collectionGroup("user_chats");
    readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)

      .onSnapshot((snapshot) => {
        const unreadCount = snapshot.docs.length;

        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [data]: unreadCount,
        }));

        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCountData.push(countArr);
        readCountFunc(tempCountData);

        setReadCountTrue(tempCountData);
      });
  };
  const convertImage = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = faviIcon;

      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const context: any = canvas.getContext("2d");

        // Set canvas dimensions to the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        context.drawImage(img, 0, 0);

        // Get the base64-encoded image data
        const dataURL: any = canvas.toDataURL("image/png");
        // Set the base64-encoded image data in state
        setBase64Image(dataURL);

        // Resolve the promise
        resolve(dataURL);
      };
    });
  };

  const createFavicon = () => {
    const faviconElement: any = document.getElementById("favicon");
    if (faviconElement) {
      setFavicon(faviconElement.href);

      const img = new Image();
      img.src = faviconElement.href;
      img.onload = () => {
        const canvas: any = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context: any = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        context.beginPath();
        context.arc(
          img.width - img.width / 5,
          img.height / 5,
          img.width / 5,
          0,
          2 * Math.PI
        );
        context.fillStyle = "#f00000";
        context.fill();
        faviconElement.href = canvas.toDataURL("image/png");
        setNotificationFavicon(canvas.toDataURL("image/png"));
      };
    } else {
      console.error("Favicon element not found");
    }
  };

  useEffect(() => {
    let getUnreadCount: any = localStorage.getItem("unreadCount");
    const prevUnreadCounts = JSON.parse(getUnreadCount) || {};
    let totalCount = 0;
    const mergedResults: any = [];

    // Merge the current unreadCounts with the previous counts from localStorage
    const mergedUnreadCounts = { ...prevUnreadCounts, ...unreadCounts };

    const promises = Object.entries(mergedUnreadCounts).map(([key, value]) => {
      return new Promise((resolve: any, reject) => {
        const hasDifference = value !== (prevUnreadCounts[key] || 0);

        if (hasDifference && value !== 0) {
          const collectionRef = firestore.collection("channels");
          collectionRef
            .where("enc_channelID", "==", key)
            .onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const channelData = doc.data();
                mergedResults.push(channelData);
              });
              resolve();
            });
        } else {
          resolve();
        }
      });
    });

    Promise.all(promises).then(() => {
      setNotificationData(mergedResults);
      localStorage.setItem("unreadCount", JSON.stringify(mergedUnreadCounts));
    });

    // Calculate totalCount
    Object.values(mergedUnreadCounts).forEach((value: any) => {
      totalCount += value;
    });
    if (totalCount > 0) {
      createFavicon();
    } else {
      let faviconData: any = document.getElementById("favicon");
      const newFaviconPromise = convertImage();
      newFaviconPromise.then((newFavicon) => {
        faviconData.href = newFavicon;
      });
    }
  }, [unreadCounts]);

  useEffect(() => {
    const sendNotificationsSequentially = (data: any, index: any) => {
      if (!toggle) {
        if (index < data.length) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification(data[index]?.companyName, {
                body: "Notification Message",
                icon: icon,
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  new Notification(data[index]?.companyName, {
                    body: "Notification Message",
                    icon: icon,
                  });
                }
              });
            }
            sendNotificationsSequentially(data, index + 1);
          }, 1000);
        }
      }
    };
    const uniqueHrNumbers: any = new Set();

    if (notificationData.length > 0) {
      const uniqueData = notificationData.filter((item: any) => {
        if (!uniqueHrNumbers.has(item.hrNumber)) {
          uniqueHrNumbers.add(item.hrNumber);
          return true;
        }
        return false;
      });

      sendNotificationsSequentially(uniqueData, 0);
    }
  }, [notificationData]);
  const getData: any = (tempArr: any) => {
    const collectionRef = firestore.collection("channels");
    if (tempArr?.length > 0) {
      const batch = tempArr.splice(0, 30);
      collectionRef
        .where("enc_channelID", "in", batch)
        .where("isSnoozed", "==", false)
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
  return (
    <div
      className={` ${
        showUpChat ? CollapseStyle.showupChatNone : CollapseStyle.container
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
