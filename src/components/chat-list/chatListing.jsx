import ChatListingStyles from "./chatListing.module.css";
import { useEffect, useRef, useState } from "react";
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

firebase.initializeApp(firebaseConfig);

const ChatListing = ({
  showChatList,
  pinnedChatsDetails,
  listingChats,
  snoozeChatsDetails,
  showSnoozeChatsList,
  allChannelItem,
}) => {
  const dispatch = useDispatch();
  const sendMessageData = useSelector((state) => state?.sendMessage);

  const [toggle, setToggle] = useState(false);
  const [messageHandler, setMessageHandler] = useState("");

  const channelMainDropdown = [
    {
      label: "Search in chat",
      key: "0",
      icon: <SearchIcon />,
    },
    {
      label: "Bookmarks",
      key: "1",
      icon: <BookmarkIconDark />,
    },
    {
      label: "Channel Library",
      key: "2",
      icon: <FiBookOpenSVG />,
    },
    {
      label: "View HR Detail Page",
      key: "3",
      icon: <FiFilmSVG />,
    },
    {
      type: "divider",
    },
    {
      label: "Snooze Channel",
      key: "4",
      icon: <FiVolumeMuteSVG />,
    },
  ];

  const chatDropdown = [
    {
      label: "Reply",
      key: "0",
      icon: <FiReplySVG />,
    },
    {
      label: "Copy",
      key: "1",
      icon: <FiCopySVG />,
    },
    {
      label: "Bookmark",
      key: "2",
      icon: <FiBookmarkOutlinedSVG />,
    },
  ];

  const sendMessage = async () => {
    if (messageHandler) {
      setMessageHandler("");
      try {
        let obj = {
          date: new Date(),
          documentUrl: "",
          enc_chatID: allChannelItem?.enc_channelID,
          hrID: allChannelItem?.hrID,
          isActivity: true,
          senderID: "Shreyash Zinzuvadia",
          text: messageHandler,
        };
        let apiObj = {
          id: allChannelItem?.hrID,
          note: messageHandler,
        };
        const firestore = firebase.firestore();
        const collectionRef = firestore.collection(
          `ChannelChatsMapping/${allChannelItem?.id}/chats`
        );
        await collectionRef.add(obj);

        dispatch(sendMessageHandler(apiObj));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // useEffect(() => {
  //   // sendMessage();
  //   if (chatContainerRef.current) {
  //     window.scrollTo(
  //       0,
  //       (chatContainerRef.current.scrollTop =
  //         chatContainerRef.current.offsetTop)
  //     );
  //   }
  // }, [listingChats, chatContainerRef]);

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
        <div className={ChatListingStyles.channelWindow}>
          <div className={ChatListingStyles.channelWindowHeader}>
            <div className={ChatListingStyles.channelHeaderLeft}>
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
                // onClick={() => showChatList(!showChat)}
              ></span>
            </div>
          </div>
          <MemberListing allChannelItem={allChannelItem} />
          <div className={ChatListingStyles.channelWindowInner}>
            <div className={ChatListingStyles.searchInChatWrapper}>
              <div className={ChatListingStyles.searchInChatInner}>
                <SearchIcon className={ChatListingStyles.searchIcon} />
                <input type="text" placeholder="Search in chat" />
                <span className={ChatListingStyles.closeIcon}></span>
                <span className={ChatListingStyles.numberOfSearch}>
                  <span className={ChatListingStyles.arrowIcon}>
                    <ArrowIcon />
                  </span>
                  3/17
                  <span className={ChatListingStyles.arrowIconRight}>
                    <ArrowIcon />
                  </span>
                </span>
              </div>
            </div>

            <div
              className={ChatListingStyles.channelWindowMessages}
              id="messagelist"
              // ref={chatContainerRef}
            >
              {listingChats?.map((item) => {
                return (
                  <>
                    <div className={ChatListingStyles.channelMessageMain}>
                      <div className={ChatListingStyles.channelMessageInner}>
                        <img
                          className={ChatListingStyles.profileAvtar}
                          src="https://i.pravatar.cc/40"
                          width="30"
                          height="30"
                        />
                        <div className={ChatListingStyles.profileName}>
                          {/* Prachi Porwal */}
                          {item?.senderID}
                        </div>
                        <span
                          className={` ${ChatListingStyles.profileDesignation} ${ChatListingStyles.sales} `}
                        >
                          Sales Consultant
                        </span>
                        <span className={ChatListingStyles.timeStamp}>
                          5:48PM
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
                      </div>
                      <div
                        className={` ${ChatListingStyles.channelMessageBox} ${ChatListingStyles.channelMessageLeft} `}
                      >
                        <p>{item?.text}</p>
                        <div className={ChatListingStyles.chatReaction}>
                          <div className={ChatListingStyles.chatReactionInner}>
                            <div
                              className={ChatListingStyles.chatReactionPopup}
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
                            <div
                              className={ChatListingStyles.chatReactionCircle}
                            >
                              <span
                                className={ChatListingStyles.chatReactionActive}
                              >
                                <SmileIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className={ChatListingStyles.divider}>
                      <span>TODAY</span>
                    </div> */}
                  </>
                );
              })}
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
