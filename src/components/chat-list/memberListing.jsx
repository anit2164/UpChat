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
import AddMembers from "./addMembers";
import ShareInvite from "./shareInvite";

firebase.initializeApp(firebaseConfig);

const MemberListing = (allChannelItem) => {
  const [userDataList, setUserDataList] = useState();
  const [hideMemberModel, setHideMemberModel] = useState(false);
  const [showAddMemberModel, setShowAddMemberModel] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    setHideMemberModel(false);
  }, [allChannelItem]);

  useEffect(() => {
    try {
      const firestore = firebase.firestore();
      const unsubscribe = firestore
        .collection(
          `ChannelUserMapping/${allChannelItem?.allChannelItem?.id}/user`
        )
        .onSnapshot((snapshot) => {
          const userData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
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

  const removerMember = async (id) => {
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection(
        `ChannelUserMapping/${allChannelItem?.allChannelItem?.id}/user`
      );
      const snapshot = collectionRef.doc(id);
      await snapshot.delete();
      let _data = await collectionRef.get();
      const dataArray = _data?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={ChatListingStyles.channelWindowStatus}>
        <div className={ChatListingStyles.channelStatusLeft}>
          HR Status: In Process
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
                {userDataList?.map((item) => {
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
                            className={` ${
                              ChatListingStyles.circle
                            } ${getRandomColor()} `}
                          >
                            {item?.userInitial}
                          </span>
                          <div className={ChatListingStyles.profileName}>
                            {item?.userName}
                          </div>
                          <span
                            className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.coeteam} `}
                          >
                            {item?.userDesignation}
                          </span>
                        </div>
                        <span
                          className={ChatListingStyles.removeLink}
                          onClick={() => {
                            removerMember(item?.id);
                          }}
                        >
                          Remove
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
