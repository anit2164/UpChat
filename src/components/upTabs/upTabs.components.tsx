import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useEffect, useState, useContext, useRef } from "react";
import Accordion from "../accordion/accordion.components";
import BriefcaseSVG from "../../assets/svg/briefcase.svg";
import SearchSVG from "../../assets/svg/search.svg";
import PinnedGroupsSVG from "../../assets/svg/pinnedGroups.svg";
import UpTabsStyle from "./upTabs.module.css";
import PinAccordian from "../pinAccordian/pinAccordian";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import SnoozeGroupDetails from "../snoozeList/snoozeGroups";
import { limits } from "../../constants/constantLimit";
import ChatSVG from "../../assets/svg/chat.svg";
import { MyContext } from "../chat-list";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";



firebase.initializeApp(firebaseConfig);

const UpTabs = () => {
  const [search, setSearch] = useState("");
  const [allChannel, setAllChannel] = useState<any>([]);
  const [tempArr, setTempArr] = useState([]);
  const [pinData, setpinData] = useState([]);
  const [tempArrFalse, setTempArrFalse] = useState([]);
  const [updatePinnedChannel, setPinnedChannel] = useState(false);
  const [updateSoonzeChannel, setSoonzeChannel] = useState(false);
  const [readCount, setReadCount] = useState([]);
  const [readCountTrue, setReadCountTrue] = useState([]);
  const [totalCount, setTotalCount] = useState("");
  const [unReadCount, setUnReadCount] = useState([]);
  const [unReadCountPinned, setUnReadCountPinned] = useState([]);
  const [upChat, setUpChat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unpinData, setUnpinData] = useState([]);
  const [localData, setLocalData] = useState<any>({});
  const [scrolling, setScrolling] = useState(false);


  const dataPerPage = 10;


  const loginUserId = localStorage.getItem("EmployeeID");
  const { showUpChat }: any = useContext(MyContext);
  const arrawScroll = useRef(null);


  const firestore = firebase.firestore();

  const LastPinnedGroups = () => {
    setPinnedChannel(true);
  };

  const LastSnoozeGroups = () => {
    setSoonzeChannel(true);
  };


  const isDataAvailableLocally = (pageNo: any) => {
    return localData.hasOwnProperty(pageNo);
  };

  const storeLocalData = (pageNo: any, data: any) => {
    // Update the local state with the data for the given pageNo
    setLocalData({ ...localData, [pageNo]: data });
  };

  const getLocalData = (pageNo: any) => {
    return localData[pageNo] || []; // Return an empty array if data doesn't exist
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      // getUnpinData(tempArr, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      // getUnpinData(tempArr, currentPage + 1);
    }
  };


  let tempCount: any = [];
  const tempInfo = async (data: any) => {
    let countArr: any = {};
    // const firestore = firebase.firestore();
    const readOrUnread = firestore.collectionGroup("user_chats");
    readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)
      .limit(limits.pageSize)
      .onSnapshot((snapshot) => {
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCount.push(countArr);
        setReadCount(tempCount);
      });
  };
  // useEffect(() => {
  //   try {
  //     // UP0131
  //     // const firestore = firebase.firestore();
  //     let tempArr = [];
  //     const unsubscribe = firestore
  //       .collectionGroup(`user`)
  //       .where("userEmpId", "==", loginUserId)
  //       .where("isPinned", "==", false)
  //       .limit(10)
  //       .onSnapshot((snapshot) => {
  //         snapshot.forEach((doc) => {
  //           const user = doc.data();
  //           tempArr.push(user?.channelID.toString());
  //           tempInfo(user?.channelID.toString());
  //         });
  //         // for (let i = 0; i < tempArr.length; i++) {
  //         //   tempInfo(tempArr[i]);
  //         // }
  //         // channelIdData(tempArr);
  //         const collectionRef = firestore.collection("channels");
  //         // const queryPromises = [];
  //         while (tempArr?.length > 0) {
  //           const batch = tempArr?.splice(0, 30);
  //           const query = collectionRef
  //             .where("enc_channelID", "in", batch)
  //             .limit(10);
  //           // .get();
  //           // queryPromises.push(query);
  //           query.onSnapshot((querySnapshot) => {
  //             const mergedResults = [];
  //             querySnapshot.forEach((doc) => {
  //               mergedResults.push(doc.data());
  //               // tempInfo(mergedResults);
  //             });
  //             // mergedResults.map((item)=>{

  //             //   return item.enc_channelID.includes(dataFalse?.[0]?.enc_channelID) && setDataFalse([])
  //             // })

  //             //All channel
  //             setAllChannel(mergedResults);
  //             setUnReadCount(mergedResults);
  //             setTempArr(mergedResults);
  //             setPinnedChannel(false);
  //             setSoonzeChannel(false);
  //           });
  //         }
  //       });
  //     return () => {
  //       unsubscribe();
  //     };
  //   } catch (error) {
  //     console.error(error, "errororo");
  //   }
  // }, [updatePinnedChannel, updateSoonzeChannel]);

  let tempCountData: any = [];
  const tempInfoData = async (data: any) => {
    let countArr: any = {};
    const readOrUnread = firestore.collectionGroup("user_chats");
    readOrUnread
      .where("isRead", "==", false)
      .where("enc_channelID", "==", data)
      .where("userEmpID", "==", loginUserId)
      .limit(limits.pageSize)
      .onSnapshot((snapshot) => {
        countArr.enc_ChannelIDCount = data;
        countArr.readCount = snapshot?.docs?.length;
        tempCountData.push(countArr);
        setReadCountTrue(tempCountData);
      });
  };

  // useEffect(() => {
  //   // const firestore = firebase.firestore();
  //   let tempArr = [];

  //   // Subscribe to the collection using onSnapshot
  //   const unsubscribe = firestore
  //     .collectionGroup(`user`)
  //     .where("userEmpId", "==", loginUserId)
  //     .where("isPinned", "==", true)
  //     .limit(10)
  //     .onSnapshot((snapshot) => {
  //       // This callback will be executed whenever there are changes to the query result
  //       tempArr = [];
  //       snapshot.forEach((doc) => {
  //         const user = doc.data();
  //         tempArr.push(user?.channelID.toString());
  //         tempInfoData(user?.channelID.toString());
  //       });

  //       // Call tempInfoData with the latest data
  //       // for (let i = 0; i < tempArr.length; i++) {
  //       //   tempInfoData(tempArr[i]);
  //       // }

  //       const collectionRef = firestore.collection("channels");
  //       const queryPromises = [];

  //       // Similar to before, but now we're using onSnapshot for the individual queries
  //       while (tempArr?.length > 0) {
  //         const batch = tempArr.splice(0, 30);
  //         const query = collectionRef
  //           .where("enc_channelID", "in", batch)
  //           .limit(10)
  //           .onSnapshot((querySnapshot) => {
  //             const mergedResults = [];
  //             querySnapshot.forEach((doc) => {
  //               mergedResults.push(doc.data());
  //             });
  //             //Pin Channel Data
  //             setpinData(mergedResults);
  //             setTempArrFalse(mergedResults);
  //             setPinnedChannel(false);
  //             setSoonzeChannel(false);
  //           });
  //         queryPromises.push(query);
  //       }
  //     });

  //   // The unsubscribe function returned by onSnapshot will be used to clean up the listener
  //   return () => unsubscribe();
  // }, [updatePinnedChannel, updateSoonzeChannel]);

  useEffect(() => {
    let tempArrPin: any = [];
    let tempArrUnPin: any = [];
    const unsubscribe = firestore
      .collectionGroup(`user`)
      .where("userEmpId", "==", loginUserId)
      .limit(limits.pageSize)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          const user = doc.data();
          if (user.isPinned) {
            tempArrPin.push(user?.channelID.toString());
            tempInfoData(user?.channelID.toString());
          } else {
            tempArrUnPin.push(user?.channelID.toString());
            tempInfo(user?.channelID.toString());
          }
        });
        getPinData(tempArrPin);
        setUnpinData(tempArrUnPin);
        setTotalPages(Math.ceil(tempArrUnPin.length / dataPerPage))
        getUnpinData(tempArrUnPin, currentPage);
      });
    return () => unsubscribe();
  }, [updatePinnedChannel, updateSoonzeChannel, currentPage]);

  const getPinData = (tempArr: any) => {
    const collectionRef = firestore.collection("channels");
    if (tempArr?.length > 0) {
      const batch = tempArr.splice(0, 30);
      const query = collectionRef
        .where("enc_channelID", "in", batch)
        .limit(limits.pageSize)
        .onSnapshot((querySnapshot) => {
          const mergedResults: any = [];
          querySnapshot.forEach((doc) => {
            mergedResults.push(doc.data());
          });
          setpinData(mergedResults);
          setTempArrFalse(mergedResults);
          setPinnedChannel(false);
          setSoonzeChannel(false);
        });
    } else {
      setpinData([]);
    }
  };

  // const getUnpinData = (tempArr: any) => {
  //   const collectionRef = firestore.collection("channels");
  //   if (tempArr?.length > 0) {
  //     const batch = tempArr?.splice(0, 30);
  //     const query = collectionRef.where("enc_channelID", "in", batch).limit(limits.pageSize);
  //     query.onSnapshot((querySnapshot) => {
  //       const mergedResults: any = [];

  //       querySnapshot.forEach((doc) => {
  //         mergedResults.push(doc.data());
  //       });
  //       setAllChannel(mergedResults);
  //       setUnReadCount(mergedResults);
  //       setTempArr(mergedResults);
  //       setPinnedChannel(false);
  //       setSoonzeChannel(false);
  //     });
  //   } else {
  //     setUnReadCount([]);
  //   }
  // };
  // const getUnpinData = async (tempArr: any, pageNo: any) => {
  //   try {
  //     const collectionRef = firestore.collection("channels");
  //     if (tempArr?.length > 0) {
  //       const startIndex = (pageNo - 1) * dataPerPage;
  //       console.log('startIndex', startIndex, startIndex + dataPerPage);
  //       const batch = tempArr.slice(startIndex, startIndex + dataPerPage);

  //       const querySnapshot = await collectionRef
  //         .where("enc_channelID", "in", batch)
  //         .limit(dataPerPage)
  //         .get();

  //       const mergedResults: any = querySnapshot.docs.map((doc) => doc.data());
  //       setAllChannel(mergedResults);
  //       // setUnReadCount(mergedResults);
  //       setTempArr(mergedResults);
  //       setPinnedChannel(false);
  //       setSoonzeChannel(false);
  //     } else {
  //       setUnReadCount([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };


  const getUnpinData = async (tempArr: any, pageNo: any) => {
    try {
      if (tempArr?.length > 0) {
        // Check if data is available locally
        if (isDataAvailableLocally(pageNo)) {
          // Use local data
          const localData = getLocalData(pageNo);
          setAllChannel(localData);
          setTempArr(localData);
          setPinnedChannel(false);
          setSoonzeChannel(false);
          return;
        }

        const collectionRef = firestore.collection("channels");
        const startIndex = (pageNo - 1) * dataPerPage;
        const batch = tempArr.slice(startIndex, startIndex + dataPerPage);
        const querySnapshot = await collectionRef
          .where("enc_channelID", "in", batch)
          .limit(dataPerPage)
          .get();

        const mergedResults: any = querySnapshot.docs.map((doc) => doc.data());

        // Store the fetched data locally
        storeLocalData(pageNo, mergedResults);

        // Update the state with the fetched data
        // setAllChannel(mergedResults);
        setAllChannel([...allChannel, ...mergedResults]);

        setTempArr(mergedResults);
        setPinnedChannel(false);
        setSoonzeChannel(false);
      } else {
        // Handle the case when tempArr is empty
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleScroll = () => {
    const element: any = arrawScroll.current;
    if (element) {
      if (
        Math.round(element.scrollTop + element.clientHeight) ===
        element.scrollHeight
      ) {
        if (currentPage < totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    }
  };


  const fetchdata = () => {
    if (search) {
      const collectionRef = firestore.collection("channels");
      let filteredData: any = [];
      const batchedQueries = [];
      const batchSize = 30; // Number of values per batch

      for (let i = 0; i < unpinData.length; i += batchSize) {
        const batch = unpinData.slice(i, i + batchSize);
        const query = collectionRef.where("enc_channelID", "in", batch).get();
        batchedQueries.push(query);
      }
      Promise.all(batchedQueries)
        .then((results) => {
          // Merge and process the results from all the queries
          let mergedResults: any = [];
          results.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              mergedResults.push(doc.data());
            });
          });
          mergedResults = mergedResults?.filter((item: any) => {
            return (
              item?.role
                ?.toLowerCase()
                ?.includes(search?.toLowerCase().trim()) ||
              item?.companyName
                .toLowerCase()
                .includes(search?.toLowerCase().trim()) ||
              item?.hrNumber
                ?.toLowerCase()
                ?.includes(search?.toLowerCase().trim())
            );
          });
          setAllChannel(mergedResults);
        })
        .catch((error) => {
          console.error("error", error);
        });
      // collectionRef
      //   .where("enc_channelID", "in", unpinData)
      //   .get()
      //   .then((res) => {
      //     let filterdata = res.docs.map((doc) => doc.data());
      //     filteredData = filterdata?.filter((item) => {
      //       return (
      //         item?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
      //         item?.companyName.toLowerCase().includes(search?.toLowerCase()) ||
      //         item?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase())
      //       );
      //     });
      //     setAllChannel(filteredData);
      //   });
    } else {
      setCurrentPage(1);
    }
  };

  // useEffect(() => {
  //   fetchdata();
  // }, [search]);

  const getUnpinSearchData = async (tempArr: any, callback: any) => {
    try {
      const collectionRef = firestore.collection("channels");
      if (tempArr?.length > 0) {
        let getAllUnpindata = new Set();

        await Promise.all(
          tempArr.map(async (item: any) => {
            const querySnapshot = await collectionRef
              .where("enc_channelID", "==", item)
              .limit(dataPerPage)
              .get();

            const mergedResults = querySnapshot.docs.map((doc) => doc.data());
            mergedResults.forEach((result) => {
              getAllUnpindata.add(result);
            });
          })
        );
        const resultArray = Array.from(getAllUnpindata);

        if (callback) {
          callback(resultArray);
        }

        return resultArray;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUnPinChannelSearchData = (callback: any) => {
    const loginUserId = localStorage.getItem("EmployeeID");
    const unsubscribe = firestore
      .collectionGroup(`user`)
      .where("userEmpId", "==", loginUserId)
      .limit(limits.pageSize)
      .onSnapshot((snapshot) => {
        let tempArrUnPin: any = [];
        snapshot.forEach((doc) => {
          const user = doc.data();
          if (!user.isPinned) {
            tempArrUnPin.push(user?.channelID.toString());
          }
          if (tempArrUnPin.length > 0) {
            getUnpinSearchData(tempArrUnPin, callback);
          }
        });
      });
    return () => unsubscribe();
  };

  useEffect(() => {
    if (search) {
      getUnPinChannelSearchData((getData: any) => {
        let filteredUnpinData = getData?.filter((item: any) => {
          return (
            item?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
            item?.companyName.toLowerCase().includes(search?.toLowerCase()) ||
            item?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase()) ||
            item?.hrStatus?.toLowerCase()?.includes(search?.toLowerCase())
          );
        });

        setAllChannel(filteredUnpinData);
      });
      // setDataFalse(filteredData);
    } else {
      setAllChannel(tempArr);
    }
  }, [search]);


  useEffect(() => {
    if (search) {
      let filteredData = tempArrFalse?.filter((item: any) => {
        return (
          item?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.companyName.toLowerCase().includes(search?.toLowerCase()) ||
          item?.hrNumber?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.hrStatus?.toLowerCase()?.includes(search?.toLowerCase())
        );
      });
      // setData(filteredData);
      setpinData(filteredData);
    } else {
      setpinData(tempArrFalse);
    }
  }, [search]);

  const filterData = allChannel?.filter((item: any) => {
    return item?.isSnoozed === true;
  });

  // UseEffect for unpinned groups

  useEffect(() => {
    let result: any = [];
    allChannel?.forEach((item: any) => {
      const data2: any = readCount.find(
        (temp: any) => item.enc_channelID === temp.enc_ChannelIDCount
      );
      setTimeout(() => {
        if (data2) {
          item.readCount = data2.readCount;
        }
        result.push(item);
      }, 500);
    });

    setTimeout(() => {
      setUnReadCount(result);
    }, 600);

    // setUpdateData(result);
    // setData(result);
  }, [allChannel, readCount]);

  // Result for pinned groups

  useEffect(() => {
    let result: any = [];
    pinData?.map((item: any) => {
      const data2: any = readCountTrue.find(
        (temp: any) => item.enc_channelID === temp.enc_ChannelIDCount
      );

      setTimeout(() => {
        if (data2) {
          item.readCount = data2.readCount;
        }
        result.push(item);
      });
    }, 500);

    setTimeout(() => {
      setUnReadCountPinned(result);
    }, 600);

    // setUpdateData(result);
    // setData(data);
  }, [pinData, readCountTrue]);

  useEffect(() => {
    const totalReadCount = allChannel.reduce(
      (total: any, item: any) => total + item.readCount,
      0
    );
    setTotalCount(totalReadCount);
  }, [totalCount, allChannel]);

  return (
    <>
      <div>
        <Tabs>
          {/* <TabList>
            <Tab>Active HRs</Tab>
            <Tab>
              Snooze HRs{" "}
              <span className={UpTabsStyle.numSnooze}>
                @{filterData?.length}
              </span>
            </Tab>
          </TabList> */}

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

            <div ref={arrawScroll}
              onScroll={handleScroll} className={UpTabsStyle.chatListWrapper}>
              <PinAccordian
                icon={<PinnedGroupsSVG />}
                label={"Pinned Groups"}
                isCollapsible={true}
                search={search}
                dataFalse={unReadCountPinned}
                setDataFalse={setpinData}
                LastPinnedGroups={LastPinnedGroups}
                setUpChat={setUpChat}
                upChat={upChat}
              />

              <div className={UpTabsStyle.dropPaginationArrow}>
                {/* <div className={UpTabsStyle.dropPagArrow}>
                  <div className={UpTabsStyle.PginationArrowWrap}>
                    <span
                      className={`${UpTabsStyle.Prev} ${currentPage === 1 && UpTabsStyle.iconDisabled
                        }`}
                      onClick={handlePreviousPage}
                    >
                      <AiOutlineLeft />
                    </span>
                    <span className={UpTabsStyle.CounterPagi}>
                      {currentPage}
                    </span>
                    <span
                      className={`${UpTabsStyle.Next} ${allChannel?.length < 10 && UpTabsStyle.iconDisabled
                        }`}
                      onClick={handleNextPage}
                    >
                      <AiOutlineRight />
                    </span>
                  </div>
                </div> */}


                <Accordion
                  icon={<BriefcaseSVG />}
                  label={"All Channels"}
                  isCollapsible={true}
                  search={search}
                  data={unReadCount}
                  LastPinnedGroups={LastPinnedGroups}
                  setData={setAllChannel}
                  LastSnoozeGroups={LastSnoozeGroups}
                  readCount={readCount}
                  setUpChat={setUpChat}
                  upChat={upChat}
                  currentPage={currentPage}
                  handleNextPage={handleNextPage}
                  handlePreviousPage={handlePreviousPage}
                  totalPages={totalPages}
                  unpinData={unpinData}
                />
              </div>

              {showUpChat === true && (
                <div className={UpTabsStyle.upChatClose}>
                  <ChatSVG />
                  <div className={UpTabsStyle.label}>Upchat</div>
                </div>
              )}
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
                data={allChannel}
                LastSnoozeGroups={LastSnoozeGroups}
                setData={setAllChannel}
              />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default UpTabs;
