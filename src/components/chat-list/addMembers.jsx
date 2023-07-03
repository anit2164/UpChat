import ChatListingStyles from "./chatListing.module.css";
import { ReactComponent as FiUserPlusSVG } from "@SVG/fiUserPlus.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMemberListingHandler } from "@/redux_toolkit/slices/addMemberListing";
import { ReactComponent as FiChevronLeftSVG } from "@SVG/fiChevronLeft.svg";
import { ReactComponent as SearchSVG } from "@SVG/search.svg";

firebase.initializeApp(firebaseConfig);

const AddMembers = ({
  allChannelItem,
  showAddMemberModel,
  setShowAddMemberModel,
  setHideMemberModel,
}) => {
  console.log(allChannelItem, "allChannelItemallChannelItem");
  const [search, setSearch] = useState("");
  const [showUserName, setUserName] = useState([]);

  const dispatch = useDispatch();
  const addMemberListingdata = useSelector((state) => state?.addMemberListing);

  useEffect(() => {
    dispatch(addMemberListingHandler());
  }, []);

  const filterData = addMemberListingdata?.data?.details?.filter((item) => {
    return item?.userName?.toLowerCase()?.includes(search?.toLowerCase());
  });

  const userNameList = (e, item) => {
    if (e.target.checked) {
      setUserName([...showUserName, item]);
    } else {
      setUserName(showUserName.filter((showUserName) => showUserName !== item));
    }
  };

  const removeSelectedMember = (item) => {
    console.log(item, "iteteett");
    if (showUserName) {
      setUserName(showUserName.filter((showUserName) => showUserName !== item));
      // const updatedItems = item?.map((itemInfo) =>
      //   itemInfo === item ? { ...itemInfo, checked: false } : item
      // );
      // setUserName(updatedItems);
    }
  };
  console.log(showUserName, "showUserName");

  const addMembers = async () => {
    try {
      // let tempObj = {
      //   channelID: allChannelItem?.allChannelItem?.enc_channelID,
      //   photoURL: "",
      //   userDesignation: "Sales Consultant",
      //   userEmpId: "UP1234",
      //   userInitial: "SZ",
      //   userName: "Shreyash Test",
      // };
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection(
        `ChannelUserMapping/${allChannelItem?.allChannelItem?.enc_channelID}/user`
      );
      for (let i = 0; i < showUserName.length; i++) {
        await collectionRef.add(showUserName);
      }
      setShowAddMemberModel(!showAddMemberModel);
      setHideMemberModel(true);
    } catch (error) {
      console.error(error);
    }
  };

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
              onChange={(e) => {
                setSearch(e.target.value);
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
            {filterData?.map((item) => {
              return (
                <div className={ChatListingStyles.membersArea}>
                  <div className={ChatListingStyles.membersAreaLeft}>
                    <span
                      className={` ${ChatListingStyles.circle} ${ChatListingStyles.blueThumb} `}
                    >
                      {item?.userIntial}
                    </span>
                    <div className={ChatListingStyles.profileName}>
                      {item?.userName}({item?.userID})
                    </div>
                    <span
                      className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.coeteam} `}
                    >
                      {item?.userType}
                    </span>
                  </div>
                  <div className={ChatListingStyles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      name="selectMember"
                      // value={item?.userName}
                      onChange={(e) => userNameList(e, item)}
                    />
                    <span></span>
                  </div>
                </div>
              );
            })}
            {filterData?.length === 0 && (
              <span className={ChatListingStyles.noDataFound}>
                No Members Found
              </span>
            )}
          </li>

          <li>
            <div className={ChatListingStyles.addedMember}>
              {showUserName?.map((item) => {
                return (
                  <span>
                    {`${item?.userName}(${item?.userID})`}
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
