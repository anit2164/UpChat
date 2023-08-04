import ChatListingStyles from "./chatListing.module.css";
// import { ReactComponent as FiUserPlusSVG } from "@SVG/fiUserPlus.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import React, { useEffect, useState } from "react";
// import { addMemberListingHandler } from "@/redux_toolkit/slices/addMemberListing";
import FiChevronLeftSVG from "../../assets/svg/fiChevronLeft.svg";
import FiShareSVG from "../../assets/svg/fiShare.svg";
import FiCheckSVG from "../../assets/svg/fiCheck.svg";

firebase.initializeApp(firebaseConfig);

const ShareInvite = ({
  showInvite,
  setShowAddMemberModel,
  showAddMemberModel,
  setShowInvite,
  setHideMemberModel,
}: any) => {
  return (
    <>
      <div className={ChatListingStyles.addMembersPopup}>
        <ul className={ChatListingStyles.membersMenuMain}>
          <li className={ChatListingStyles.membersAreaHeader}>
            <FiShareSVG />
            <u>Invite via Link</u>
            <span className={ChatListingStyles.chatWindowBack}>
              <FiChevronLeftSVG
                width="14"
                onClick={() => {
                  // setShowAddMemberModel(true);
                  setShowInvite(!showInvite);
                  setHideMemberModel(true);
                }}
              />
            </span>
          </li>

          <li className={ChatListingStyles.linkLabelMain}>
            <p>Link copied to clipboard</p>
            <p className={ChatListingStyles.linkLabel}>
              <FiCheckSVG /> https://join.upchat.com/OUi8rQ1viNiq
            </p>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ShareInvite;
