import React, { useEffect, useState } from "react";
import ArrowDownSVG from "../../assets/svg/arrowDown.svg";
import HeaderStyle from "./header.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firebaseConfig from "../../firebase";

firebase.initializeApp(firebaseConfig);

const Header = ({ setToggle }: any) => {
  const [data, setData] = useState([]);
  const [useName, setUsername] = useState("");
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
        {/* <span className={HeaderStyle.unreadNum}>{data?.length}</span> */}
        <ArrowDownSVG />
      </div>
    </div>
  );
};

export default Header;
