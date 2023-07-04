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
import { result } from "lodash";
import { ReactComponent as FiShareSVG } from "@SVG/fiShare.svg";
import { ReactComponent as FiCheckSVG } from "@SVG/fiCheck.svg";

firebase.initializeApp(firebaseConfig);

const ShareInvite = ({
  showInvite,
  setShowAddMemberModel,
  showAddMemberModel,
  setShowInvite,
  setHideMemberModel,
}) => {
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
