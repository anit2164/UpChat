import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useEffect, useState } from "react";
import Accordion from "@Components/accordion/accordion.components";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as SearchSVG } from "@SVG/search.svg";
import { ReactComponent as PinnedGroupsSVG } from "@SVG/pinnedGroups.svg";

import UpTabsStyle from "./upTabs.module.css";
import PinAccordian from "../pinAccordian/pinAccordian";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import SnoozeGroupDetails from "../snoozeList/snoozeGroups";

firebase.initializeApp(firebaseConfig);

const UpTabs = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [dataFalse, setDataFalse] = useState([]);
  const [tempArrFalse, setTempArrFalse] = useState([]);
  const [updatePinnedChannel, setPinnedChannel] = useState(false);
  const [updateSoonzeChannel, setSoonzeChannel] = useState(false);
  const [readCount, setReadCount] = useState([]);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const [totalCount, setTotalCount] = useState("");

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

  let tempCount = [];
  const tempInfo = async (data) => {
    let countArr = {};
    const firestore = firebase.firestore();
    const readOrUnread = firestore.collectionGroup("user_chats");
    const query = readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", "ChatUser_Jimit");
    const snapshot1 = await query.limit(5).get();
    countArr.enc_ChannelIDCount = data;
    countArr.readCount = snapshot1?.docs?.length;
    tempCount.push(countArr);
    setReadCount(tempCount);
  };

  useEffect(() => {
    try {
      // UP0131
      const firestore = firebase.firestore();
      let tempArr = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", "ChatUser_Jimit")
        .where("isPinned", "==", false)
        .limit(10)
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
              setData(mergedResults);
              setTempArr(mergedResults);
              setPinnedChannel(false);
              setSoonzeChannel(false);
            })
            .catch((error) => {
              console.error(error);
            });
          setPinnedChannel(false);
          setSoonzeChannel(false);
        });
    } catch (error) {
      console.error(error, "errororo");
    }
  }, [updatePinnedChannel, updateSoonzeChannel]);

  let tempCountData = [];
  const tempInfoData = async (data) => {
    let countArr = {};
    const firestore = firebase.firestore();
    const readOrUnread = firestore.collectionGroup("user_chats");
    const query = readOrUnread
      .where("isRead", "==", true)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", "ChatUser_Jimit");
    const snapshot1 = await query.limit(10).get();
    countArr.enc_ChannelIDCount = data;
    countArr.readCount = snapshot1?.docs?.length;
    tempCountData.push(countArr);
    setReadCountTrue(tempCountData);
  };

  useEffect(() => {
    try {
      const firestore = firebase.firestore();
      let tempArr = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", "ChatUser_Jimit")
        .where("isPinned", "==", true)
        .limit(10)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const user = doc.data();
            tempArr.push(user?.channelID.toString());
          });
          for (let i = 0; i < tempArr.length; i++) {
            tempInfoData(tempArr[i]);
          }
          const collectionRef = firestore.collection("channels");
          const queryPromises = [];

          while (tempArr?.length > 0) {
            const batch = tempArr.splice(0, 30);
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
              setDataFalse(mergedResults);
              setTempArrFalse(mergedResults);
              setPinnedChannel(false);
              setSoonzeChannel(false);
            })
            .catch((error) => {
              console.error(error);
            });
          setPinnedChannel(false);
          setSoonzeChannel(false);
        });
    } catch (error) {
      console.error(error, "errororo");
    }
  }, [updatePinnedChannel, updateSoonzeChannel]);

  useEffect(() => {
    if (search) {
      let filteredData = tempArr?.filter((item) => {
        return (
          item?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.companyName.toLowerCase().includes(search?.toLowerCase()) ||
          item?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase())
        );
      });
      setData(filteredData);
    } else {
      setData(tempArr);
    }
  }, [search]);

  const filterData = data?.filter((item) => {
    return item?.isSnoozed === true;
  });

  useEffect(() => {
    const result = data?.map((item) => {
      const data2 = readCount.find(
        (temp) => item.enc_channelID === temp.enc_ChannelIDCount
      );
      if (data2) {
        item.readCount = data2.readCount;
      }
      return item;
    });
    // setUpdateData(result);
    // setData(data);
  }, [data, readCount]);

  useEffect(() => {
    console.log(readCountTrue, "readCountTrue");
    const result = dataFalse?.map((item) => {
      const data2 = readCountTrue.find(
        (temp) => item.enc_channelID === temp.enc_ChannelIDCount
      );
      if (data2) {
        item.readCount = data2.readCount;
      }
      return item;
    });
    // setUpdateData(result);
    // setData(data);
  }, [dataFalse, readCountTrue]);

  useEffect(() => {
    const totalReadCount = data.reduce(
      (total, item) => total + item.readCount,
      0
    );
    setTotalCount(totalReadCount);
  }, [totalCount, data]);

  return (
    <>
      <div>
        <Tabs>
          <TabList>
            <Tab>Active HRs</Tab>
            <Tab>
              Snooze HRs{" "}
              <span className={UpTabsStyle.numSnooze}>
                @{filterData?.length}
              </span>
            </Tab>
          </TabList>

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
                dataFalse={dataFalse}
                setDataFalse={setDataFalse}
                LastPinnedGroups={LastPinnedGroups}
              />
              <Accordion
                icon={<BriefcaseSVG />}
                label={"All Channels"}
                isCollapsible={true}
                search={search}
                data={data}
                LastPinnedGroups={LastPinnedGroups}
                setData={setData}
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
                data={data}
                LastSnoozeGroups={LastSnoozeGroups}
                setData={setData}
              />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default UpTabs;
