import { useState, useEffect } from "react";
import { Dropdown, Space } from "antd";
import TileStyle from "./tile.module.css";
import { allChannelListingHandler } from "../../redux_toolkit/slices/allChannelListing";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
import { ReactComponent as SnoozeSVG } from "@SVG/snooze.svg";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  // Your Firebase project configuration
  apiKey: "AIzaSyBmwJCSVWPC1nuipS6BRbu3BhZE7cjQws0",
authDomain: "upchat-af56d.firebaseapp.com",
projectId: "upchat-af56d",
storageBucket: "upchat-af56d.appspot.com",
messagingSenderId: "940458219195",
appId: "1:940458219195:web:0c1f481a516befa8fa3b9e",
measurementId: "G-98CSFQLREY"
};


firebase.initializeApp(firebaseConfig);


const Tile = ({ search }) => {
  const [allChannel, setAllChannel] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlVQMTMwMiIsIkxvZ2luVXNlcklkIjoiMTciLCJMb2dpblVzZXJUeXBlSWQiOiIyIiwibmJmIjoxNjg3MzI1MTA3LCJleHAiOjE2ODczNjExMDcsImlhdCI6MTY4NzMyNTEwN30.9Ge1Y5QGQrf7g40GvI9FsgJ7QWIQrU0MTSHwBbFXZzo";

  const tempToken = localStorage.setItem("token", token);

  const response = useSelector((state) => state?.allChannelListing);
  const items = [
    {
      label: "PIN Channel",
      key: "0",
      icon: <PinSVG/>
    },
    {
      label: "View HR Detail Page",
      key: "1",
      icon: <BriefcaseSVG/>
    },
    {
      label: "Channel Library",
      key: "2",
      icon: <ChannelLibrarySVG/>
    },
    {
      label: "Snooze",
      key: "3",
      icon:<SnoozeSVG/>
    },
    {
      label: "Leave",
      key: "4",
      icon:<LeaveSVG/>
    },
  ];

  // useEffect(() => {
  //   if (!search) {
  //     dispatch(allChannelListingHandler());
  //   }
  // }, []);

  useEffect(() => {
    
    // Retrieve data
    const fetchData = async () => {
      try {
        const firestore = firebase.firestore();
        const collectionRef = firestore.collection('users');
        const snapshot = await collectionRef.get();
        
        const dataArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setData(dataArray);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  
  console.log(data,"datadatadatadata");
  
  useEffect(() => {
    setAllChannel(response?.data?.details);
    setTempArr(response?.data?.details);
  }, [response]);

  useEffect(() => {
    if (search) {
      let filteredData = tempArr.filter((item) => {
        return item?.companyWithRole.split("|")[0]
          .toLowerCase()
          .includes(search.toLowerCase()) ||  item?.companyWithRole.split("|")[1]
          .toLowerCase()
          .includes(search.toLowerCase()) || item?.hrWithStatus.split("|")[0]
          .toLowerCase()
          .includes(search.toLowerCase())
      });
      setAllChannel(filteredData);
    } else {
      setAllChannel(tempArr);
    }
  }, [search]);

  return (
    <div className={TileStyle.chatWrapper}>
      {allChannel?.map((item) => {
        return (
          <div className={`${TileStyle.chatItem} ${TileStyle.unreadMsg}`}>
            <div className={TileStyle.dFlex}>
              <div
                className={` ${TileStyle.chatInitialThumb} ${TileStyle.blueThumb} `}
              >
                {item?.companyInitial}
              </div>
              <div className={TileStyle.chatGroupDetails}>
                <div className={TileStyle.channelName}>
                  {/* Senior Backend... | Andela | HR170523201242 */}
                  {item?.companyWithRole}
                </div>
                <span className={TileStyle.hrStatus}>
                  {/* HR Status : In Process */}
                  {item?.hrWithStatus}
                </span>
              </div>
            </div>
            <div className={TileStyle.dFlexTime}>
              <div className={TileStyle.timeStamp}>12:30 PM</div>
              <div className={TileStyle.unreadNum}>5</div>
              <Dropdown
                className={TileStyle.dotMenuMain}
                menu={{
                  items,
                }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <span className={TileStyle.dotMenu}></span>
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tile;
