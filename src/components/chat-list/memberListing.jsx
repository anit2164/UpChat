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

firebase.initializeApp(firebaseConfig);

const MemberListing = (allChannelItem) => {
  const [userDataList, setUserDataList] = useState();

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

  return (
    <>
      <div className={ChatListingStyles.channelWindowStatus}>
        <div className={ChatListingStyles.channelStatusLeft}>
          HR Status: In Process
        </div>
        <div className={ChatListingStyles.channelStatusRight}>
          <div className={ChatListingStyles.membersMenuMainHeader}>
            <span>6 members</span>
            <InfoIcon className={ChatListingStyles.infoActive} />
          </div>
          <ul className={ChatListingStyles.membersMenuMain}>
            <li className={ChatListingStyles.membersAreaHeader}>
              <FiUsersSVG />6 Members
              <span className={ChatListingStyles.chatWindowClose}></span>
            </li>
            {/* <li></li> */}
            <li className={ChatListingStyles.membersArea}>
              {userDataList?.map((item) => {
                return (
                  // <div className={ChatListingStyles.}>
                  <div className={ChatListingStyles.membersAreaLeft}>
                    <img
                      className={ChatListingStyles.profileAvtar}
                      src="https://i.pravatar.cc/40"
                      width="24"
                      height="24"
                    />
                    <div className={ChatListingStyles.profileName}>
                      {item?.userName}
                    </div>
                    <span
                      className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.coeteam} `}
                    >
                      {item?.userDesignation}
                    </span>
                    <span className={ChatListingStyles.removeLink}>Remove</span>
                  </div>
                  // </div>
                );
              })}
            </li>
            <li>
              <div className={ChatListingStyles.membersArea}>
                <div className={ChatListingStyles.membersAreaLeft}>
                  <FiUserPlusSVG />
                  <div className={ChatListingStyles.addMembers}>
                    Add Members
                  </div>
                </div>
                <span>
                  <FiShareSVG />
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MemberListing;
