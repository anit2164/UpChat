import React from "react";
import BookMarkMessageStyle from "./BookMarkMessage.module.css";
import { Dropdown, Space, Spin, message } from "antd";
import BookmarkIconDark from "../../assets/svg/bookmarkIconDark.svg";
import FiChevronLeftSVG from "../../assets/svg/fiChevronLeft.svg";
import EmojiThumbsUpLightSkinSVG from "../../assets/svg/emojiThumbsUpLightSkin.svg";
import FiBookOpenSVG from "../../assets/svg/fiBookOpen.svg";
import FiCopySVG from "../../assets/svg/fiCopy.svg";
import FiBookmarkOutlinedSVG from "../../assets/svg/fiBookmarkOutlined.svg";
import { useEffect } from "react";
import { useState } from "react";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import ReactPlayer from "react-player";
import FiIconPDF from "../../assets/svg/fiIconPDF.svg";
import { ChannelMenu } from "../../constants/application";
import copy from "copy-to-clipboard";
import DOMPurify from "dompurify";
import FiReplySVG from "../../assets/svg/fiReply.svg";
import FiIconWord from "../../assets/svg/FiIconWord.svg";

const BookMarkMessage = ({ setBookMarkMessage, enc_channelID }: any) => {
  const [showBookmarksData, setshowBookmarksData] = useState<any>([]);
  const firestore = firebase.firestore();
  const loginUserId = localStorage.getItem("EmployeeID");
  const [allBookmarksData, setAllBookmarksData] = useState([]);
  const [removeBookmark, setRemoveBookmark] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showBookMark, setShowBookMark] = useState();
  let currentChatDate: any = null;
  const sanitizer: any = DOMPurify.sanitize;
  const displayNotes: any = (notes: any) => {
    const notesTemplate = new DOMParser().parseFromString(notes, "text/html");
    return notesTemplate.body;
  };
  const chatDropdown = [
    {
      label: ChannelMenu.COPY,
      key: ChannelMenu.COPY,
      icon: <FiCopySVG width="16" />,
    },
    {
      label: ChannelMenu.REMOVE_BOOKMARK,
      key: ChannelMenu.REMOVE_BOOKMARK,
      icon: <FiBookmarkOutlinedSVG />,
    },
  ];

  useEffect(() => {
    if (enc_channelID) {
      const userChatsQuery = firestore
        .collectionGroup("user_chats")
        .where("IsBookMark", "==", true)
        .where("enc_channelID", "==", enc_channelID)
        .where("userEmpID", "==", loginUserId);
      userChatsQuery
        .get()
        .then((querySnapshot) => {
          let uniqueChatIDs = new Set();
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            uniqueChatIDs.add(data.enc_chatID);
          });
          const uniqueChatIDsArray: any = Array.from(uniqueChatIDs);
          setshowBookmarksData(uniqueChatIDsArray);
        })
        .catch((error) => {
          console.error("Error getting user chats:", error);
        });
    }
  }, [removeBookmark, loginUserId]);

  const getAllBookmarkData = async (
    showBookmarksData: any,
    setAllBookmarksData: any
  ) => {
    let bookdata: any = [];

    const getRandomColor = () => {
      const colors = [
        "blueThumb",
        "darkRedThumb",
        "greenThumb",
        "yellowThumb",
        "orangeThumb",
        "skyBlueThumb",
      ];
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    };
    const promises = showBookmarksData.map(async (items: any) => {
      const userChatsRef = firestore
        .collection("ChannelChatsMapping")
        .doc(enc_channelID)
        .collection("chats")
        .doc(items);

      try {
        const doc = await userChatsRef.get();
        if (doc.exists) {
          bookdata.push(doc.data());
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    });

    await Promise.all(promises);
    const color = "color";
    for (let i = 0; i < bookdata.length; i++) {
      bookdata[i][color] = getRandomColor();
    }
    setAllBookmarksData(bookdata);
  };

  useEffect(() => {
    let num: any = 0;
    if (showBookmarksData.length > 0) {
      localStorage.setItem("bookmark-message", showBookmarksData.length);
      getAllBookmarkData(showBookmarksData, setAllBookmarksData);
    } else {
      localStorage.setItem("bookmark-message", num);
      setAllBookmarksData([]);
    }
  }, [showBookmarksData, loginUserId]);


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

  const setBookmark = async (
    chatdata: any,
    loginUserId: any,
    setShowBookMark: any,
    status: any
  ) => {
    const userChatsQuery = firestore
      .collection("ChannelChatsMapping")
      .doc(enc_channelID)
      .collection("chats")
      .doc(chatdata.enc_chatID)
      .collection("user_chats")
      .where("userEmpID", "==", loginUserId);
    userChatsQuery
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (status === "add") {
            const updatedData = {
              ...data,
              IsBookMark: true,
              enc_chatID: chatdata.enc_chatID,
            };
            doc.ref
              .update(updatedData)

              .then(() => {
                setShowBookMark(updatedData);
              })
              .catch((error) => {
                console.error("Error updating user chat data:", error);
              });
          } else {
            const updatedData = {
              ...data,
              IsBookMark: false,
              enc_chatID: chatdata.enc_chatID,
            };
            doc.ref
              .update(updatedData)

              .then(() => {
                setShowBookMark(updatedData);
              })
              .catch((error) => {
                console.error("Error updating user chat data:", error);
              });
          }
        });
      })
      .catch((error) => {
        console.error("Error getting user chats:", error);
      });
  };

  const bookmarkChat = async (value: any, item: any) => {
    if (value.key === ChannelMenu.COPY) {
      copy(
        item.text
          .replace(/&nbsp;/g, " ")
          .replace(/<span[^>]*>(.*?)<\/span>/g, "$1")
          .replace(/\s+/g, " "),
        {}
      );
      messageApi.open({
        type: "success",
        content: "Message copied successfully",
      });
    } else if (value.key === ChannelMenu.REMOVE_BOOKMARK) {
      setRemoveBookmark(!removeBookmark);
      setBookmark(item, loginUserId, setShowBookMark, "remove");
    }
  };

  return (
    <>
      <div className={BookMarkMessageStyle.bookMarkedHeader}>
        <div className={BookMarkMessageStyle.channelStatusLeft}>
          <BookmarkIconDark width="13" height="17" />
          Bookmarked messages
        </div>
        <div
          className={BookMarkMessageStyle.channelStatusRight}
          onClick={() => setBookMarkMessage(false)}
        >
          <FiChevronLeftSVG width="14" height="14" />
        </div>
      </div>
      <div className={BookMarkMessageStyle.channelWindowInner}>
        <div className={BookMarkMessageStyle.channelWindowMessages}>
          {allBookmarksData.length > 0 &&
            allBookmarksData
              .sort((a: any, b: any) => b.date.seconds - a.date.seconds)
              ?.map((item: any, index) => {
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
                currentChatDate = dateString;

                {
                  showDateSeparator && (
                    <div className={BookMarkMessageStyle.divider}>
                      <span>{dateString}</span>
                    </div>
                  );
                }

                const ReplyMessage = (value: any) => {
                  const infoTemp: any = allBookmarksData?.filter(
                    (item: any) => {
                      return item?.reply_enc_ID === value;
                    }
                  );

                  return infoTemp;
                };

                return (
                  <>
                    {showDateSeparator && (
                      <div className={BookMarkMessageStyle.divider}>
                        <span>{dateString}</span>
                      </div>
                    )}
                    {item?.reply_enc_ID ? (
                      ReplyMessage(item.reply_enc_ID).length > 0 && (
                        <div
                          className={BookMarkMessageStyle.channelMessageMain}
                          key={index}
                        >
                          <div
                            className={BookMarkMessageStyle.channelMessageInner}
                          >
                            <div
                              className={
                                BookMarkMessageStyle.channelBookmarkLeft
                              }
                            >
                              <div
                                className={`${BookMarkMessageStyle.chatInitialThumb}  ${BookMarkMessageStyle.blueThumb}`}
                              >
                                {userInitial(item?.senderName)}
                              </div>
                              <div className={BookMarkMessageStyle.profileName}>
                                {item.senderName === loginUserId
                                  ? "You"
                                  : item.senderName}
                              </div>
                              {item.senderDesignation && (
                                <span
                                  className={`${BookMarkMessageStyle.profileDesignation} ${BookMarkMessageStyle.deliveryTeam}`}
                                >
                                  {item.senderDesignation}
                                </span>
                              )}
                              <span className={BookMarkMessageStyle.timeStamp}>
                                {" "}
                                {item?.date?.seconds
                                  ? new Date(item?.date?.seconds * 1000)
                                      .toLocaleTimeString("en-US")
                                      .replace(
                                        /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                        "$1$3"
                                      )
                                  : item?.date}
                              </span>

                              <Dropdown
                                className={`${BookMarkMessageStyle.dotMenuMain} ${BookMarkMessageStyle.dotMenuhz}`}
                                placement="bottomRight"
                                menu={{
                                  items: chatDropdown,
                                  onClick: (value) => {
                                    bookmarkChat(value, item);
                                  },
                                }}
                                trigger={["click"]}
                              >
                                <a onClick={(e) => e.preventDefault()}>
                                  <Space>
                                    <span
                                      className={BookMarkMessageStyle.dotMenu}
                                    ></span>
                                  </Space>
                                </a>
                              </Dropdown>
                            </div>
                          </div>
                          <div
                            className={`${BookMarkMessageStyle.channelMessageBox} ${BookMarkMessageStyle.channelMessageLeft}`}
                          >
                            <div
                              className={`${BookMarkMessageStyle.quotedMessage} ${BookMarkMessageStyle.replyMsg}`}
                            >
                              {/* <p>
                                        {ReplyMessage(item.reply_enc_ID)?.[0]?.Replied}
                                    </p> */}
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: sanitizer(
                                    displayNotes(
                                      ReplyMessage(item?.reply_enc_ID)?.[0]
                                        ?.Replied
                                    ).innerHTML
                                  ),
                                }}
                              ></p>
                              <div
                                className={
                                  BookMarkMessageStyle.quotedMessageChild
                                }
                              >
                                {" "}
                                <FiReplySVG width="10" height="16" />
                                {
                                  ReplyMessage(item.reply_enc_ID)?.[0]
                                    ?.senderName
                                }{" "}
                                <span>
                                  {" "}
                                  {item?.date?.seconds
                                    ? new Date(item?.date?.seconds * 1000)
                                        .toLocaleTimeString("en-US")
                                        .replace(
                                          /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                          "$1$3"
                                        )
                                    : item?.date}
                                </span>
                              </div>
                            </div>
                            {/* <p> {item?.text}</p> */}
                            <p
                              dangerouslySetInnerHTML={{
                                __html: sanitizer(
                                  displayNotes(item?.text).innerHTML
                                ),
                              }}
                            ></p>
                          </div>
                        </div>
                      )
                    ) : (
                      <div
                        className={BookMarkMessageStyle.channelMessageMain}
                        key={index}
                      >
                        <div
                          className={BookMarkMessageStyle.channelMessageInner}
                        >
                          <div
                            className={BookMarkMessageStyle.channelBookmarkLeft}
                          >
                            <div
                              className={`${BookMarkMessageStyle.chatInitialThumb} ${BookMarkMessageStyle.blueThumb}`}
                            >
                              {userInitial(item?.senderName)}
                            </div>
                            <div className={BookMarkMessageStyle.profileName}>
                              {item.senderName === loginUserId
                                ? "You"
                                : item.senderName}
                            </div>
                            <span className={BookMarkMessageStyle.timeStamp}>
                              {" "}
                              {item?.date?.seconds
                                ? new Date(item?.date?.seconds * 1000)
                                    .toLocaleTimeString("en-US")
                                    .replace(
                                      /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                      "$1$3"
                                    )
                                : item?.date}
                            </span>

                            <Dropdown
                              className={`${BookMarkMessageStyle.dotMenuMain} ${BookMarkMessageStyle.dotMenuhz}`}
                              placement="bottomRight"
                              menu={{
                                items: chatDropdown,
                                onClick: (value) => {
                                  bookmarkChat(value, item);
                                },
                              }}
                              trigger={["click"]}
                            >
                              <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                  <span
                                    className={BookMarkMessageStyle.dotMenu}
                                  ></span>
                                </Space>
                              </a>
                            </Dropdown>
                          </div>
                        </div>
                        <div
                          className={`${BookMarkMessageStyle.channelMessageBox} ${BookMarkMessageStyle.channelMessageRight}`}
                        >
                          <p
                            dangerouslySetInnerHTML={{
                              __html: item.text.replace(
                                // nameRegex,
                                (match: any) => `<b>${match}</b>`
                              ),
                            }}
                          ></p>
                          <div className={BookMarkMessageStyle.attachedMedia}>
                            {item?.files &&
                              item?.files?.length > 0 &&
                              item?.files?.map((fileitem: any, indexs: any) => {
                                const containsAnyWord = (
                                  inputString: any,
                                  wordsToCheck: any
                                ) => {
                                  const regex = new RegExp(
                                    `\\b(?:${wordsToCheck.join("|")})\\b`,
                                    "i"
                                  );

                                  return regex.test(inputString);
                                };
                                const wordsForimage = [
                                  "jpg",
                                  "jpeg",
                                  "png",
                                  "gif",
                                  "svg",
                                ];
                                const wordsForvideo = ["mp4", "mov"];
                                const wordsForpdf = ["pdf"];
                                const wordsFordoc = [
                                  "doc",
                                  "docx",
                                  "xls",
                                  "xlsx",
                                  "csv",
                                ];
                                const wordsFortext = ["txt"];
                                const extensionMatch =
                                  fileitem.match(/\.([^.]+)$/);
                                const extension = extensionMatch
                                  ? extensionMatch[1]
                                  : null;

                                const isImage = containsAnyWord(
                                  extension.toLowerCase(),
                                  wordsForimage
                                );
                                const isVideo = containsAnyWord(
                                  extension.toLowerCase(),
                                  wordsForvideo
                                );
                                const isPdf = containsAnyWord(
                                  extension.toLowerCase(),
                                  wordsForpdf
                                );
                                const isDoc = containsAnyWord(
                                  extension.toLowerCase(),
                                  wordsFordoc
                                );
                                const isText = containsAnyWord(
                                  extension.toLowerCase(),
                                  wordsFortext
                                );
                                const getFileNameFromUrl = (url: any) => {
                                  const urlParts = url.split("/");
                                  const lastPart =
                                    urlParts[urlParts.length - 1];
                                  const filename = lastPart.split("?")[0];

                                  return filename;
                                };
                                const fileName = getFileNameFromUrl(fileitem);

                                return (
                                  <li key={indexs}>
                                    {isImage && (
                                      <>
                                        <a
                                          download={fileName}
                                          onClick={() =>
                                            window.open(fileitem, "_blank")
                                          }
                                        >
                                          <img
                                            src={fileitem}
                                            alt="Preview"
                                            height={50}
                                            width={50}
                                          />
                                        </a>
                                      </>
                                    )}
                                    {isVideo && (
                                      <>
                                        <a
                                          // href={fileitem}
                                          onClick={(e) => {
                                            e.preventDefault(); // Prevent the default download behavior
                                            window.open(fileitem, "_blank"); // Open the link in a new tab
                                          }}
                                        >
                                          {/* <video>
                                                                    <source
                                                                        src={fileitem}
                                                                        type="video/mp4"
                                                                    />
                                                                    Your browser does not support
                                                                    the video tag.
                                                                </video> */}
                                          <ReactPlayer
                                            url={fileitem}
                                            width="100%"
                                            height="100%"
                                          />
                                        </a>
                                      </>
                                    )}
                                    {isPdf && (
                                      <>
                                        <a
                                          // href={fileitem}

                                          onClick={() =>
                                            window.open(fileitem, "_blank")
                                          }
                                          download={fileName}
                                          title={fileName}
                                        >
                                          <FiIconPDF />
                                        </a>
                                      </>
                                    )}
                                    {isDoc && (
                                      <>
                                        <a
                                          // href={fileitem}
                                          onClick={() =>
                                            window.open(fileitem, "_blank")
                                          }
                                          download={fileName}
                                          title={fileName}
                                        >
                                          {/* <img
                                            src={FiIconWord}
                                            height={50}
                                            width={50}
                                          /> */}
                                          <FiIconWord />

                                          {/* <div>
                                                  <div>{fileName}</div>
                                                </div> */}
                                        </a>
                                      </>
                                    )}
                                    {isText && (
                                      <>
                                        <a
                                          onClick={() =>
                                            window.open(fileitem, "_blank")
                                          }
                                          // href={fileitem}
                                          download={fileName}
                                          title={fileName}
                                        >
                                          <img
                                            src={FiIconWord}
                                            height={50}
                                            width={50}
                                          />

                                          {/* <div>
                                                  <div>{fileName}</div>
                                                </div> */}
                                        </a>
                                      </>
                                    )}
                                  </li>
                                );
                              })}
                          </div>
                          <div
                            className={
                              BookMarkMessageStyle.messageReactionWrapper
                            }
                          >
                            <span
                              className={BookMarkMessageStyle.messageReaction}
                            >
                              {/* <EmojiThumbsUpLightSkinSVG />2 */}
                            </span>
                            <span
                              className={BookMarkMessageStyle.messageReaction}
                            >
                              {/* <EmojiThumbsUpLightSkinSVG />10 */}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}

          {/* <div className="channelMessageMain">
        <div className="channelMessageInner">
            <img className="profileAvtar" src="https://i.pravatar.cc/40" width="30" height="30" />
            <div className="profileName">Darshan Modi</div>
            <span className="profileDesignation deliveryTeam">Delivery Team</span>
            <span className="timeStamp">12:44PM</span>
            <Dropdown className="dotMenuMain dotMenuhz" placement="bottomRight" menu={{
                items: chatDropdown,
            }}
                trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <span className="dotMenu"></span>
                    </Space>
                </a>
            </Dropdown>
        </div>
        <div className="channelMessageBox channelMessageLeft">
            <div className="quotedMessage replyMsg">
                <p>That will be great <b>Prachi</b> <b>Bhuvan</b>, this will help us get things moving ahead with a schedule.</p>
                <div className="quotedMessageChild"><fireplysvg width="10" height="16">Darshan Modi, <span>Today at 12:31PM</span></fireplysvg></div>
            </div>
            <p>That will be great <b>Prachi</b> & <b>Bhuvan</b>, this will help us get things moving ahead with a schedule.</p>
        </div>

    </div> */}

          {/* <div className="channelMessageMain">
        <div className="channelMessageInner">
            <img className="profileAvtar" src="https://i.pravatar.cc/40" width="30" height="30" />
            <div className="profileName">You</div>
            <span className="timeStamp">12:34PM</span>
            <Dropdown className="dotMenuMain dotMenuhz" placement="bottomRight" menu={{
                items: chatDropdown,
            }}
                trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <span className="dotMenu"></span>
                    </Space>
                </a>
            </Dropdown>
        </div>
        <div className="channelMessageBox channelMessageRight">
            <p>Hi <b>@all,</b> We have received a great feedback from client.</p>
        </div>
    </div> */}
          {contextHolder}
        </div>
      </div>
      <div className={BookMarkMessageStyle.bookmarkWindowFooterWrap}>
        <div className={BookMarkMessageStyle.bookmarkWindowFooter}>
          {localStorage.getItem("bookmark-message")} Bookmarks
        </div>
      </div>
    </>
  );
};

export default BookMarkMessage;
