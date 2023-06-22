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

firebase.initializeApp(firebaseConfig);

const UpTabs = () => {
  const [title, setTitle] = useState("Add New Hiring Requests");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [tempArr, setTempArr] = useState([]);

  useEffect(() => {
    // Retrive Data
    const fetchData = async () => {
      try {
        const firestore = firebase.firestore();
        const collectionRef = firestore.collection("channels");
        const snapshot = await collectionRef.get();

        const dataArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(dataArray);
        setTempArr(dataArray);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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

  return (
    <>
      <div>
        <Tabs>
          <TabList>
            <Tab>Active HRs</Tab>
            <Tab>Snooze HRs</Tab>
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
                data={data}
              />
              <Accordion
                icon={<BriefcaseSVG />}
                label={"All Channels"}
                isCollapsible={true}
                search={search}
                data={data}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default UpTabs;
