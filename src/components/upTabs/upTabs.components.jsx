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
  const [title, setTitle] = useState("Add New Hiring Requests");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [dataFalse, setDataFalse] = useState([]);
  const [tempArrFalse, setTempArrFalse] = useState([]);
  const [updatePinnedChannel, setPinnedChannel] = useState(false);
  const [updateSoonzeChannel, setSoonzeChannel] = useState(false);

  const LastPinnedGroups = () => {
    setPinnedChannel(true);
  };

  const LastSnoozeGroups = () => {
    setSoonzeChannel(true);
    // setPinnedChannel(true);
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
  //       console.log(dataArray,"dataArray");
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

  const channelIdData = (tempArr) => {
    const firestore = firebase.firestore();
    const collectionRef = firestore.collection("channels");
    const queryPromises = [];

    while (tempArr?.length > 0) {
      const batch = tempArr.splice(0, 30);
      const query = collectionRef.where("enc_channelID", "in", batch).get();
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
  };

  const channelIdDataFalse = (tempArr) => {
    const firestore = firebase.firestore();
    const collectionRef = firestore.collection("channels");
    const queryPromises = [];

    while (tempArr?.length > 0) {
      const batch = tempArr.splice(0, 30);
      const query = collectionRef.where("enc_channelID", "in", batch).get();
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
  };

  useEffect(() => {
    try {
      // UP0131
      const firestore = firebase.firestore();
      let tempArr = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", "NI7854")
        .where("isPinned", "==", false)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const user = doc.data();
            tempArr.push(user?.channelID.toString());
          });
          channelIdData(tempArr);
          setPinnedChannel(false);
        setSoonzeChannel(false);
        });
    } catch (error) {
      console.error(error, "errororo");
    }
  }, [updatePinnedChannel,updateSoonzeChannel]);

  useEffect(() => {
    try {
      // UP0131
      const firestore = firebase.firestore();
      let tempArr = [];
      const unsubscribe = firestore
        .collectionGroup(`user`)
        .where("userEmpId", "==", "NI7854")
        .where("isPinned", "==", true)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const user = doc.data();
            tempArr.push(user?.channelID.toString());
          });
          channelIdDataFalse(tempArr);
          setPinnedChannel(false);
        setSoonzeChannel(false);
        });
    } catch (error) {
      console.error(error, "errororo");
    }
  }, [updatePinnedChannel,updateSoonzeChannel]);

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
