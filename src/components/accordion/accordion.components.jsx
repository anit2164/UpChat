import { Fragment, useEffect, useState } from "react";
import AccordionStyle from "./accordion.module.css";
import { ReactComponent as ArrowDownSVG } from "@SVG/arrowDown.svg";
import Tile from "@Components/tile/tile.components";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

firebase.initializeApp(firebaseConfig);

const Accordion = ({ icon, label, isCollapsible, search }) => {
  const [showBody, setShowBody] = useState(true);
  const [data, setData] = useState([]);
  const [tempArr, setTempArr] = useState([]);

  const toggleAccordion = () => {
    setShowBody(!showBody);
  };

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
    <Fragment>
      <div
        className={AccordionStyle.container}
        onClick={isCollapsible ? toggleAccordion : null}
      >
        <div className={AccordionStyle.containerInnerHeader}>
          {icon}
          <div className={AccordionStyle.title}>{label}</div>
        </div>
        <div>
          <ArrowDownSVG />
        </div>
      </div>
      {showBody && <Tile search={search} data={data} />}
    </Fragment>
  );
};

export default Accordion;
