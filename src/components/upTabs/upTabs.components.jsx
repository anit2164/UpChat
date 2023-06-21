import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState } from "react";
import Accordion from "@Components/accordion/accordion.components";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as SearchSVG } from "@SVG/search.svg";
import UpTabsStyle from "./upTabs.module.css";
import Tile from "../tile/tile.components";
const UpTabs = () => {
  const [title, setTitle] = useState("Add New Hiring Requests");
  const [search, setSearch] = useState("");

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
              <Accordion
                icon={<BriefcaseSVG />}
                label={"All Channels"}
                isCollapsible={true}
                search={search}
              />
              {/* {search && <Tile search={search} />} */}
            </div>
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
          </TabPanel>
        </Tabs>
      </div>
      {/* <div>{search && <Tile search={search} />}</div> */}
    </>
  );
};

export default UpTabs;
