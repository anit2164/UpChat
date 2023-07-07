import { ReactComponent as ArrowDownSVG } from "@SVG/arrowDown.svg";
import HeaderStyle from "./header.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firebaseConfig from "@/firebase";
import { useEffect, useState } from "react";

firebase.initializeApp(firebaseConfig);

const Header = ({ setToggle }) => {
  const [data, setData] = useState([]);
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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
        <div className={HeaderStyle.title}>Bhuvan UTS AM qa </div>
      </div>
      <div className={HeaderStyle.titleRight}>
        <span className={HeaderStyle.unreadNum}>{data?.length}</span>
        <ArrowDownSVG />
      </div>
    </div>
  );
};

export default Header;
