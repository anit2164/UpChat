import React, { useEffect, useRef, useState } from "react";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import IconSVG from "../../assets/images/svg/logo.svg";

import "firebase/compat/firestore";
import "firebase/compat/storage";
import faviIcon from "../../assets/svg/favicon.svg";
import { limits } from "../../constants/constantLimit";

const Notifications = () => {
  firebase.initializeApp(firebaseConfig);

  const firestore = firebase.firestore();
  const [data, setData] = useState([]);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const prevTotalCountRef = useRef(0);
  const [notificationData, setNotificationData] = useState([]);
  const [favicon, setFavicon] = useState(null);
  const [notificationFavicon, setNotificationFavicon] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [readCount, setReadCount] = useState([]);
  const dataPerPage: any = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [updatePinnedChannel, setPinnedChannel] = useState(false);
  const [updateSoonzeChannel, setSoonzeChannel] = useState(false);

  const loginUserId = localStorage.getItem("EmployeeID");

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

  useEffect(() => {
    let tempArrPin: any = [];
    let tempArrUnPin: any = [];
    const unsubscribe = firestore
      .collectionGroup(`user`)
      .where("userEmpId", "==", loginUserId)
      .limit(limits.pageSize)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          const user = doc.data();
          if (user.isPinned) {
            tempArrPin.push(user?.channelID.toString());
            tempInfoData(user?.channelID.toString());
          } else {
            tempArrUnPin.push(user?.channelID.toString());
            tempInfo(user?.channelID.toString());
          }
        });
        // getPinData(tempArrPin);
        // setUnpinData(tempArrUnPin);
        // setTotalPages(Math.ceil(tempArrUnPin.length / dataPerPage));
        // getUnpinData(tempArrUnPin, currentPage);
      });

    return () => unsubscribe();
  }, [updatePinnedChannel, updateSoonzeChannel, currentPage]);

  let tempCount: any = [];
  const tempInfo = async (data: any) => {
    let countArr: any = {};
    // const firestore = firebase.firestore();
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
        tempCount.push(countArr);
        setReadCount(tempCount);
      });
  };

  useEffect(() => {
    const unreadCountData: any = localStorage.getItem("unreadCount");
    const prevUnreadCounts = JSON.parse(unreadCountData) || {};
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
      if (index < data.length) {
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification(data[index]?.companyName, {
              body: "Notification Message",
              icon: IconSVG,
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification(data[index]?.companyName, {
                  body: "Notification Message",
                  icon: IconSVG,
                });
              }
            });
          }
          // addNotification({
          //   title: data[index]?.companyName,
          //   message: "New Notification",
          //   theme: "darkblue",
          //   native: true,
          //   icon: data[index]?.companyInitial,
          // });
          sendNotificationsSequentially(data, index + 1);
        }, 1000);
      }
    };
    const uniqueHrNumbers = new Set();
    let groupInfoData: any = localStorage.getItem("groupInfo");
    let getDataGroup = JSON.parse(groupInfoData);
    if (notificationData.length > 0) {
      const uniqueData = notificationData.filter((item: any) => {
        if (
          !uniqueHrNumbers.has(item.hrNumber) &&
          getDataGroup.hrNumber !== item.hrNumber
        ) {
          uniqueHrNumbers.add(item.hrNumber);
          return true;
        }
        return false;
      });

      sendNotificationsSequentially(uniqueData, 0);
    }
  }, [notificationData]);
};

export default Notifications;
