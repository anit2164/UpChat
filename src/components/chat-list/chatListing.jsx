import ChatListingStyles from "./chatListing.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Collapse from "@Components/collapsible/collapsible.components";
import Header from "@Components/header/header.components";
import UpTabs from "@/components/upTabs/upTabs.components";
import { Dropdown, Space } from "antd";
import { ReactComponent as SendIcon } from "@SVG/fiSend.svg";
import { ReactComponent as SearchIcon } from "@SVG/search.svg";
import { ReactComponent as ArrowIcon } from "@SVG/fiArrowRight.svg";
import { ReactComponent as SmileIcon } from "@SVG/fiSmile.svg";
import { ReactComponent as SmileIcon1 } from "@SVG/smileIcon-1.svg";
import { ReactComponent as SmileIcon2 } from "@SVG/smileIcon-2.svg";
import { ReactComponent as SmileIcon3 } from "@SVG/smileIcon-3.svg";
import { ReactComponent as SmileIcon4 } from "@SVG/smileIcon-4.svg";
import { ReactComponent as SmileIcon5 } from "@SVG/smileIcon-5.svg";
import { ReactComponent as SmileIcon6 } from "@SVG/smileIcon-6.svg";
import { ReactComponent as BookmarkIconDark } from "@SVG/bookmarkIconDark.svg";
import { ReactComponent as FiBookOpenSVG } from "@SVG/fiBookOpen.svg";
import { ReactComponent as FiFilmSVG } from "@SVG/fiFilm.svg";
import { ReactComponent as FiVolumeMuteSVG } from "@SVG/fiVolumeMute.svg";
import { ReactComponent as FiReplySVG } from "@SVG/fiReply.svg";
import { ReactComponent as FiCopySVG } from "@SVG/fiCopy.svg";
import { ReactComponent as FiBookmarkOutlinedSVG } from "@SVG/fiBookmarkOutlined.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageHandler } from "@/redux_toolkit/slices/sendMessage";
import MemberListing from "./memberListing";
import { ReactComponent as ScrollToBottomSVG } from "@SVG/scrollToBottom.svg";
import { ChannelMenu } from "@/constants/application";
import moment from "moment";
// import Tile from "../tile/tile.components";

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
}) => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [messageHandler, setMessageHandler] = useState("");
  const [smileIcon, setSmileIcon] = useState(false);
  const [chatMapKey, setChatMapKey] = useState();
  const [search, setSearch] = useState("");
  const [senderClass, setSenderClass] = useState(false);
  const [memberRead, setMemberRead] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const [scrollDown, setScrollDown] = useState(false);
  const [searchInChat, setSearchInChat] = useState(false);

  const bottomToTopRef = useRef(null);
  const arrawScroll = useRef(null);

  let lastChatMessage;

  const channelMainDropdown = [
    {
      label: ChannelMenu.SEARCH_IN_CHAT,
      key: ChannelMenu.SEARCH_IN_CHAT,
      icon: <SearchIcon />,
    },
    {
      label: ChannelMenu.BOOKMARKS,
      key: ChannelMenu.BOOKMARKS,
      icon: <BookmarkIconDark width="16" />,
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
      icon: <FiBookmarkOutlinedSVG width="16" />,
    },
  ];

  const scrollToBottom = () => {
    bottomToTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setScrollDown(false);
  };

  let getSenderName = "";

  const currentDate = new Date();
  const currentTimeIST = currentDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  // const [time, period] = currentTimeIST.split(" ");
  // const [hours, minutes] = time.split(":");
  // const formattedHours = parseInt(hours, 10) % 12 || 12;
  // const formattedTime = `${formattedHours}:${minutes} ${period.toUpperCase()}`;

  const date = new Date();
  const formattedTime = date.toUTCString();

  const createCollection = async (data) => {
    try {
      const firestore = firebase.firestore();
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

  const sendMessage = async () => {
    if (messageHandler) {
      setMessageHandler("");
      setSenderClass(true);
      try {
        let obj = {
          date: new Date(),
          documentUrl: "",
          enc_chatID: "",
          hrID: allChannelItem?.hrID,
          isActivity: false,
          senderEmpID: "",
          text: messageHandler,
          isNotes: true,
          remark: "",
          senderDesignation: "",
          senderName: "Shreyash Zinzuvadia",
          talentName: "",
          Replied: "",
          isRepliedTo: "",
          msgRepliedId: "",
          remark: "",
        };
        let apiObj = {
          id: allChannelItem?.hrID,
          note: messageHandler,
        };
        const firestore = firebase.firestore();
        const collectionRef = firestore.collection(
          `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats`
        );

        const tempEnc_ID = await collectionRef.add(obj);
        obj.enc_chatID = tempEnc_ID.id;
        const snapshot = collectionRef.doc(tempEnc_ID.id);

        await snapshot.set(obj);
        await collectionRef.get();

        // const dataArray = d?.docs?.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));
        localStorage.setItem("sendername", "Shreyash Zinzuvadia");
        getSenderName = localStorage.getItem("sendername");
        scrollToBottom();
        updateChannelDateTime(allChannelItem?.enc_channelID);
        createCollection(tempEnc_ID.id);
        dispatch(sendMessageHandler(apiObj));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (messageHandler) {
        setMessageHandler("");
        setSenderClass(true);
        try {
          let obj = {
            date: new Date(),
            documentUrl: "",
            enc_chatID: "",
            hrID: allChannelItem?.hrID,
            isActivity: false,
            senderEmpID: "",
            text: messageHandler,
            isNotes: true,
            remark: "",
            senderDesignation: "",
            senderName: "Shreyash Zinzuvadia",
            talentName: "",
            Replied: "",
            isRepliedTo: "",
            msgRepliedId: "",
            remark: "",
          };
          let apiObj = {
            id: allChannelItem?.hrID,
            note: messageHandler,
          };
          const firestore = firebase.firestore();
          const collectionRef = firestore.collection(
            `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats`
          );

          const tempEnc_ID = await collectionRef.add(obj);
          obj.enc_chatID = tempEnc_ID.id;
          const snapshot = collectionRef.doc(tempEnc_ID.id);

          await snapshot.set(obj);
          await collectionRef.get();

          // const dataArray = d?.docs?.map((doc) => ({
          //   id: doc.id,
          //   ...doc.data(),
          // }));
          localStorage.setItem("sendername", "Shreyash Zinzuvadia");
          getSenderName = localStorage.getItem("sendername");
          scrollToBottom();
          updateChannelDateTime(allChannelItem?.enc_channelID);
          createCollection(tempEnc_ID.id);
          dispatch(sendMessageHandler(apiObj));
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

  const filterData = listingChats?.filter((item) => {
    return item?.text?.toLowerCase()?.includes(search?.toLowerCase());
  });

  if (filterData) {
    lastChatMessage = filterData.slice(-1);
  }

  const handleScroll = () => {
    const divElement = arrawScroll.current;
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
    if (showChat) {
      setShowList(!showChat);
      setAllChannelItem();
    } else if (showPinnedChatsList) {
      setShowPinnedChatsList(!showPinnedChatsList);
      setPinnedChatsItem();
    } else if (showSnoozeChatsList) {
      setShowSnoozeChatsList(!showSnoozeChatsList);
      setAllChannelItem();
    }
  };

  useEffect(() => {
    try {
      const firestore = firebase.firestore();
      const unsubscribe = firestore
        .collection(`ChannelUserMapping/${allChannelItem?.enc_channelID}/user`)
        .onSnapshot((snapshot) => {
          const userData = snapshot.docs.map((doc) => {
            const userEmpId = doc.get("userEmpId");
            return {
              id: doc.id,
              enc_channelID: allChannelItem?.enc_channelID,
              isRead: "ChatUser_Jimit" === userEmpId ? true : false,
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

  const chatListDropdown = (value) => {
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

  const GFG_Fun1 = (time) => {
    var utcSeconds = time;
    var d = new Date(0);
    const data = new Date(d.setUTCSeconds(utcSeconds));
    return moment(data).format("DD-MM-YYYY");
  };

  return (
    <>
      {!(showChatList || pinnedChatsDetails || snoozeChatsDetails) && (
        <main className={ChatListingStyles.main}>
          {toggle && (
            <>
              <Header setToggle={setToggle} />
              <UpTabs />
            </>
          )}

          <Collapse setToggle={setToggle} toggle={toggle} />
        </main>
      )}

      {(showChatList || pinnedChatsDetails || snoozeChatsDetails) && (
        <div
          className={` ${ChatListingStyles.channelWindow} ${ChatListingStyles.chatListingWindow} `}
        >
          <div className={ChatListingStyles.channelWindowHeader}>
            <div className={ChatListingStyles.channelHeaderLeft}>
              {/* {activeUser === true ? "Online" : "Offline"} */}
              <div
                className={` ${ChatListingStyles.chatInitialThumb} ${ChatListingStyles.blueThumb} `}
              >
                {allChannelItem?.companyInitial}
              </div>
              <div className={ChatListingStyles.channelName}>
                {allChannelItem?.role} | {allChannelItem?.companyName} |{" "}
                {allChannelItem?.hrNumber}
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
              {filterData?.map((item, key) => {
                return (
                  <>
                    {item?.isActivity === true ? (
                      <div className={ChatListingStyles.channelMessageMain}>
                        <div
                          className={ChatListingStyles.systemGeneratedHeader}
                        >
                          <span>{item?.text} | Action By: Harleen Kaur</span>
                          <span>
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
                    ) : (
                      <div
                        className={ChatListingStyles.channelMessageMain}
                        ref={bottomToTopRef}
                      >
                        <div className={ChatListingStyles.channelMessageInner}>
                          <img
                            className={ChatListingStyles.profileAvtar}
                            src="https://i.pravatar.cc/40"
                            width="30"
                            height="30"
                          />
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
                          {!scrollDown && filterData?.length > 5 && (
                            <span
                              className={ChatListingStyles.scrollToBottom}
                              onClick={scrollToBottom}
                            >
                              <ScrollToBottomSVG />
                            </span>
                          )}
                        </div>
                        <div
                          className={` ${ChatListingStyles.channelMessageBox} ${
                            getSenderName === item?.senderName
                              ? ChatListingStyles.channelMessageLeft
                              : ChatListingStyles.channelMessageRight
                          } `}
                        >
                          <p>{item?.text}</p>
                          <div className={ChatListingStyles.chatReaction}>
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
                                className={ChatListingStyles.chatReactionCircle}
                                onClick={() => {
                                  setSmileIcon(!smileIcon);
                                  setChatMapKey(key);
                                }}
                              >
                                <span
                                  className={
                                    ChatListingStyles.chatReactionActive
                                  }
                                >
                                  <SmileIcon />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
              {/* <div
                  className={` ${ChatListingStyles.channelMessageMain} ${ChatListingStyles.systemGeneratedMain} `}
                >

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

              <div className={ChatListingStyles.channelMessageMain}>
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
            </div>
          </div>
          <div className={ChatListingStyles.channelWindowFooter}>
            <input
              type="text"
              placeholder="Please allow me sometime"
              value={messageHandler}
              onChange={(e) => setMessageHandler(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className={ChatListingStyles.channelAddMedia}>
              <span className={ChatListingStyles.mediaPlus}></span>
            </span>
            <span
              className={ChatListingStyles.channelSubmit}
              onClick={(e) => sendMessage(e)}
            >
              <SendIcon />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatListing;
