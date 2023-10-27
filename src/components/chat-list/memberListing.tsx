import ChatListingStyles from "./chatListing.module.css";
import { Dropdown, Space } from "antd";
import InfoIcon from "../../assets/svg/fiInfo.svg";
import FiUsersSVG from "../../assets/svg/fiUsers.svg";
import FiUserPlusSVG from "../../assets/svg/fiUserPlus.svg";
import FiShareSVG from "../../assets/svg/fiShare.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import React, { useEffect, useState } from "react";
import AddMembers from "./addMembers";
import ShareInvite from "./shareInvite";
import axios from "axios";
// import ShareInvite from "./shareInvite";

firebase.initializeApp(firebaseConfig);

const MemberListing = (allChannelItem: any) => {
  const [userDataList, setUserDataList] = useState<any>();
  const [hideMemberModel, setHideMemberModel] = useState(false);
  const [showAddMemberModel, setShowAddMemberModel] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  var storageToken: any;
  setTimeout(() => {
    storageToken = JSON.parse(localStorage.getItem("apiKey") || "{}");
  }, 0);

  let userName = localStorage.getItem("FullName");
  let employeeId = localStorage.getItem("EmployeeID");

  useEffect(() => {
    setHideMemberModel(false);
  }, [allChannelItem]);

  localStorage.setItem("LoginUserName", "Bhuvan UTS AM qa");
  const loginUser = localStorage.getItem("FullName");

  useEffect(() => {
    try {
      const firestore = firebase.firestore();
      const unsubscribe = firestore
        .collection(
          `ChannelUserMapping/${allChannelItem?.allChannelItem?.enc_channelID}/user`
        )
        .onSnapshot((snapshot) => {
          const userData: any = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setUserDataList(userData);
        });
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, [allChannelItem]);

  const getRandomColor = () => {
    const colors = [
      ChatListingStyles.blueThumb,
      ChatListingStyles.darkRedThumb,
      ChatListingStyles.greenThumb,
      ChatListingStyles.yellowThumb,
      ChatListingStyles.orangeThumb,
      ChatListingStyles.skyBlueThumb,
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  // Remove Members API
  const removeMemberAPI = async (item: any) => {
    let tempObj = [
      {
        userName: item?.userName,
        userEmpID: item?.userEmpId,
      },
    ];
    // Remove For 2 and leave for 3
    try {
      const data = {
        channelID: allChannelItem?.allChannelItem.enc_channelID,
        channelActionID: item?.userName === loginUser ? 3 : 2,
        actionPerformBy_UserName: userName,
        actionPerformBy_UserEmpID: employeeId,
        createdByID: 0,
        userDetails: tempObj,
      };
      const response = await axios.post(
        "http://3.218.6.134:9096/User/UpdateUserHistory",
        data,
        {
          headers: {
            Authorization: storageToken,
            "X-API-KEY": "QXBpS2V5TWlkZGxld2FyZQ==",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removerMember = async (item: any) => {
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection(
        `ChannelUserMapping/${allChannelItem?.allChannelItem?.enc_channelID}/user`
      );
      const snapshot = collectionRef.doc(item?.id);
      await snapshot.delete();
      let _data = await collectionRef.get();
      const dataArray = _data?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHideMemberModel(true);
    } catch (error) {
      console.error(error);
    }
    removeMemberAPI(item);
  };

  let initials;
  const userInitial = (item: any) => {
    item = item.trimStart();
    if (item?.split(" ").length > 1) {
      let firstName = item?.split(" ")?.[0];
      let lastName = item?.split(" ")?.[1];
      item = firstName + " " + lastName;
      initials = item
        ?.split(" ")
        .reduce((acc: any, subname: any) => acc + subname[0], "");
      return initials;
    } else {
      return item.substring(0, 2);
    }
  };

  return (
    <>
      <div className={ChatListingStyles.channelWindowStatus}>
        <div className={ChatListingStyles.channelStatusLeft}>
          HR Status: {allChannelItem?.allChannelItem?.hrStatus}
        </div>
        <div className={ChatListingStyles.channelStatusRight}>
          <div className={ChatListingStyles.membersMenuMainHeader}>
            <span>{userDataList?.length} members</span>
            <InfoIcon
              className={ChatListingStyles.infoActive}
              onClick={() => {
                setHideMemberModel(!hideMemberModel);
              }}
            />
          </div>
          {hideMemberModel && (
            <ul className={ChatListingStyles.membersMenuMain}>
              <li className={ChatListingStyles.membersAreaHeader}>
                <FiUsersSVG />
                {userDataList?.length} Members
                <span
                  className={ChatListingStyles.chatWindowClose}
                  onClick={() => {
                    setHideMemberModel(!hideMemberModel);
                  }}
                ></span>
              </li>
              <li className={ChatListingStyles.memberListing}>
                {userDataList?.map((item: any) => {
                  return (
                    <>
                      <div className={ChatListingStyles.membersArea}>
                        <div className={ChatListingStyles.membersAreaLeft}>
                          {/* <img
                            className={ChatListingStyles.profileAvtar}
                            src={}
                            width="24"
                            height="24"
                          /> */}
                          <span
                            className={` ${ChatListingStyles.circle
                              }`}
                            style={{
                              background: item?.backGroudColor,
                              color: item?.fontColor,
                            }}
                          >
                            {userInitial(item?.userName)}
                          </span>
                          <div className={ChatListingStyles.profileName}>
                            {item?.userName}
                          </div>
                          {item?.userDesignation && (
                            <span
                              className={` ${ChatListingStyles.profileDesignation}`}
                              style={{
                                background: item?.backGroudColor,
                                color: item?.fontColor,
                              }}
                            >
                              {item?.userDesignation}
                            </span>
                          )}
                        </div>
                        <span
                          className={ChatListingStyles.removeLink}
                          onClick={() => {
                            removerMember(item);
                          }}
                        >
                          {item?.userName === loginUser
                            ? "Leave Chat"
                            : "Remove"}
                        </span>
                      </div>
                    </>
                    // </div>
                  );
                })}
                {userDataList?.length === 0 && (
                  <span className={ChatListingStyles.noDataFound}>
                    No members found
                  </span>
                )}
              </li>
              <li>
                <div className={ChatListingStyles.membersAreaFooter}>
                  <div className={ChatListingStyles.membersAreaLeft}>
                    <FiUserPlusSVG />
                    <div
                      className={ChatListingStyles.addMembers}
                      onClick={() => {
                        setShowAddMemberModel(!showAddMemberModel);
                        setHideMemberModel(false);
                      }}
                    >
                      Add Members
                    </div>
                  </div>
                  <span
                    className={ChatListingStyles.shareButton}
                    onClick={() => {
                      setShowInvite(!showInvite);
                      setHideMemberModel(false);
                    }}
                  >
                    <FiShareSVG />
                  </span>
                </div>
              </li>
            </ul>
          )}
          {showAddMemberModel && (
            <AddMembers
              showAddMemberModel={showAddMemberModel}
              setShowAddMemberModel={setShowAddMemberModel}
              setHideMemberModel={setHideMemberModel}
              allChannelItem={allChannelItem}
              userDataList={userDataList}
            />
          )}
          {showInvite && (
            <ShareInvite
              showAddMemberModel={showAddMemberModel}
              showInvite={showInvite}
              setShowAddMemberModel={setShowAddMemberModel}
              setShowInvite={setShowInvite}
              setHideMemberModel={setHideMemberModel}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MemberListing;
