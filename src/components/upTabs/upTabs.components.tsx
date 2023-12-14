import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useEffect, useState, useRef } from "react";
import Accordion from "../accordion/accordion.components";
import BriefcaseSVG from "../../assets/svg/briefcase.svg";
import SearchSVG from "../../assets/svg/search.svg";
import PinnedGroupsSVG from "../../assets/svg/pinnedGroups.svg";
import UpTabsStyle from "./upTabs.module.css";
import PinAccordian from "../pinAccordian/pinAccordian";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import SnoozeGroupDetails from "../snoozeList/snoozeGroups";
import { limits } from "../../constants/constantLimit";
import ChatSVG from "../../assets/svg/chat.svg";
import { useContext } from "react";
import { MyContext } from "../chat-list";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import icon from "../../assets/images/logo.png";
// import IconSVG from "../../assets/images/favicon.png";
import faviIcon from "../../assets/images/favicon.png";

firebase.initializeApp(firebaseConfig);

const UpTabs = () => {
  const [search, setSearch] = useState("");
  const [allChannel, setAllChannel] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tempArr, setTempArr] = useState<any>([]);
  const [pinData, setpinData] = useState([]);
  const [unpinData, setUnpinData] = useState([]);
  const [tempArrFalse, setTempArrFalse] = useState([]);
  const [updatePinnedChannel, setPinnedChannel] = useState(false);
  const [updateSoonzeChannel, setSoonzeChannel] = useState(false);
  const [readCount, setReadCount] = useState([]);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const [totalCount, setTotalCount] = useState("");
  const [unReadCount, setUnReadCount] = useState([]);
  const [unReadCountPinned, setUnReadCountPinned] = useState([]);
  const [upChat, setUpChat] = useState("");
  const [localData, setLocalData] = useState<any>({});
  const [scrolling, setScrolling] = useState(false);
  const [resetCount, setResetCount] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notificationData, setNotificationData] = useState([]);
  const [favicon, setFavicon] = useState(null);
  const [notificationFavicon, setNotificationFavicon] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const dataPerPage = 10;
  const loginUserId = localStorage.getItem("EmployeeID");
  const firestore = firebase.firestore();
  const { showUpChat }: any = useContext(MyContext);
  const arrawScroll = useRef(null);

  const LastPinnedGroups = () => {
    setPinnedChannel(true);
  };

  const LastSnoozeGroups = () => {
    setSoonzeChannel(true);
  };

  const isDataAvailableLocally = (pageNo: any) => {
    return localData.hasOwnProperty(pageNo);
  };

  const storeLocalData = (pageNo: any, data: any) => {
    // Update the local state with the data for the given pageNo
    setLocalData({ ...localData, [pageNo]: data });
  };

  const getLocalData = (pageNo: any) => {
    return localData[pageNo] || []; // Return an empty array if data doesn't exist
  };

  // useEffect(() => {
  //   // Retrive Data
  //   const fetchData = async () => {
  //     try {
  //       const firestore = firebase.firestore();
  //       const collectionRef = firestore.collection("channels");
  //       const snapshot = await collectionRef.get();

  //       const dataArray = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setData(dataArray);
  //       setTempArr(dataArray);
  //       setPinnedChannel(false);
  //       setSoonzeChannel(false);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [updatePinnedChannel, updateSoonzeChannel]);

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
  const createFavicon = () => {
    const faviconElement: any = document.getElementById("favicon");
    console.log("faviconElementfaviconElement", faviconElement);
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
  // useEffect(() => {
  //   try {
  //     // UP0131
  //     // const firestore = firebase.firestore();
  //     let tempArr = [];
  //     const unsubscribe = firestore
  //       .collectionGroup(`user`)
  //       .where("userEmpId", "==", loginUserId)
  //       .where("isPinned", "==", false)
  //       .limit(10)
  //       .onSnapshot((snapshot) => {
  //         snapshot.forEach((doc) => {
  //           const user = doc.data();
  //           tempArr.push(user?.channelID.toString());
  //           tempInfo(user?.channelID.toString());
  //         });
  //         // for (let i = 0; i < tempArr.length; i++) {
  //         //   tempInfo(tempArr[i]);
  //         // }
  //         // channelIdData(tempArr);
  //         const collectionRef = firestore.collection("channels");
  //         // const queryPromises = [];
  //         while (tempArr?.length > 0) {
  //           const batch = tempArr?.splice(0, 30);
  //           const query = collectionRef
  //             .where("enc_channelID", "in", batch)
  //             .limit(10);
  //           // .get();
  //           // queryPromises.push(query);
  //           query.onSnapshot((querySnapshot) => {
  //             const mergedResults = [];
  //             querySnapshot.forEach((doc) => {
  //               mergedResults.push(doc.data());
  //               // tempInfo(mergedResults);
  //             });
  //             // mergedResults.map((item)=>{

  //             //   return item.enc_channelID.includes(dataFalse?.[0]?.enc_channelID) && setDataFalse([])
  //             // })

  //             //All channel
  //             setAllChannel(mergedResults);
  //             setUnReadCount(mergedResults);
  //             setTempArr(mergedResults);
  //             setPinnedChannel(false);
  //             setSoonzeChannel(false);
  //           });
  //         }
  //       });
  //     return () => {
  //       unsubscribe();
  //     };
  //   } catch (error) {
  //     console.error(error, "errororo");
  //   }
  // }, [updatePinnedChannel, updateSoonzeChannel]);

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

  // useEffect(() => {
  //   // const firestore = firebase.firestore();
  //   let tempArr = [];

  //   // Subscribe to the collection using onSnapshot
  //   const unsubscribe = firestore
  //     .collectionGroup(`user`)
  //     .where("userEmpId", "==", loginUserId)
  //     .where("isPinned", "==", true)
  //     .limit(10)
  //     .onSnapshot((snapshot) => {
  //       // This callback will be executed whenever there are changes to the query result
  //       tempArr = [];
  //       snapshot.forEach((doc) => {
  //         const user = doc.data();
  //         tempArr.push(user?.channelID.toString());
  //         tempInfoData(user?.channelID.toString());
  //       });

  //       // Call tempInfoData with the latest data
  //       // for (let i = 0; i < tempArr.length; i++) {
  //       //   tempInfoData(tempArr[i]);
  //       // }

  //       const collectionRef = firestore.collection("channels");
  //       const queryPromises = [];

  //       // Similar to before, but now we're using onSnapshot for the individual queries
  //       while (tempArr?.length > 0) {
  //         const batch = tempArr.splice(0, 30);
  //         const query = collectionRef
  //           .where("enc_channelID", "in", batch)
  //           .limit(10)
  //           .onSnapshot((querySnapshot) => {
  //             const mergedResults = [];
  //             querySnapshot.forEach((doc) => {
  //               mergedResults.push(doc.data());
  //             });
  //             //Pin Channel Data
  //             setpinData(mergedResults);
  //             setTempArrFalse(mergedResults);
  //             setPinnedChannel(false);
  //             setSoonzeChannel(false);
  //           });
  //         queryPromises.push(query);
  //       }
  //     });

  //   // The unsubscribe function returned by onSnapshot will be used to clean up the listener
  //   return () => unsubscribe();
  // }, [updatePinnedChannel, updateSoonzeChannel]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      // getUnpinData(tempArr, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      // getUnpinData(tempArr, currentPage + 1);
    }
  };

  // useEffect(() => {
  //   let tempArrPin: any = [];
  //   let tempArrUnPin: any = [];
  //   const unsubscribe = firestore
  //     .collectionGroup(`user`)
  //     .where("userEmpId", "==", loginUserId)
  //     .limit(limits.pageSize)
  //     .onSnapshot((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         const user = doc.data();
  //         if (user.isPinned) {
  //           tempArrPin.push(user?.channelID.toString());
  //           tempInfoData(user?.channelID.toString());
  //         } else {
  //           tempArrUnPin.push(user?.channelID.toString());
  //           tempInfo(user?.channelID.toString());
  //         }
  //       });
  //       getPinData(tempArrPin);
  //       setUnpinData(tempArrUnPin);
  //       // getUnpinData(tempArrUnPin);
  //       setTotalPages(Math.ceil(tempArrUnPin.length / dataPerPage));
  //       getUnpinData(tempArrUnPin, currentPage);
  //     });
  //   return () => unsubscribe();
  // }, [updatePinnedChannel, updateSoonzeChannel, currentPage]);

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
        getPinData(tempArrPin);
        setUnpinData(tempArrUnPin);
        setTotalPages(Math.ceil(tempArrUnPin.length / dataPerPage));
        getUnpinData(tempArrUnPin, currentPage);
      });

    return () => unsubscribe();
  }, [updatePinnedChannel, updateSoonzeChannel, currentPage]);

  const getPinData = (tempArr: any) => {
    const collectionRef = firestore.collection("channels");
    if (tempArr?.length > 0) {
      const batch = tempArr.splice(0, 30);
      const query = collectionRef
        .where("enc_channelID", "in", batch)
        .where("isSnoozed", "==", false)
        .limit(limits.pageSize)
        .onSnapshot((querySnapshot) => {
          const mergedResults: any = [];
          querySnapshot.forEach((doc) => {
            mergedResults.push(doc.data());
          });
          setpinData(mergedResults);
          setTempArrFalse(mergedResults);
          setPinnedChannel(false);
          setSoonzeChannel(false);
        });
    } else {
      setpinData([]);
    }
  };

  // const getUnpinData = (tempArr: any) => {
  //   const collectionRef = firestore.collection("channels");
  //   if (tempArr?.length > 0) {
  //     const batch = tempArr?.splice(0, 30);
  //     const query = collectionRef
  //       .where("enc_channelID", "in", batch)
  //       .limit(limits.pageSize);
  //     query.onSnapshot((querySnapshot) => {
  //       const mergedResults: any = [];

  //       querySnapshot.forEach((doc) => {
  //         mergedResults.push(doc.data());
  //       });
  //       setAllChannel(mergedResults);
  //       setUnReadCount(mergedResults);
  //       setTempArr(mergedResults);
  //       setPinnedChannel(false);
  //       setSoonzeChannel(false);
  //     });
  //   } else {
  //     setUnReadCount([]);
  //   }
  // };

  const getUnpinData = async (tempArr: any, pageNo: any) => {
    try {
      const collectionRef = firestore.collection("channels");

      if (tempArr?.length > 0) {
        const startIndex = (pageNo - 1) * dataPerPage;
        const batch = tempArr.slice(startIndex, startIndex + dataPerPage);

        // Create a reference to the listener
        collectionRef
          .where("enc_channelID", "in", batch)
          .where("isSnoozed", "==", false)
          .limit(dataPerPage)
          .onSnapshot((querySnapshot) => {
            const mergedResults = querySnapshot.docs.map((doc) => doc.data());

            setAllChannel([...allChannel, ...mergedResults]);
            // setUnReadCount(mergedResults);
            setTempArr(mergedResults);
            setPinnedChannel(false);
            setSoonzeChannel(false);
          });

        // Optionally, store the unsubscribe function to clean up the listener later
        // (e.g., when the component unmounts)
        // Remember to call unsubscribe() when the listener is no longer needed.
      } else {
        setUnReadCount([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // const getUnpinData = async (tempArr: any, pageNo: any) => {
  //   try {
  //     if (tempArr?.length > 0) {
  //       // Check if data is available locally
  //       // if (isDataAvailableLocally(pageNo)) {
  //       //   // Use local data
  //       //   const localData = getLocalData(pageNo);
  //       //   setAllChannel(localData);
  //       //   setTempArr(localData);
  //       //   setPinnedChannel(false);
  //       //   setSoonzeChannel(false);
  //       //   return;
  //       // }

  //       const collectionRef = firestore.collection("channels");
  //       const startIndex = (pageNo - 1) * dataPerPage;
  //       const batch = tempArr.slice(startIndex, startIndex + dataPerPage);
  //       const querySnapshot = await collectionRef
  //         .where("enc_channelID", "in", batch)
  //         .where("isSnoozed", "==", false)
  //         .get();

  //       const mergedResults: any = querySnapshot.docs.map((doc) => doc.data());

  //       // Store the fetched data locally
  //       storeLocalData(pageNo, mergedResults);

  //       // Update the state with the fetched data
  //       // setAllChannel(mergedResults);
  //       setTempArr([...allChannel, ...mergedResults]);

  //       setAllChannel([...allChannel, ...mergedResults]);
  //       setPinnedChannel(false);
  //       setSoonzeChannel(false);
  //     } else {
  //       // Handle the case when tempArr is empty
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const handleScroll = () => {
    const element: any = arrawScroll.current;
    if (element) {
      let cul =
        Math.round(element.scrollTop + element.clientHeight) -
        element.scrollHeight;
      if (
        Math.round(element.scrollTop + element.clientHeight) ===
          element.scrollHeight ||
        Math.abs(cul) === 1
      ) {
        if (currentPage < totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    }
  };

  const fetchdata = () => {
    if (search) {
      const collectionRef = firestore.collection("channels");
      let filteredData = [];
      const batchedQueries = [];
      const batchSize = 30; // Number of values per batch

      for (let i = 0; i < unpinData.length; i += batchSize) {
        const batch = unpinData.slice(i, i + batchSize);
        const query = collectionRef.where("enc_channelID", "in", batch).get();
        batchedQueries.push(query);
      }
      Promise.all(batchedQueries)
        .then((results) => {
          // Merge and process the results from all the queries
          let mergedResults: any = [];
          results.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              mergedResults.push(doc.data());
            });
          });
          mergedResults = mergedResults?.filter((item: any) => {
            return (
              item?.role
                ?.toLowerCase()
                ?.includes(search?.toLowerCase().trim()) ||
              item?.companyName
                .toLowerCase()
                .includes(search?.toLowerCase().trim()) ||
              item?.hrNumber
                ?.toLowerCase()
                ?.includes(search?.toLowerCase().trim())
            );
          });
          setAllChannel(mergedResults);
        })
        .catch((error) => {
          // Handle errors here
          console.error("error", error);
        });
      // collectionRef
      //   .where("enc_channelID", "in", unpinData)
      //   .get()
      //   .then((res) => {
      //     let filterdata = res.docs.map((doc) => doc.data());
      //     filteredData = filterdata?.filter((item) => {
      //       return (
      //         item?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
      //         item?.companyName.toLowerCase().includes(search?.toLowerCase()) ||
      //         item?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase())
      //       );
      //     });
      //     setAllChannel(filteredData);
      //   });
    } else {
      setCurrentPage(1);
    }
  };

  // useEffect(() => {
  //   fetchdata();
  // }, [search]);

  const getUnpinSearchData = async (tempArr: any, callback: any) => {
    try {
      const collectionRef = firestore.collection("channels");
      if (tempArr?.length > 0) {
        let getAllUnpindata = new Set();

        await Promise.all(
          tempArr.map(async (item: any) => {
            const querySnapshot = await collectionRef
              .where("enc_channelID", "==", item)
              // .where("isSnoozed", "==", false)
              .limit(dataPerPage)
              .get();

            const mergedResults = querySnapshot.docs.map((doc) => doc.data());
            mergedResults.forEach((result) => {
              getAllUnpindata.add(result);
            });
          })
        );
        const resultArray = Array.from(getAllUnpindata);

        if (callback) {
          callback(resultArray);
        }

        return resultArray;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUnPinChannelSearchData = (callback: any) => {
    const loginUserId = localStorage.getItem("EmployeeID");
    const unsubscribe = firestore
      .collectionGroup(`user`)
      .where("userEmpId", "==", loginUserId)
      // .limit(limits.pageSize)
      .onSnapshot((snapshot) => {
        let tempArrUnPin: any = [];
        snapshot.forEach((doc) => {
          const user = doc.data();
          if (!user.isPinned) {
            tempArrUnPin.push(user?.channelID.toString());
          }
          if (tempArrUnPin.length > 0) {
            getUnpinSearchData(tempArrUnPin, callback);
          }
        });
      });
    return () => unsubscribe();
  };

  useEffect(() => {
    if (search) {
      getUnPinChannelSearchData((getData: any) => {
        let filteredUnpinData = getData?.filter((item: any) => {
          return (
            item?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
            item?.companyName.toLowerCase().includes(search?.toLowerCase()) ||
            item?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase()) ||
            item?.hrStatus?.toLowerCase()?.includes(search?.toLowerCase())
          );
        });

        setAllChannel(filteredUnpinData);
      });
    } else {
      setAllChannel(tempArr);
    }
  }, [search]);

  useEffect(() => {
    if (search) {
      let filteredData = tempArrFalse?.filter((item: any) => {
        return (
          item?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.companyName.toLowerCase().includes(search?.toLowerCase()) ||
          item?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase())
        );
      });
      // setData(filteredData);
      setpinData(filteredData);
    } else {
      setpinData(tempArrFalse);
    }
  }, [search]);

  const filterData = allChannel?.filter((item: any) => {
    return item?.isSnoozed === true;
  });

  // UseEffect for unpinned groups

  useEffect(() => {
    let result: any = [];
    allChannel?.forEach((item: any) => {
      const data2: any = readCount.find(
        (temp: any) => item.enc_channelID === temp.enc_ChannelIDCount
      );
      setTimeout(() => {
        if (data2) {
          item.readCount = data2.readCount;
        }
        result.push(item);
      }, 500);
    });

    setTimeout(() => {
      setUnReadCount(result);
    }, 600);

    // setUpdateData(result);
    // setData(result);
  }, [allChannel, readCount]);

  // Result for pinned groups

  useEffect(() => {
    let result: any = [];
    pinData?.map((item: any) => {
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
      setUnReadCountPinned(result);
    }, 600);

    // setUpdateData(result);
    // setData(data);
  }, [pinData, readCountTrue]);

  useEffect(() => {
    const totalReadCount = allChannel.reduce(
      (total: any, item: any) => total + item.readCount,
      0
    );
    setTotalCount(totalReadCount);
  }, [totalCount, allChannel]);

  return (
    <>
      <div>
        <Tabs>
          {/* <TabList>
            <Tab>Active HRs</Tab>
            <Tab>
              Snooze HRs{" "}
              <span className={UpTabsStyle.numSnooze}>
                @{filterData?.length}
              </span>
            </Tab>
          </TabList> */}

          <TabPanel>
            <div className={UpTabsStyle.searchWrapper}>
              <span>
                <SearchSVG />
              </span>
              <input
                type="search"
                name="search"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div
              ref={arrawScroll}
              onScroll={handleScroll}
              className={UpTabsStyle.chatListWrapper}
            >
              <PinAccordian
                icon={<PinnedGroupsSVG />}
                label={"Pinned Groups"}
                isCollapsible={true}
                search={search}
                dataFalse={unReadCountPinned}
                setDataFalse={setpinData}
                LastPinnedGroups={LastPinnedGroups}
                setUpChat={setUpChat}
                upChat={upChat}
                setResetCount={setResetCount}
                resetCount={resetCount}
              />

              <div className={UpTabsStyle.dropPaginationArrow}>
                {/* <div className={UpTabsStyle.dropPagArrow}>
                  <div className={UpTabsStyle.PginationArrowWrap}>
                    <span
                      className={`${UpTabsStyle.Prev} ${
                        currentPage === 1 && UpTabsStyle.iconDisabled
                      }`}
                      onClick={handlePreviousPage}
                    >
                      <AiOutlineLeft />
                    </span>
                    <span className={UpTabsStyle.CounterPagi}>
                      {currentPage}
                    </span>
                    <span
                      className={`${UpTabsStyle.Next} ${
                        allChannel?.length < 10 && UpTabsStyle.iconDisabled
                      }`}
                      onClick={handleNextPage}
                    >
                      <AiOutlineRight />
                    </span>
                  </div>
                </div> */}

                <Accordion
                  icon={<BriefcaseSVG />}
                  label={"All Channels"}
                  isCollapsible={true}
                  search={search}
                  data={unReadCount}
                  LastPinnedGroups={LastPinnedGroups}
                  setData={setAllChannel}
                  LastSnoozeGroups={LastSnoozeGroups}
                  readCount={readCount}
                  setUpChat={setUpChat}
                  upChat={upChat}
                  currentPage={currentPage}
                  handleNextPage={handleNextPage}
                  handlePreviousPage={handlePreviousPage}
                  totalPages={totalPages}
                  unpinData={unpinData}
                />
              </div>
              {showUpChat === true && (
                <div className={UpTabsStyle.upChatClose}>
                  <ChatSVG />
                  <div className={UpTabsStyle.label}>Upchat</div>
                </div>
              )}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={UpTabsStyle.searchWrapper}>
              <span>
                <SearchSVG />
              </span>
              <input
                type="search"
                name="search"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={UpTabsStyle.chatListWrapper}>
              <SnoozeGroupDetails
                search={search}
                data={allChannel}
                LastSnoozeGroups={LastSnoozeGroups}
                setData={setAllChannel}
              />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default UpTabs;
