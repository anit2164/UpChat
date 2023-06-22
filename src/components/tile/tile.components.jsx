import { useState, useEffect } from "react";
import { Dropdown, Space } from "antd";
import TileStyle from "./tile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as BriefcaseSVG } from "@SVG/briefcase.svg";
import { ReactComponent as PinSVG } from "@SVG/pin.svg";
import { ReactComponent as ChannelLibrarySVG } from "@SVG/channelLibrary.svg";
import { ReactComponent as LeaveSVG } from "@SVG/leave.svg";
import { ReactComponent as SnoozeSVG } from "@SVG/snooze.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

firebase.initializeApp(firebaseConfig);

const Tile = ({ search }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [tempArr, setTempArr] = useState([]);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlVQMTMwMiIsIkxvZ2luVXNlcklkIjoiMTciLCJMb2dpblVzZXJUeXBlSWQiOiIyIiwibmJmIjoxNjg3MzI1MTA3LCJleHAiOjE2ODczNjExMDcsImlhdCI6MTY4NzMyNTEwN30.9Ge1Y5QGQrf7g40GvI9FsgJ7QWIQrU0MTSHwBbFXZzo";

  const tempToken = localStorage.setItem("token", token);

  const items = [
    {
      label: "PIN Channel",
      key: "0",
      icon: <PinSVG />,
    },
    {
      label: "View HR Detail Page",
      key: "1",
      icon: <BriefcaseSVG />,
    },
    {
      label: "Channel Library",
      key: "2",
      icon: <ChannelLibrarySVG />,
    },
    {
      label: "Snooze",
      key: "3",
      icon: <SnoozeSVG />,
    },
    {
      label: "Leave",
      key: "4",
      icon: <LeaveSVG />,
    },
  ];

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
      let filteredData = data?.filter((item) => {
        return (
          item?.Name?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.Name?.companyName
            .toLowerCase()
            .includes(search?.toLowerCase()) ||
          item?.Name?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase())
        );
      });
      setData(filteredData);
    } else {
      setData(tempArr);
    }
  }, [search]);

  return (
    <>
      <div className={TileStyle.chatWrapper}>
        {data?.map((item) => {
          return (
            <div className={`${TileStyle.chatItem} ${TileStyle.unreadMsg}`}>
              <div className={TileStyle.dFlex}>
                <div
                  className={` ${TileStyle.chatInitialThumb} ${TileStyle.blueThumb} `}
                >
                  {item?.Name?.companyInitial}
                </div>
                <div className={TileStyle.chatGroupDetails}>
                  <div className={TileStyle.channelName}>
                    {item?.Name?.companyName} | {item?.Name?.role}
                  </div>
                  <span className={TileStyle.hrStatus}>
                    {item?.Name?.hrNumber} | {item?.Name?.hrStatus}
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
    </>
  );
};

export default Tile;
