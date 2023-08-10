import React, { useEffect, useState, useContext } from "react";
import ArrowDownSVG from "../../assets/svg/arrowDown.svg";
import HeaderStyle from "./header.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firebaseConfig from "../../firebase";
import MyContext from "../chat-list/myContext";

firebase.initializeApp(firebaseConfig);

const Header = ({ setToggle }: any) => {
  const [data, setData] = useState([]);
  const [useName, setUsername] = useState("");
  const { totalCount, totalCountPinned }: any = useContext(MyContext);
  useEffect(() => {
    // Retrive Data
    const fetchData = async () => {
      try {
        const firestore = firebase.firestore();
        const collectionRef = firestore.collection("channels");
        const snapshot = await collectionRef.get();

        const dataArray: any = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(dataArray);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loggedInData = JSON.parse(
      localStorage.getItem("userSessionInfo") || "{}"
    );
    setUsername(loggedInData?.FullName);
  }, []);

  var countDetails = totalCount + totalCountPinned;

  return (
    <div className={HeaderStyle.container} onClick={() => setToggle(false)}>
      <div className={HeaderStyle.containerBody}>
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          className={HeaderStyle.avatar}
          alt="avatar"
          style={{
            cursor: "pointer",
          }}
        />
        <div className={HeaderStyle.title}>{useName}</div>
      </div>
      <div className={HeaderStyle.titleRight}>
        {!isNaN(countDetails) && countDetails !== 0 && (
          <span className={HeaderStyle.unreadNum}>{countDetails}</span>
        )}
        <ArrowDownSVG />
      </div>
    </div>
  );
};

export default Header;
