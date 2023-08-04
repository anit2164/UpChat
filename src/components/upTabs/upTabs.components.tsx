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
  const [unReadCount, setUnReadCount] = useState([]);

  const loginUserId = localStorage.getItem("EmployeeID");

  const LastPinnedGroups = () => {
    setPinnedChannel(true);
  };

  const LastSnoozeGroups = () => {
    setSoonzeChannel(true);
  };

  let tempCount: any = [];
  const tempInfo = async (data: any) => {
    let countArr: any = {};
    const firestore = firebase.firestore();
    const readOrUnread = firestore.collectionGroup("user_chats");
    const query = readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)
      .limit(10)
      .onSnapshot((snapshot) => {
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCount.push(countArr);
        setReadCount(tempCount);
      });
  };

  useEffect(() => {
    try {
      // UP0131
      const firestore = firebase.firestore();
      let tempArr: any = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", loginUserId)
        .where("isPinned", "==", false)
        .limit(10)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            const user = doc.data();
            tempArr.push(user?.channelID.toString());
          });
          for (let i = 0; i < tempArr.length; i++) {
            tempInfo(tempArr[i]);
          }
          // channelIdData(tempArr);
          const collectionRef = firestore.collection("channels");
          // const queryPromises = [];
          while (tempArr?.length > 0) {
            const batch = tempArr?.splice(0, 30);
            const query = collectionRef
              .where("enc_channelID", "in", batch)
              .limit(10);
            query.onSnapshot((querySnapshot) => {
              const mergedResults: any = [];
              querySnapshot.forEach((doc) => {
                mergedResults.push(doc.data());
              });
              setUnReadCount(mergedResults);
              setData(mergedResults);
              setTempArr(mergedResults);
              setPinnedChannel(false);
              setSoonzeChannel(false);
            });
          }
        });
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error, "errororo");
    }
  }, [updatePinnedChannel, updateSoonzeChannel]);

  let tempCountData: any = [];
  const tempInfoData = async (data: any) => {
    let countArr: any = {};
    const firestore = firebase.firestore();
    const readOrUnread = firestore.collectionGroup("user_chats");
    const query = readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)
      .limit(10)
      .onSnapshot((snapshot) => {
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCountData.push(countArr);
        setReadCountTrue(tempCountData);
      });
  };

  useEffect(() => {
    const firestore = firebase.firestore();
    let tempArr: any = [];

    // Subscribe to the collection using onSnapshot
    const unsubscribe = firestore
      .collectionGroup(`user`)
      .where("userEmpId", "==", loginUserId)
      .where("isPinned", "==", true)
      .limit(10)
      .onSnapshot((snapshot) => {
        // This callback will be executed whenever there are changes to the query result
        tempArr = [];
        snapshot.forEach((doc) => {
          const user = doc.data();
          tempArr.push(user?.channelID.toString());
        });

        // Call tempInfoData with the latest data
        for (let i = 0; i < tempArr.length; i++) {
          tempInfoData(tempArr[i]);
        }

        const collectionRef = firestore.collection("channels");
        const queryPromises = [];

        // Similar to before, but now we're using onSnapshot for the individual queries
        while (tempArr?.length > 0) {
          const batch = tempArr.splice(0, 30);
          const query = collectionRef
            .where("enc_channelID", "in", batch)
            .limit(10)
            .onSnapshot((querySnapshot) => {
              const mergedResults: any = [];
              querySnapshot.forEach((doc) => {
                mergedResults.push(doc.data());
              });
              setDataFalse(mergedResults);
              setTempArrFalse(mergedResults);
              setPinnedChannel(false);
              setSoonzeChannel(false);
            });
          queryPromises.push(query);
        }
      });

    // The unsubscribe function returned by onSnapshot will be used to clean up the listener
    return () => unsubscribe();
  }, [updatePinnedChannel, updateSoonzeChannel]);

  // All channel data search
  useEffect(() => {
    if (search) {
      let filteredData = tempArr?.filter((item: any) => {
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
  // Pinned data search
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
      setDataFalse(filteredData);
    } else {
      setDataFalse(tempArrFalse);
    }
  }, [search]);

  const filterData = data?.filter((item: any) => {
    return item?.isSnoozed === true;
  });

  // useEffect(() => {
  //   const result = data?.map((item: any) => {
  //     const data2: any = readCount.find(
  //       (temp: any) => item.enc_channelID === temp.enc_ChannelIDCount
  //     );
  //     if (data2) {
  //       item.readCount = data2.readCount;
  //     }
  //     return item;
  //   });
  //   // setUpdateData(result);
  //   // setData(data);
  // }, [data, readCount]);

  useEffect(() => {
    let result: any = [];
    data?.forEach((item: any) => {
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
  }, [data, readCount]);

  useEffect(() => {
    const result = dataFalse?.map((item: any) => {
      const data2: any = readCountTrue.find(
        (temp: any) => item.enc_channelID === temp.enc_ChannelIDCount
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
      (total: any, item: any) => total + item.readCount,
      0
    );
    setTotalCount(totalReadCount);
  }, [totalCount, data]);

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
                dataFalse={dataFalse}
                setDataFalse={setDataFalse}
                LastPinnedGroups={LastPinnedGroups}
              />
              <Accordion
                icon={<BriefcaseSVG />}
                label={"All Channels"}
                isCollapsible={true}
                search={search}
                // data={data}
                data={unReadCount}
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
