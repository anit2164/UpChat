import ChatListingStyles from "./chatListing.module.css";
import FiUserPlusSVG from "../../assets/svg/fiUserPlus.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addMemberListingHandler } from "../../redux_toolkit/slices/addMemberListing";
import FiChevronLeftSVG from "../../assets/svg/fiChevronLeft.svg";
import SearchSVG from "../../assets/svg/search.svg";
import { addMemberListingHandler } from "../../redux_toolkit/slices/addMemberListing";
import axios from "axios";
import { addMemberListing, memberListing } from "../../services/api";
firebase.initializeApp(firebaseConfig);

const AddMembers = ({
  allChannelItem,
  showAddMemberModel,
  setShowAddMemberModel,
  setHideMemberModel,
  userDataList,
}: any) => {
  const [search, setSearch] = useState("");
  const [showUserName, setUserName] = useState<any>([]);
  const [channelIds, setChannelIds] = useState("");
  const [listData, setListData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [filteredDataInfo, setFilteredDataInfo] = useState([]);

  // const dispatch: any = useDispatch();
  // const addMemberListingdata: any = useSelector(
  //   (state: any) => state?.addMemberListing
  // );

  var storageToken: any;
  setTimeout(() => {
    storageToken = JSON.parse(localStorage.getItem("apiKey") || "{}");
  }, 0);

  let userName = localStorage.getItem("FullName");
  let employeeId = localStorage.getItem("EmployeeID");

  // useEffect(() => {
  //   dispatch(addMemberListingHandler());
  // }, []);

  useEffect(() => {
    setChannelIds(allChannelItem?.allChannelItem?.enc_channelID);
  }, [allChannelItem]);

  const handleChange = (e: any) => {
    if (e) {
      const filterData = sortedData?.filter((item: any) => {
        return item?.userName?.toLowerCase()?.includes(e?.toLowerCase());
      });
      setSearch(e);
      setListData(filterData);
    } else {
      setSearch(e);
      setListData(sortedData);
    }
  };

  useEffect(() => {
    if (filteredDataInfo) {
      const filterData = filteredDataInfo?.filter((item: any) => {
        const newObj = { ...item, isChecked: false };
        return newObj;
      });

      var array1 = filterData;
      var array2 = userDataList;

      const properties = [
        "userEmpId",
        "channelID",
        "photoURL",
        "userDesignation",
        "userInitial",
        "userName",
      ];

      if (filterData?.length > 0 && filteredDataInfo) {
        const result = array1.filter(
          (object1: any) =>
            !array2.some((object2: any) => object1.userEmpId === object2.userEmpId)
        );

        const sortedUsers = result.slice().sort((a: any, b: any) => {
          const nameA = a.userName.toUpperCase().trim();
          const nameB = b.userName.toUpperCase().trim();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        setListData(sortedUsers);
        setSortedData(sortedUsers);
      }
    }
  }, [filteredDataInfo]);

  const userNameList = (e: any, item: any, i: any) => {
    if (e.target.checked) {
      const tempData: any = listData?.map((item: any, index: any) => {
        return index == i ? { ...item, isChecked: true } : item;
      });
      setListData(tempData);
      const filterData = tempData.filter((item: any) => item.isChecked == true);
      setUserName(filterData);
    } else {
      const tempData: any = listData?.map((item: any, index: any) => {
        return index == i ? { ...item, isChecked: false } : item;
      });
      setListData(tempData);
      const filterData = tempData.filter((item: any) => item.isChecked == true);
      setUserName(filterData);
    }
  };

  const removeSelectedMember = (item: any) => {
    if (showUserName) {
      const removeMember: any = listData.findIndex(
        (itemData: any, index: any) => {
          return itemData.userEmpId == item.userEmpId;
        }
      );
      const removeData: any = listData?.map((item: any, index: any) => {
        return index === removeMember ? { ...item, isChecked: false } : item;
      });
      setListData(removeData);
      setUserName(
        showUserName.filter((showUserName: any) => showUserName !== item)
      );
    }
  };

  const getRandomColor = () => {
    const colors = [
      {
        backgroundColor: "#bee2ff",
        fontColor: "#3678b1",
      },
      {
        backgroundColor: "#fceae6",
        fontColor: "#cc4d4d",
      },
      {
        backgroundColor: "rgba(69, 255, 83, 0.2)",
        fontColor: " #006c1a",
      },
      {
        backgroundColor: "#f7f4bf",
        fontColor: "#8b851a",
      },
      {
        backgroundColor: "#ffd1b2",
        fontColor: "#ef6000",
      },
      {
        backgroundColor: "#bff6ff",
        fontColor: "#0095ad",
      },
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  let tempArr: any = [];

  for (let index = 0; index < showUserName.length; index++) {
    let tempObj = {
      userName: "",
      userEmpID: "",
      backGroudColor: "",
      fontColor: ""
    };
    const element = showUserName?.[index];
    tempObj.userName = element?.userName;
    tempObj.userEmpID = element?.userEmpId;
    tempObj.backGroudColor = getRandomColor().backgroundColor;
    tempObj.fontColor = getRandomColor().fontColor;
    tempArr.push(tempObj);
  }
  // API Call For Add Members
  const addMemberAPI = async () => {
    try {
      const data = {
        channelID: allChannelItem?.allChannelItem.enc_channelID,
        channelActionID: 1,
        actionPerformBy_UserName: userName,
        actionPerformBy_UserEmpID: employeeId,
        createdByID: 0,
        userDetails: tempArr,
      };

      addMemberListing(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addMembers = async () => {
    let tempObj;
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection(
        `ChannelUserMapping/${allChannelItem?.allChannelItem?.enc_channelID}/user`
      );
      for (let i = 0; i < showUserName.length; i++) {
        tempObj = showUserName[i];
        delete showUserName[i].isChecked;
        tempObj.channelID = allChannelItem.allChannelItem.enc_channelID;
        await collectionRef.add(tempObj);
      }
      setShowAddMemberModel(!showAddMemberModel);
      setHideMemberModel(true);
    } catch (error) {
      console.error(error);
    }
    // Dot Net API call
    addMemberAPI();
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await memberListing()
        setListData(response?.responseBody?.details);
        setFilteredDataInfo(response?.responseBody?.details);
        // setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className={ChatListingStyles.addMembersPopup}>
        <ul className={ChatListingStyles.membersMenuMain}>
          <li className={ChatListingStyles.membersAreaHeader}>
            <FiUserPlusSVG />
            Add Members
            <span className={ChatListingStyles.chatWindowBack}>
              <FiChevronLeftSVG
                width="14"
                onClick={() => {
                  setShowAddMemberModel(!showAddMemberModel);
                  setHideMemberModel(true);
                }}
              />
            </span>
          </li>
          <li className={ChatListingStyles.membersAreaSearch}>
            <SearchSVG />
            <input
              type="search"
              placeholder="Search Name, Employee ID or Email."
              value={search}
              onChange={(e: any) => {
                handleChange(e.target.value);
              }}
            />
          </li>
          {search ? (
            <li
              className={ChatListingStyles.listingLabel}
            >{`Results for "${search}"`}</li>
          ) : (
            <li className={ChatListingStyles.listingLabel}>Recommended</li>
          )}
          <li className={ChatListingStyles.memberListing}>
            {listData?.map((item: any, index: any) => {
              return (
                <div className={ChatListingStyles.membersArea}>
                  <div className={ChatListingStyles.membersAreaLeft}>
                    <span
                      className={` ${ChatListingStyles.circle
                        }  `}
                      style={{
                        backgroundColor: item.backGroudColor,
                        color: item.fontColor,
                      }}
                    // style={{ backgroundColor: getRandomColor() }}
                    >
                      {item?.userInitial}
                    </span>
                    <div className={ChatListingStyles.profileName}>
                      {item?.userName}({item?.userEmpId})
                    </div>
                    <span
                      className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.coeteam} `}
                    >
                      {item?.userDesignation}
                    </span>
                  </div>
                  <div className={ChatListingStyles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      name="selectMember"
                      // value={item?.userName}
                      checked={item?.isChecked}
                      onChange={(e: any) => userNameList(e, item, index)}
                    />
                    <span></span>
                  </div>
                </div>
              );
            })}
            {listData?.length === 0 && (
              <span className={ChatListingStyles.noDataFound}>
                No Members Found
              </span>
            )}
          </li>

          <li>
            <div className={ChatListingStyles.addedMember}>
              {showUserName?.map((item: any) => {
                return (
                  <span>
                    {`${item?.userName}(${item?.userEmpId})`}
                    <span
                      className={ChatListingStyles.removeMember}
                      onClick={() => removeSelectedMember(item)}
                    ></span>
                  </span>
                );
              })}
            </div>
          </li>

          <li>
            <div className={ChatListingStyles.addMembersAreaFooter}>
              <button
                disabled={showUserName.length === 0 ? true : false}
                onClick={() => addMembers()}
              >
                Add
              </button>
            </div>
          </li>
        </ul>
      </div>
      {/* </div> */}
    </>
  );
};

export default AddMembers;
