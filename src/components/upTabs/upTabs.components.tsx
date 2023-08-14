import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useEffect, useState } from "react";
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

firebase.initializeApp(firebaseConfig);

const UpTabs = () => {
  const [search, setSearch] = useState("");
  const [allChannel, setAllChannel] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [pinData, setpinData] = useState([]);
  const [tempArrFalse, setTempArrFalse] = useState([]);
  const [updatePinnedChannel, setPinnedChannel] = useState(false);
  const [updateSoonzeChannel, setSoonzeChannel] = useState(false);
  const [readCount, setReadCount] = useState([]);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const [totalCount, setTotalCount] = useState("");
  const [unReadCount, setUnReadCount] = useState([]);
  const [unReadCountPinned, setUnReadCountPinned] = useState([]);

  const loginUserId = localStorage.getItem("EmployeeID");

  const firestore = firebase.firestore();

  const LastPinnedGroups = () => {
    setPinnedChannel(true);
  };

  const LastSnoozeGroups = () => {
    setSoonzeChannel(true);
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
      .limit(limits.pageSize)
      .onSnapshot((snapshot) => {
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCount.push(countArr);
        setReadCount(tempCount);
      });
  };
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
        getUnpinData(tempArrUnPin);
      });
    return () => unsubscribe();
  }, [updatePinnedChannel, updateSoonzeChannel]);

  const getPinData = (tempArr: any) => {
    const collectionRef = firestore.collection("channels");
    if (tempArr?.length > 0) {
      const batch = tempArr.splice(0, 30);
      const query = collectionRef
        .where("enc_channelID", "in", batch)
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

  const getUnpinData = (tempArr: any) => {
    const collectionRef = firestore.collection("channels");
    if (tempArr?.length > 0) {
      const batch = tempArr?.splice(0, 30);
      const query = collectionRef.where("enc_channelID", "in", batch).limit(limits.pageSize);
      query.onSnapshot((querySnapshot) => {
        const mergedResults: any = [];

        querySnapshot.forEach((doc) => {
          mergedResults.push(doc.data());
        });
        setAllChannel(mergedResults);
        setUnReadCount(mergedResults);
        setTempArr(mergedResults);
        setPinnedChannel(false);
        setSoonzeChannel(false);
      });
    } else {
      setUnReadCount([]);
    }
  };

  useEffect(() => {
    if (search) {
      let filteredData = tempArr?.filter((item: any) => {
        return (
          item?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.companyName.toLowerCase().includes(search?.toLowerCase()) ||
          item?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase())
        );
      });
      setAllChannel(filteredData);
      // setDataFalse(filteredData);
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

            <div className={UpTabsStyle.chatListWrapper}>
              <PinAccordian
                icon={<PinnedGroupsSVG />}
                label={"Pinned Groups"}
                isCollapsible={true}
                search={search}
                dataFalse={unReadCountPinned}
                setDataFalse={setpinData}
                LastPinnedGroups={LastPinnedGroups}
              />
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
              />
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