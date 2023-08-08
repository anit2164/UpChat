import CollapseStyle from "./collapsible.module.css";
import ChatSVG from "../../assets/svg/chat.svg";
import ArrowDownSVG from "../../assets/svg/arrowDown.svg";
import React, { useState, useEffect } from "react";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
firebase.initializeApp(firebaseConfig);

const Collapse = ({ setToggle, toggle }: any) => {
  const [showClass, setShowClass] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Retrive Data
    const fetchData = async () => {
      try {
        const firestore = firebase.firestore();
        const collectionRef = firestore.collection("channels");
        const snapshot = await collectionRef.get();

        const dataArray: any = snapshot.docs.map((doc: any) => ({
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
  return (
    <div
      className={` ${CollapseStyle.container} ${
        !toggle ? CollapseStyle.toggleClose : ""
      } `}
      onClick={() => {
        setToggle(!toggle);
        setShowClass(false);
      }}
    >
      <div>
        <ChatSVG />
        <div className={CollapseStyle.label}>Upchat</div>
      </div>
      <div className={CollapseStyle.toggleCloseRight}>
        {/* <span className={CollapseStyle.unreadNum}>{data?.length}</span> */}
        <ArrowDownSVG className={CollapseStyle.fiChevronLeft} />
      </div>
    </div>
  );
};

export default Collapse;
