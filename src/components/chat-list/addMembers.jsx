import ChatListingStyles from "./chatListing.module.css";
import { Dropdown, Space } from "antd";
import { ReactComponent as InfoIcon } from "@SVG/fiInfo.svg";
import { ReactComponent as FiUsersSVG } from "@SVG/fiUsers.svg";
import { ReactComponent as FiUserPlusSVG } from "@SVG/fiUserPlus.svg";
import { ReactComponent as FiShareSVG } from "@SVG/fiShare.svg";
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
  const [userDataList, setUserDataList] = useState();
  // const [hideMemberModel, setHideMemberModel] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const addMemberListingdata = useSelector((state) => state?.addMemberListing);

  useEffect(() => {
    try {
      const firestore = firebase.firestore();
      const unsubscribe = firestore
        .collection(
          `ChannelUserMapping/${allChannelItem?.allChannelItem?.id}/user`
        )
        .onSnapshot((snapshot) => {
          const userData = snapshot.docs.map((doc) => doc.data());
          setUserDataList(userData);
        });

      return () => {
        // Unsubscribe from Firestore snapshot listener when component unmounts
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, [allChannelItem]);

  useEffect(() => {
    dispatch(addMemberListingHandler());
  }, []);

  console.log(addMemberListingdata?.data?.details, "addMemberListingdata");
  //   const membersDropdown = [
  //     {
  //       key: "0",
  //       label: (
  //         <div className={ChatListingStyles.membersMenuMain}>
  //           6 Members
  //           <span className={ChatListingStyles.chatWindowClose}></span>
  //         </div>
  //       ),
  //       icon: <FiUsersSVG />,
  //     },
  //     {
  //       type: "divider",
  //     },
  //     {
  //       key: "1",
  //       label: (
  //         <div className={ChatListingStyles.membersArea}>
  //           <div className={ChatListingStyles.membersAreaLeft}>
  //             <img
  //               className={ChatListingStyles.profileAvtar}
  //               src="https://i.pravatar.cc/40"
  //               width="24"
  //               height="24"
  //             />
  //             <div className={ChatListingStyles.profileName}>Prachi Porwal</div>
  //             <span
  //               className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.sales} `}
  //             >
  //               Sales Consultant
  //             </span>
  //           </div>
  //           <span className={ChatListingStyles.removeLink}>Remove</span>
  //         </div>
  //       ),
  //     },
  //     {
  //       key: "2",
  //       label: (
  //         <div className={ChatListingStyles.membersArea}>
  //           <div className={ChatListingStyles.membersAreaLeft}>
  //             <img
  //               className={ChatListingStyles.profileAvtar}
  //               src="https://i.pravatar.cc/40"
  //               width="24"
  //               height="24"
  //             />
  //             <div className={ChatListingStyles.profileName}>Majid Ali</div>
  //             <span
  //               className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.deliveryTeam} `}
  //             >
  //               Delivery Team
  //             </span>
  //           </div>
  //           <span className={ChatListingStyles.removeLink}>Remove</span>
  //         </div>
  //       ),
  //     },
  //     {
  //       key: "3",
  //       label: (
  //         <div className={ChatListingStyles.membersArea}>
  //           <div className={ChatListingStyles.membersAreaLeft}>
  //             <img
  //               className={ChatListingStyles.profileAvtar}
  //               src="https://i.pravatar.cc/40"
  //               width="24"
  //               height="24"
  //             />
  //             <div className={ChatListingStyles.profileName}>Darshan Modi</div>
  //             <span
  //               className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.coeteam} `}
  //             >
  //               COE Team
  //             </span>
  //           </div>
  //         </div>
  //       ),
  //     },
  //     {
  //       key: "4",
  //       label: (
  //         <div className={ChatListingStyles.membersArea}>
  //           <div className={ChatListingStyles.membersAreaLeft}>
  //             <img
  //               className={ChatListingStyles.profileAvtar}
  //               src="https://i.pravatar.cc/40"
  //               width="24"
  //               height="24"
  //             />
  //             <div className={ChatListingStyles.profileName}>Bhuvan Desai</div>
  //           </div>
  //           <span className={ChatListingStyles.removeLink}>Leave Chat</span>
  //         </div>
  //       ),
  //     },
  //     {
  //       type: "divider",
  //     },
  //     {
  //       label: (
  //         <div className={ChatListingStyles.membersArea}>
  //           <div className={ChatListingStyles.membersAreaLeft}>
  //             <FiUserPlusSVG />
  //             <div className={ChatListingStyles.addMembers}>Add Members</div>
  //           </div>
  //           <span>
  //             <FiShareSVG />
  //           </span>
  //         </div>
  //       ),
  //     },
  //   ];

  // const filterData = addMemberListingdata?.data?.details?.filter((item) => {
  //   return (
  //     item?.userName?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //     item?.userID?.toLowerCase()?.includes(search?.toLowerCase())
  //   );
  // });

  // const filterData = data?.filter((item) => {
  //   return item?.isPinned === true;
  // });

  const filterData = addMemberListingdata?.data?.details?.filter((item) => {
    return item?.userName?.toLowerCase()?.includes(search?.toLowerCase());
  });

  return (
    <>
      <div
        className={` ${ChatListingStyles.channelWindowStatus} ${ChatListingStyles.addMembersPopup} `}
      >
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
          <li className={ChatListingStyles.listingLabel}>Recommended</li>
          <li className={ChatListingStyles.memberListing}>
            {filterData?.map((item) => {
              return (
                <div className={ChatListingStyles.membersArea}>
                  <div className={ChatListingStyles.membersAreaLeft}>
                    {/* <img
                              className={ChatListingStyles.profileAvtar}
                              src={}
                              width="24"
                              height="24"
                            /> */}
                    <span className={ChatListingStyles.circle}>
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
                  <div className={ChatListingStyles.radioWrapper}>
                    <input type="radio" name="selectMember" />
                    <span></span>
                  </div>
                </div>
              );
            })}
          </li>
          {filterData?.length === 0 && <p>No Members Found</p>}

          <li>
            <div className={ChatListingStyles.addMembersAreaFooter}>
              <button>Add</button>
            </div>
          </li>
        </ul>
      </div>
      {/* </div> */}
    </>
  );
};

export default AddMembers;
