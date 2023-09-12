import ChatListingStyles from "./chatListing.module.css";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,

} from "react";
import Collapse from "../../components/collapsible/collapsible.components";
import Header from "../header/header.components";
import UpTabs from "../../components/upTabs/upTabs.components";
import { Dropdown, Space, message } from "antd";
import SendIcon from "../../assets/svg/fiSend.svg";
import SearchIcon from "../../assets/svg/search.svg";
// import ArrowIcon from "@SVG/fiArrowRight.svg";
import SmileIcon from "../../assets/svg/fiSmile.svg";
import SmileIcon1 from "../../assets/svg/smileIcon-1.svg";
import SmileIcon2 from "../../assets/svg/smileIcon-2.svg";
import SmileIcon3 from "../../assets/svg/smileIcon-3.svg";
import SmileIcon4 from "../../assets/svg/smileIcon-4.svg";
import SmileIcon5 from "../../assets/svg/smileIcon-5.svg";
import SmileIcon6 from "../../assets/svg/smileIcon-6.svg";
import BookmarkIconDark from "../../assets/svg/bookmarkIconDark.svg";
import FiBookOpenSVG from "../../assets/svg/fiBookOpen.svg";
import FiFilmSVG from "../../assets/svg/fiFilm.svg";
import FiVolumeMuteSVG from "../../assets/svg/fiVolumeMute.svg";
import FiReplySVG from "../../assets/svg/fiReply.svg";
import FiCopySVG from "../../assets/svg/fiCopy.svg";
import FiBookmarkOutlinedSVG from "../../assets/svg/fiBookmarkOutlined.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
// import { useDispatch, useSelector } from "react-redux";
import { sendMessageHandler } from "../../redux_toolkit/slices/sendMessage";
import MemberListing from "./memberListing";
import ScrollToBottomSVG from "../../assets/svg/scrollToBottom.svg";
import { ChannelMenu } from "../../constants/application";
// import { Provider } from "react-redux";
// import Tile from "../tile/tile.components";
import store from "../../redux_toolkit/store/store";
import moment from "moment";
import MyContext from "./myContext";
import axios from "axios";
import ShowMoreText from "react-show-more-text";
import DOMPurify from "dompurify";


firebase.initializeApp(firebaseConfig);

const ChatListing = ({
  showChatList,
  pinnedChatsDetails,
  listingChats,
  snoozeChatsDetails,
  allChannelItem,
  showChat,
  showPinnedChatsList,
  showSnoozeChatsList,
  updateChannel,
  setShowList,
  setShowPinnedChatsList,
  setShowSnoozeChatsList,
  activeUser,
  setActiveUser,
  setAllChannelItem,
  setPinnedChatsItem,
  updateChannelDateTime,
  setIsTileChat,
  setIsPinChat,
  setUpChat,
  upChat,
}: any) => {
  // const dispatch: any = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [messageHandler, setMessageHandler] = useState("");
  const [smileIcon, setSmileIcon] = useState(false);
  const [chatMapKey, setChatMapKey] = useState();
  const [replyMessageSection, setReplyMessageSection] = useState(false);
  const [search, setSearch] = useState("");
  const [senderClass, setSenderClass] = useState(false);
  const [memberRead, setMemberRead] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const [scrollDown, setScrollDown] = useState(false);
  const [searchInChat, setSearchInChat] = useState(false);
  const [username, setUsername] = useState("");
  const [loggeInUserDesignation, setLoggedInUserDesignation] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountPinned, setTotalCountPinned] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [showUpChat, setShowUpChat] = useState<any>(false);
  const [mentionMembers, setMentionMembers] = useState([]);
  const [memberFilter, setMemberFilter] = useState([]);
  const [isTagged, setIstagged] = useState(false);
  const [tileChat, setTileChat] = useState(false);
  const [pinChat, setPinChat] = useState(false);
  const [replyMessage, setReplyMessage] = useState<any>({});

  const firestore = firebase.firestore();

  const bottomToTopRef: any = useRef(null);
  const arrawScroll = useRef(null);
  const commentRef: any = useRef();
  const sanitizer = DOMPurify.sanitize;
  let currentChatDate: any = null;



  const loginUserId = localStorage.getItem("EmployeeID");
  var storageToken: any;
  setTimeout(() => {
    storageToken = JSON.parse(localStorage.getItem("apiKey") || "{}");
  }, 0);

  let name: any = loginUserId;
  let initials1 = name
    ?.split(" ")
    .reduce((acc: any, subname: any) => acc + subname[0], "");

  let lastChatMessage;

  const channelMainDropdown: any = [
    {
      label: ChannelMenu.SEARCH_IN_CHAT,
      key: ChannelMenu.SEARCH_IN_CHAT,
      icon: <SearchIcon />,
    },
    {
      label: ChannelMenu.BOOKMARKS,
      key: ChannelMenu.BOOKMARKS,
      icon: <FiBookmarkOutlinedSVG width="12" />,
    },
    {
      label: ChannelMenu.CHANNEL_LIBRARY,
      key: ChannelMenu.CHANNEL_LIBRARY,
      icon: <FiBookOpenSVG />,
    },
    {
      label: ChannelMenu.VIEW_HR_DETAILS,
      key: ChannelMenu.VIEW_HR_DETAILS,
      icon: <FiFilmSVG />,
    },
    // {
    //   type: "divider",
    // },
    // {
    //   label: ChannelMenu.SNOOZE,
    //   key: ChannelMenu.SNOOZE,
    //   icon: <FiVolumeMuteSVG />,
    // },
  ];

  const chatDropdown = [
    {
      label: ChannelMenu.REPLY,
      key: ChannelMenu.REPLY,
      icon: <FiReplySVG width="16" />,
    },
    {
      label: ChannelMenu.COPY,
      key: ChannelMenu.COPY,
      icon: <FiCopySVG width="16" />,
    },
    {
      label: ChannelMenu.BOOKMARKS,
      key: ChannelMenu.BOOKMARKS,
      icon: <FiBookmarkOutlinedSVG />,
    },
  ];

  const scrollToBottom = () => {
    bottomToTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setScrollDown(false);
  };

  let getSenderName: any = "";

  const currentDate = new Date();
  const currentTimeIST = currentDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  useEffect(() => {
    const loggedInData = JSON.parse(
      localStorage.getItem("userSessionInfo") || "{}"
    );
    const designation = localStorage.getItem("UserDesignation") || "{}";
    setUsername(loggedInData?.FullName);
    setLoggedInUserDesignation(designation);
  }, []);

  const date = new Date();
  const formattedTime = date.toUTCString();

  const createCollection = async (data: any) => {
    try {
      // const firestore = firebase.firestore();
      const collectionRef = firestore.collection(
        `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats/${data}/user_chats/`
      );

      for (let i = 0; i < userDataList.length; i++) {
        await collectionRef.add(userDataList[i]);
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const sendMessageAPI = async () => {
    try {
      const data = {
        id: allChannelItem?.hrID,
        note: commentRef.current.innerHTML.replace(/\s+/g, " "),
      };

      const response = await axios.post(
        "http://3.218.6.134:9082/ViewAllHR/UpChatSaveHRNotes",
        data,
        {
          headers: {
            Authorization: storageToken,
            // Authorization:
            //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkNoYXRVc2VyX0FuaXQiLCJMb2dpblVzZXJJZCI6IjEwNDYyIiwiTG9naW5Vc2VyVHlwZUlkIjoiNCIsIm5iZiI6MTY5MTQ3Mzg5MCwiZXhwIjoxNjkxNTA5ODkwLCJpYXQiOjE2OTE0NzM4OTB9.MEbqmQcu4h2Kgmbpd0Jmxr_c1F_eP3Lq5WYtRIl7Hbk",
            "X-API-KEY": "QXBpS2V5TWlkZGxld2FyZQ==",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const sendMessage = async (e: any) => {
    if (messageHandler || commentRef.current.innerText.length > 0) {
      setMessageHandler("");
      sendMessageAPI();
      setSenderClass(true);
      setScrollDown(true);
      try {
        let obj = {
          date: new Date(),
          documentUrl: "",
          enc_chatID: "",
          hrID: allChannelItem?.hrID,
          isActivity: false,
          senderEmpID: replyMessageSection === true ? loginUserId : "",
          text: commentRef.current.innerText,
          isNotes: true,
          remark: "",
          senderDesignation: loggeInUserDesignation,
          senderName: username,
          talentName: "",
          Replied: replyMessageSection === true
            ? commentRef.current.innerText.trim()
            : "",
          isRepliedTo: replyMessageSection === true ? "Shreyash Zinzuvadia" : "",
          msgRepliedId: "",
          userInitial: initials1,
          reply_enc_ID:
            replyMessageSection === true ? replyMessage?.enc_chatID : "",
        };
        let apiObj = {
          id: allChannelItem?.hrID,
          note: messageHandler,
        };
        // const firestore = firebase.firestore();
        commentRef.current.innerText = "";
        setReplyMessageSection(false);
        setReplyMessage({});

        const collectionRef = firestore.collection(
          `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats`
        );
        const tempEnc_ID: any = await collectionRef.add(obj);
        obj.enc_chatID = replyMessageSection === true ? tempEnc_ID.id : tempEnc_ID.id;
        obj.msgRepliedId = replyMessageSection === true ? tempEnc_ID.id : "";
        const snapshot = collectionRef.doc(tempEnc_ID.id);

        await snapshot.set(obj);
        await collectionRef.get();

        scrollToBottom();
        // updateChannel(new Date());
        updateChannelDateTime(allChannelItem?.enc_channelID);
        createCollection(tempEnc_ID.id);
        // dispatch(sendMessageHandler(apiObj));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (messageHandler || commentRef.current.innerText.length > 0) {
        setMessageHandler("");
        sendMessageAPI();
        setSenderClass(true);
        setScrollDown(true);
        try {
          let obj = {
            date: new Date(),
            documentUrl: "",
            enc_chatID: "",
            hrID: allChannelItem?.hrID,
            isActivity: false,
            senderEmpID: replyMessageSection === true ? loginUserId : "",
            text: commentRef.current.innerText,
            isNotes: true,
            remark: "",
            senderDesignation: loggeInUserDesignation,
            senderName: username,
            talentName: "",
            Replied: replyMessageSection === true
              ? commentRef.current.innerText.trim()
              : "",
            isRepliedTo: replyMessageSection === true ? "Shreyash Zinzuvadia" : "",
            msgRepliedId: "",
            userInitial: initials1,
            reply_enc_ID:
              replyMessageSection === true ? replyMessage?.enc_chatID : "",
          };
          let apiObj = {
            id: allChannelItem?.hrID,
            note: messageHandler,
          };
          commentRef.current.innerText = "";
          setReplyMessageSection(false);
          setReplyMessage({});

          const collectionRef = firestore.collection(
            `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats`
          );

          const tempEnc_ID: any = await collectionRef.add(obj);
          // obj.enc_chatID = tempEnc_ID.id;
          obj.enc_chatID = replyMessageSection === true ? tempEnc_ID.id : tempEnc_ID.id;
          obj.msgRepliedId = replyMessageSection === true ? tempEnc_ID.id : "";
          const snapshot = collectionRef.doc(tempEnc_ID.id);

          await snapshot.set(obj);
          await collectionRef.get();


          scrollToBottom();
          // updateChannel(new Date());
          updateChannelDateTime(allChannelItem?.enc_channelID);
          createCollection(tempEnc_ID.id);
          // dispatch(sendMessageHandler(apiObj));
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  useEffect(() => {
    if (
      showChat === true ||
      showPinnedChatsList === true ||
      showSnoozeChatsList === true
    ) {
      scrollToBottom();
      setScrollDown(false);
    }
  }, [showChat, listingChats]);

  const filterData = listingChats?.filter((item: any) => {
    return item?.text?.toLowerCase()?.includes(search?.toLowerCase());
  });
  if (filterData) {
    lastChatMessage = filterData.slice(-1);
  }

  const handleScroll = () => {
    const divElement: any = arrawScroll.current;
    if (
      divElement?.scrollHeight -
      divElement?.scrollTop -
      divElement?.clientHeight <
      filterData?.length
    ) {
      setScrollDown(true);
    } else {
      setScrollDown(false);
    }
  };
  const closeModal = () => {
    if (upChat == "tilechat") {
      setIsTileChat(false);
      setTileChat(false);
      setUpChat("");
    } else if (upChat == "pinchat") {
      setIsPinChat(false);
      setPinChat(false);
      setUpChat("");
    }
  };
  const closeReplyMessage = () => {
    setReplyMessageSection(false);
  };

  useEffect(() => {
    try {
      const unsubscribe = firestore
        .collection(`ChannelUserMapping/${allChannelItem?.enc_channelID}/user`)
        .onSnapshot((snapshot) => {
          const userData: any = snapshot.docs.map((doc) => {
            const userEmpId = doc.get("userEmpId");
            return {
              // id: doc.id,
              enc_channelID: allChannelItem?.enc_channelID,
              isRead: loginUserId === userEmpId ? true : false,
              userEmpID: userEmpId,
              IsBookMark: false,
            };
          });
          setUserDataList(userData);
        });
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, [allChannelItem]);

  const chatListDropdown = (value: any) => {
    if (value.key === ChannelMenu.VIEW_HR_DETAILS) {
      window.open(
        `http://3.218.6.134:9093/allhiringrequest/${allChannelItem?.hrID}`,
        "_blank"
      );
    }
    if (value.key === ChannelMenu.SEARCH_IN_CHAT) {
      setSearchInChat(true);
    }
  };

  const GFG_Fun1 = (time: any) => {
    var utcSeconds = time;
    var d = new Date(0);
    const data = new Date(d.setUTCSeconds(utcSeconds));
    return moment(data).format("DD-MM-YYYY");
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

  const chatListDropdownInChat = async (value: any, item: any) => {
    if (
      value.key === ChannelMenu.COPY &&
      window.isSecureContext &&
      navigator.clipboard
    ) {
      await navigator.clipboard.writeText(item.text
        .replace(/&nbsp;/g, " ")
        .replace(/<span[^>]*>(.*?)<\/span>/g, "$1")
        .replace(/\s+/g, " "));
      messageApi.open({
        type: "success",
        content: "Message coppied successfully",
      });
    }
    if (value.key === ChannelMenu.REPLY) {
      setReplyMessageSection(true);
      setReplyMessage(item);
    }
  };

  useEffect(() => {
    try {
      const firestore = firebase.firestore();
      const unsubscribe = firestore
        .collection(`ChannelUserMapping/${allChannelItem?.enc_channelID}/user`)
        .onSnapshot((snapshot) => {
          const userData: any = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // setUserDataList(userData);
          setMemberFilter(userData);
        });
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, [allChannelItem]);

  // const metionUser = (e: any) => {
  //   if (e.target.value.includes("@")) {
  //     setIstagged(true);
  //     let tempShowUserName = e.target.value.slice(1);
  //     let memberFilteredData = memberFilter.filter((item: any) => {
  //       return item?.userName
  //         .toLowerCase()
  //         .includes(tempShowUserName.toLowerCase());
  //     });
  //     setMentionMembers(memberFilteredData);
  //     // if (messageHandler.includes("@")) {
  //     // setIstagged(false);
  //     // }
  //   } else {
  //     setMentionMembers([]);
  //     setIstagged(false);
  //   }
  // };

  // const taggedMembers = (value: any) => {
  //   setMessageHandler("@" + value.userName);
  //   setIstagged(false);
  // };

  const onKeyPressHandler = (e: any) => {
    let tempString = commentRef.current.innerText;
    if (e.ctrlKey && e.which === 65) {
      setIstagged(false);
    }
    if (tempString.length === 0) setIstagged(false);
    if (e.shiftKey && e.which === 50) {
      setIstagged(true);
    } else if (e.which === 8) {
      if (
        tempString[tempString.length - 1] === "@" ||
        tempString[tempString.length] === 0
      )
        setIstagged(false);
      else if (tempString.length > 0 && tempString.includes("@"))
        setIstagged(true);
      else if (tempString.length > 0 && !tempString.includes("@"))
        setIstagged(false);
    }
  };

  const nameRegex = new RegExp(
    mentionMembers?.map((item: any) => item.userName).join("|"),
    "g"
  );


  const displayNotes = (notes: any) => {
    const notesTemplate = new DOMParser().parseFromString(notes, "text/html");
    return notesTemplate.body;
  };
  const ReplyMessage = (value: any) => {
    const infoTemp = filterData.filter((item: any) => {
      return item?.enc_chatID == value;
    });
    return infoTemp;
  };

  return (
    <>
      {/* <Provider store={store}> */}
      {contextHolder}
      {!(showChatList || pinnedChatsDetails || snoozeChatsDetails) && (
        <main className={`${ChatListingStyles.main} ${toggle ? ChatListingStyles.chatListingExpanded : ""
          } ${toggle ? "" : ChatListingStyles.chatListingCollapsed}`}>
          {toggle && (
            <>
              {/* <MyContext.Provider
                value={{
                  totalCount,
                  setTotalCount,
                  totalCountPinned,
                  setTotalCountPinned,
                }}
              >
                <Header setToggle={setToggle} />
                <UpTabs />
              </MyContext.Provider> */}
              <MyContext.Provider
                value={{
                  totalCount,
                  setTotalCount,
                  totalCountPinned,
                  setTotalCountPinned,
                  showUpChat,
                  setShowUpChat,
                  pinChat,
                  setPinChat,
                  tileChat,
                  setTileChat,
                }}
              >
                {/* <main className={ChatListingStyles.main}> */}
                {toggle && (
                  <>
                    <Header
                      setToggle={setToggle}
                      showUpChat={showUpChat}
                      setShowUpChat={setShowUpChat}
                    />
                    <UpTabs />
                  </>
                )}
                <Collapse
                  setToggle={setToggle}
                  toggle={toggle}
                  showUpChat={showUpChat}
                  setShowUpChat={setShowUpChat}
                />
                {/* </main> */}
              </MyContext.Provider>
            </>
          )}

          <Collapse setToggle={setToggle} toggle={toggle} showUpChat={showUpChat}
            setShowUpChat={setShowUpChat} />
        </main>
      )}

      {(showChatList || pinnedChatsDetails || snoozeChatsDetails) && (
        <div
          className={` ${ChatListingStyles.channelWindow} ${ChatListingStyles.chatListingWindow} `}
        >
          <div className={ChatListingStyles.channelWindowHeader}>
            <div className={ChatListingStyles.channelHeaderLeft}>
              <div
                className={` ${ChatListingStyles.chatInitialThumb} ${ChatListingStyles.blueThumb} `}
              >
                {allChannelItem?.companyInitial}
              </div>
              <div className={ChatListingStyles.channelName}>
                <div>
                  {allChannelItem?.role} | {allChannelItem?.companyName}
                </div>
                <div>{allChannelItem?.hrNumber}</div>
              </div>
            </div>
            <div className={ChatListingStyles.channelHeaderRight}>
              <Dropdown
                className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                placement="bottomRight"
                menu={{
                  items: channelMainDropdown,
                  onClick: (value) => {
                    chatListDropdown(value);
                  },
                }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <span className={ChatListingStyles.dotMenu}></span>
                  </Space>
                </a>
              </Dropdown>
              <span
                className={ChatListingStyles.chatWindowClose}
                onClick={closeModal}
              ></span>
            </div>
          </div>
          <MemberListing allChannelItem={allChannelItem} />
          <div
            className={ChatListingStyles.channelWindowInner}
            ref={arrawScroll}
            onScroll={handleScroll}
          >
            {searchInChat === true && (
              <div className={ChatListingStyles.searchInChatWrapper}>
                <div className={ChatListingStyles.searchInChatInner}>
                  <>
                    <SearchIcon className={ChatListingStyles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search in chat"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                    {search?.length !== 0 && (
                      <span
                        className={ChatListingStyles.closeIcon}
                        onClick={() => {
                          setSearch("");
                          setSearchInChat(false);
                        }}
                      ></span>
                    )}
                  </>
                </div>
              </div>
            )}

            {/* <span className={ChatListingStyles.numberOfSearch}>
                  <span className={ChatListingStyles.arrowIcon}>
                    <ArrowIcon />
                  </span>
                  3/17
                  <span className={ChatListingStyles.arrowIconRight}>
                    <ArrowIcon />
                  </span>
                </span> */}

            <div
              className={ChatListingStyles.channelWindowMessages}
              id="content"
            >
              {filterData?.map((item: any, key: any) => {


                const messageDate = item?.date?.seconds
                  ? new Date(item?.date?.seconds * 1000)
                  : null;

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                let dateString = "";
                if (messageDate) {
                  if (messageDate.toDateString() === today.toDateString()) {
                    dateString = "Today";
                  } else if (
                    messageDate.toDateString() === yesterday.toDateString()
                  ) {
                    dateString = "Yesterday";
                  } else {
                    dateString = messageDate.toDateString();
                  }
                }

                const showDateSeparator = dateString !== currentChatDate;
                currentChatDate = dateString; // Update currentDate


                return (
                  <>
                    {showDateSeparator && (
                      <div className={ChatListingStyles.divider}>
                        <span>{dateString}</span>
                      </div>
                    )}
                    {item?.isActivity === true && item?.isNotes == false ? (
                      <div className={ChatListingStyles.channelMessageWrapper}>
                        <div
                          className={ChatListingStyles.channelMessageMain}
                          ref={bottomToTopRef}
                        >
                          <div
                            className={ChatListingStyles.systemGeneratedHeader}
                          >
                            <span>
                              {item?.text} | Action By: {item?.senderName}
                            </span>
                            <span
                              className={ChatListingStyles.systemGeneratedDate}
                            >
                              {GFG_Fun1(item?.date?.seconds)} |{" "}
                              {item?.date?.seconds
                                ? new Date(item?.date?.seconds * 1000)
                                  .toLocaleTimeString()
                                  .replace(
                                    /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                    "$1$3"
                                  )
                                : item?.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : item?.isNotes === true && item?.isActivity === true ? (
                      <div className={ChatListingStyles.channelMessageWrapper}>
                        <div
                          className={` ${ChatListingStyles.channelMessageMain} ${ChatListingStyles.systemGeneratedMain} ${ChatListingStyles.lightGreyBg} `}
                        >
                          <div
                            className={ChatListingStyles.systemGeneratedHeader}
                          >
                            <span>Action By: {item.senderName}</span>
                            <span
                              className={ChatListingStyles.systemGeneratedDate}
                            >
                              {GFG_Fun1(item?.date?.seconds)} |{" "}
                              {item?.date?.seconds
                                ? new Date(item?.date?.seconds * 1000)
                                  .toLocaleTimeString()
                                  .replace(
                                    /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                    "$1$3"
                                  )
                                : item?.date}
                            </span>
                          </div>
                          <div
                            className={ChatListingStyles.systemGeneratedIsNotes}
                          >
                            <span>
                              <ShowMoreText
                                lines={1}
                                more="read more"
                                less="read less"
                                className="content-css"
                                anchorClass={
                                  ChatListingStyles.show_more_less_clickable
                                }
                                // onClick={executeOnClick}
                                expanded={false}
                                width={280}
                                truncatedEndingComponent={"... "}
                              >
                                {/* {item?.text} */}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizer(
                                      displayNotes(item?.text).innerHTML
                                    ),
                                  }}
                                ></span>
                              </ShowMoreText>
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : item?.reply_enc_ID ? (
                      ReplyMessage(item.reply_enc_ID)?.length > 0 && (
                        <div className={ChatListingStyles.channelMessageMain}>
                          <div
                            className={ChatListingStyles.channelMessageInner}
                          >
                            <div
                              className={` ${ChatListingStyles.circleAvtar} ${ChatListingStyles.blueThumb} `}
                            >
                              {userInitial(item?.senderName)}
                            </div>
                            {/* <img
                                className={ChatListingStyles.profileAvtar}
                                src="https://i.pravatar.cc/40"
                                width="30"
                                height="30"
                              /> */}
                            <div className={ChatListingStyles.profileName}>
                              {item?.senderName}
                            </div>
                            <span
                              className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.sales} `}
                            >
                              {item?.senderDesignation}
                            </span>
                            <span className={ChatListingStyles.timeStamp}>
                              {item?.date?.seconds
                                ? new Date(item?.date?.seconds * 1000)
                                  .toLocaleTimeString()
                                  .replace(
                                    /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                    "$1$3"
                                  )
                                : item?.date}
                            </span>
                            <Dropdown
                              className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                              placement="bottomRight"
                              menu={{
                                items: chatDropdown,
                                onClick: (value) => {
                                  chatListDropdownInChat(value, item);
                                },
                              }}
                              trigger={["click"]}
                            >
                              <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                  <span
                                    className={ChatListingStyles.dotMenu}
                                  ></span>
                                </Space>
                              </a>
                            </Dropdown>

                            {/* {showBookMark?.IsBookMark === true ? (
                              <BookmarkIconSVG
                                className={ChatListingStyles.bookmarkIcon}
                              />
                            ) : (
                              ""
                            )} */}
                          </div>
                          <div className={ChatListingStyles.channelMessageBoxWrap}>
                            <div
                              className={` ${ChatListingStyles.channelMessageBox} ${ChatListingStyles.channelMessageRight} `}
                            >
                              <div className={ChatListingStyles.quotedMessage}>
                                <p>
                                  {ReplyMessage(item?.enc_chatID)?.[0]?.Replied}
                                </p>
                                <div
                                  className={ChatListingStyles.quotedMessageChild}
                                >
                                  <FiReplySVG width="10" height="16" />
                                  {ReplyMessage(item?.enc_chatID)?.[0]?.senderName}
                                  <span>Today at 12:31PM</span>
                                </div>
                              </div>
                              <p>{item?.text}</p>
                              <div className={ChatListingStyles.chatReaction}>
                                <div
                                  className={ChatListingStyles.chatReactionInner}
                                >
                                  <div
                                    className={ChatListingStyles.chatReactionCircle}
                                  >
                                    {/* <span
                                 className={
                                   ChatListingStyles.chatReactionSmile
                                 }
                               >
                                 {/ <SmileIcon /> /}
                               </span> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>


                      )
                    ) : (
                      <div className={ChatListingStyles.channelMessageWrapper}>
                        <div
                          className={ChatListingStyles.channelMessageMain}
                          ref={bottomToTopRef}
                        >
                          <div className={ChatListingStyles.channelMessageInner}>
                            <div
                              className={` ${ChatListingStyles.circleAvtar} ${ChatListingStyles.blueThumb} `}
                            >
                              {userInitial(item?.senderName)}
                            </div>
                            {/* <img
                              className={ChatListingStyles.profileAvtar}
                              src="https://i.pravatar.cc/40"
                              width="30"
                              height="30"
                            /> */}
                            <div className={ChatListingStyles.profileName}>
                              {item?.senderName}
                            </div>
                            <span
                              className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.sales} `}
                            >
                              {item?.senderDesignation}
                            </span>
                            <span className={ChatListingStyles.timeStamp}>
                              {item?.date?.seconds
                                ? new Date(item?.date?.seconds * 1000)
                                  .toLocaleTimeString()
                                  .replace(
                                    /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                    "$1$3"
                                  )
                                : item?.date}
                            </span>
                            <Dropdown
                              className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                              placement="bottomRight"
                              menu={{
                                items: chatDropdown,
                                onClick: (value) => {
                                  chatListDropdownInChat(
                                    value,
                                    item
                                  );
                                },
                              }}
                              trigger={["click"]}
                            >
                              <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                  <span
                                    className={ChatListingStyles.dotMenu}
                                  ></span>
                                </Space>
                              </a>
                            </Dropdown>
                          </div>
                          <div
                            className={` ${ChatListingStyles.channelMessageBox} ${username === item?.senderName
                              ? ChatListingStyles.channelMessageRight
                              : "null"
                              } `}
                            dangerouslySetInnerHTML={{
                              __html: sanitizer(
                                displayNotes(item?.text).innerHTML
                              ),
                            }}
                          >
                            {/* <p
                              dangerouslySetInnerHTML={{
                                __html: item.text.replace(
                                  nameRegex,
                                  (match: any) => `<b>${match}</b>`
                                ),
                              }}
                            >

                            </p> */}
                            {/* <div className={ChatListingStyles.chatReaction}>
                              <div
                                className={ChatListingStyles.chatReactionInner}
                              >
                                {chatMapKey === key && smileIcon && (
                                  <div
                                    className={
                                      ChatListingStyles.chatReactionPopup
                                    }
                                  >
                                    <span>
                                      <SmileIcon1 />
                                    </span>
                                    <span>
                                      <SmileIcon2 />
                                    </span>
                                    <span>
                                      <SmileIcon3 />
                                    </span>
                                    <span>
                                      <SmileIcon4 />
                                    </span>
                                    <span>
                                      <SmileIcon5 />
                                    </span>
                                    <span>
                                      <SmileIcon6 />
                                    </span>
                                    <span
                                      className={ChatListingStyles.addNewEmoji}
                                    ></span>
                                  </div>
                                )}
                                <div
                                  className={
                                    ChatListingStyles.chatReactionCircle
                                  }
                                  onClick={() => {
                                    setSmileIcon(!smileIcon);
                                    setChatMapKey(key);
                                  }}
                                >
                                  <span
                                    className={
                                      smileIcon
                                        ? ChatListingStyles.chatReactionActive
                                        : ""
                                    }
                                  >
                                    <SmileIcon />
                                  </span>
                                </div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* <div className={ChatListingStyles.divider}>
                      <span>TODAY</span>
                    </div> */}
                  </>
                );
              })}

              {/* <div
                  className={` ${ChatListingStyles.channelMessageMain} ${ChatListingStyles.systemGeneratedMain} `}
                >
                  <div className={ChatListingStyles.systemGeneratedHeader}>
                    <span>Open HR Accepted | Action By: Harleen Kaur</span>
                    <span>05-06-2023 | 12:24 PM</span>
                  </div>
                  <div
                    className={` ${ChatListingStyles.systemGeneratedInner} ${ChatListingStyles.systemGeneratedCollapsed} `}
                  >
                    <span>
                      Note: Years of exp a) .NET Developer Sr: 4 -6 years b)
                      Test Automation Engineer Sr: 3.5 - 6 years c) Android
                      Developer: 3 - 5 years d) iOS Developer: 3 - 5 years Key
                      Skills: a) .NET Developer Sr : .Net + .Net Core + C# +
                      Typescript (Angular) b) Test Automation Engineer Sr:
                      Automation Testing + BDD Framework Selenium with Java
                      +Jenkins Budget: a) .NET Developer Sr:15-17 LPA b) Test
                      Automation Engineer Sr: 15-17 LPA c) Android Developer:
                      15-17 LPA d) iOS Developer: 15-17 LPA If we feel that a
                      candidate is really good all he or she ticks all the boxes
                      then we can consider 19LPA for them. Additional
                      information Preference should be given to Bangalore
                      candidates. Preference should be given to candidates with
                      a lesser notice period. Avoid sourcing candidates from
                      regions like Andhra Pradesh and Telangana.
                    </span>
                    <a href="javascript:void(0);">Read More</a>
                  </div>
                </div> */}

              {filterData?.length === 0 && (
                <p className={ChatListingStyles.noChatFound}>No Chats Found</p>
              )}

              {/* <div className={ChatListingStyles.channelMessageMain}>
                <div className={ChatListingStyles.channelMessageInner}>
                  <img
                    className={ChatListingStyles.profileAvtar}
                    src="https://i.pravatar.cc/40"
                    width="30"
                    height="30"
                  />
                  <div className={ChatListingStyles.profileName}>
                    Prachi Porwal
                  </div>
                  <span
                    className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.sales} `}
                  >
                    Sales Consultant
                  </span>
                  <span className={ChatListingStyles.timeStamp}>5:48PM</span>
                  <Dropdown
                    className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                    placement="bottomRight"
                    menu={{
                      items: chatDropdown,
                    }}
                    trigger={["click"]}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <span className={ChatListingStyles.dotMenu}></span>
                      </Space>
                    </a>
                  </Dropdown>
                </div>
                <div
                  className={` ${ChatListingStyles.channelMessageBox} ${ChatListingStyles.channelMessageLeft} `}
                >
                  <p>
                    Hi <b>all</b> I would like to update that considering the
                    provided HR details, how many more interviews can we
                    schedule by tommorow.
                  </p>
                  <div className={ChatListingStyles.messageReactionWrapper}>
                    <span className={ChatListingStyles.messageReaction}>
                      <EmojiThumbsUpLightSkinSVG />2
                    </span>
                    <span className={ChatListingStyles.messageReaction}>
                      <EmojiThumbsUpLightSkinSVG />
                      10
                    </span>
                  </div>
                  <div className={ChatListingStyles.chatReaction}>
                    <div className={ChatListingStyles.chatReactionInner}>
                      <div className={ChatListingStyles.chatReactionCircle}>
                        <span className={ChatListingStyles.chatReactionSmile}>
                          <SmileIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* System Generated Message Starts */}
              {/* <div
                className={` ${ChatListingStyles.channelMessageMain} ${ChatListingStyles.systemGeneratedMain} `}
              >
                <div className={ChatListingStyles.systemGenerated}>
                  Open HR Accepted | Action By: Harleen Kaur <br />
                  05-06-2023 | 12:24 PM
                </div>
              </div> */}
              {/* System Generated Message Ends */}

              {/* <div className={ChatListingStyles.channelMessageMain}>
                <div className={ChatListingStyles.channelMessageInner}>
                  <img
                    className={ChatListingStyles.profileAvtar}
                    src="https://i.pravatar.cc/40"
                    width="30"
                    height="30"
                  />
                  <div className={ChatListingStyles.profileName}>
                    Bhuvan Desai
                  </div>
                  <span className={ChatListingStyles.timeStamp}>12:34PM</span>
                  <Dropdown
                    className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                    placement="bottomRight"
                    menu={{
                      items: chatDropdown,
                    }}
                    trigger={["click"]}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <span className={ChatListingStyles.dotMenu}></span>
                      </Space>
                    </a>
                  </Dropdown>
                  <BookmarkIcon className={ChatListingStyles.bookmarkIcon} />
                </div>
                <div
                  className={` ${ChatListingStyles.channelMessageBox} ${ChatListingStyles.channelMessageRight} `}
                >
                  <p>
                    Yes <b>Prachi</b>, please allow me sometime will update you
                    shortly regarding total number of talents available for
                    interview.
                  </p>
                </div>
              </div> */}

              {/* <div className={ChatListingStyles.divider}>
                <span className={ChatListingStyles.dividerInner}>
                  2 Unread Messages
                </span>
              </div> */}

              {/* <div className={ChatListingStyles.channelMessageMain}>
                <div className={ChatListingStyles.channelMessageInner}>
                  <img
                    className={ChatListingStyles.profileAvtar}
                    src="https://i.pravatar.cc/40"
                    width="30"
                    height="30"
                  />
                  <div className={ChatListingStyles.profileName}>
                    Darshan Modi
                  </div>
                  <span
                    className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.deliveryTeam} `}
                  >
                    Delivery Team
                  </span>
                  <span className={ChatListingStyles.timeStamp}>12:44PM</span>
                  <Dropdown
                    className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                    placement="bottomRight"
                    menu={{
                      items: chatDropdown,
                    }}
                    trigger={["click"]}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <span className={ChatListingStyles.dotMenu}></span>
                      </Space>
                    </a>
                  </Dropdown>
                </div>
                <div
                  className={` ${ChatListingStyles.channelMessageBox} ${ChatListingStyles.channelMessageLeft} `}
                >
                  <p>
                    That will be great <b>Prachi</b> & <b>Bhuvan</b>, this will
                    help us get things moving ahead with a schedule.
                  </p>
                </div>
              </div>
              {/* Reply To Message Feature Starts */}
              {replyMessageSection === true && (
                <div className={ChatListingStyles.replyToWrapper}>
                  <div className={ChatListingStyles.replyToTop}>
                    <FiReplySVG />
                    Replying to {replyMessage?.senderName},
                    <span>Today at 12:31PM</span>
                    <span
                      className={ChatListingStyles.chatWindowClose}
                      onClick={closeReplyMessage}
                    ></span>
                  </div>
                  <div className={ChatListingStyles.replyToMessage}>
                    {/* <p>
                      {replyMessage}
                    </p> */}
                    <p>{replyMessage?.text}</p>
                  </div>
                </div>
              )}
              {/* <div className={ChatListingStyles.channelMessageMain}>
                <div className={ChatListingStyles.channelMessageInner}>
                  <img
                    className={ChatListingStyles.profileAvtar}
                    src="https://i.pravatar.cc/40"
                    width="30"
                    height="30"
                  />
                  <div className={ChatListingStyles.profileName}>
                    Bhuvan Desai
                  </div>
                  <span className={ChatListingStyles.timeStamp}>12:34PM</span>
                  <Dropdown
                    className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                    placement="bottomRight"
                    menu={{
                      items: chatDropdown,
                    }}
                    trigger={["click"]}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <span className={ChatListingStyles.dotMenu}></span>
                      </Space>
                    </a>
                  </Dropdown>
                </div>
                <div
                  className={` ${ChatListingStyles.channelMessageBox} ${ChatListingStyles.channelMessageLeft} `}
                >
                  <p>Here are the images you were asking for please check.</p>
                  <div className={ChatListingStyles.attachedMedia}>
                    <img
                      src="https://i.pravatar.cc/56"
                      width="56"
                      height="56"
                    />
                    <img
                      src="https://i.pravatar.cc/56"
                      width="56"
                      height="56"
                    />
                    <img
                      src="https://i.pravatar.cc/56"
                      width="56"
                      height="56"
                    />
                  </div>
                </div>
              </div> */}
              {!scrollDown && filterData?.length > 5 && (
                <span
                  className={ChatListingStyles.scrollToBottom}
                  onClick={scrollToBottom}
                >
                  <ScrollToBottomSVG />
                </span>
              )}
            </div>
          </div>
          <div className={ChatListingStyles.channelWindowFooter}>
            <div className={ChatListingStyles.channelTextWrapper}>
              {/* <input
              type="text"
              // placeholder="Please allow me sometime"
              value={messageHandler}
              onChange={(e: any) => { setMessageHandler(e.target.value); metionUser(e); }}
              onKeyDown={handleKeyDown}
            /> */}
              <div
                ref={commentRef}
                id="Please allow me sometime"
                className={ChatListingStyles.commentBox}
                contentEditable={true}
                placeholder="text @....."
                onKeyDown={(e: any) => {
                  onKeyPressHandler(e);
                  handleKeyDown(e);
                }}
                onInput={(e: any) => {
                  if (isTagged) {
                    let text = e.target.innerText.split("@");
                    let userFilter = memberFilter.filter((item: any) => {
                      return item.userName
                        .toLowerCase()
                        .includes(text[text.length - 1]);
                    });

                    if (userFilter.length > 0 && userFilter) {
                      setMentionMembers(userFilter);
                    } else {
                      setIstagged(false);
                    }
                  }
                }}
                suppressContentEditableWarning={true}
              ></div>
            </div>
            <span className={ChatListingStyles.channelAddMedia}>
              <span className={ChatListingStyles.mediaPlus}></span>
            </span>
            <span
              className={ChatListingStyles.channelSubmit}
              onClick={(e: any) => sendMessage(e)}
            >
              <SendIcon />
            </span>

            {/* User mention popup Starts */}
            {isTagged === true && (
              <div
                className={` ${ChatListingStyles.chatPopup} ${ChatListingStyles.chatArrowBottom} ${ChatListingStyles.userMentionPoup} `}
                style={{
                  display: "block",
                }}
              >
                <div className={ChatListingStyles.chatPopupInner}>
                  {mentionMembers?.map((value: any) => {
                    return (
                      <div className={ChatListingStyles.membersArea}>
                        <div className={ChatListingStyles.membersAreaLeft}>
                          <div
                            className={` ${ChatListingStyles.circleAvtar} ${ChatListingStyles.blueThumb} `}
                          >
                            {userInitial(value?.userName)}
                          </div>
                          <div
                            className={ChatListingStyles.profileName}
                            onClick={() => {
                              let tempInnerHTML =
                                commentRef.current.innerHTML.split("@");
                              let spanTag = `&nbsp;<span id=${value?.userEmpId} contentEditable="false" class=${ChatListingStyles.personTaggedValue}>
                                ${value?.userName} </span>&nbsp;`;
                              tempInnerHTML[tempInnerHTML.length - 1] = spanTag;
                              commentRef.current.innerHTML =
                                tempInnerHTML.join("");
                              setIstagged(false);
                            }}
                          >
                            {value?.userName}
                          </div>
                          <span
                            className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.sales} `}
                          >
                            {value?.userDesignation}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
      {/* </Provider> */}
    </>
  );
};

export default ChatListing;
