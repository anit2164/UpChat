import ChatListingStyles from "./chatListing.module.css";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,

} from "react";
import FiIconWord from "../../assets/svg/fiIconWord.svg";
import Collapse from "../../components/collapsible/collapsible.components";
import Header from "../header/header.components";
import FiIconPDF from "../../assets/svg/fiIconPDF.svg";
import UpTabs from "../../components/upTabs/upTabs.components";
import { Dropdown, Space, message, Spin, Tooltip } from "antd";
import SendIcon from "../../assets/svg/fiSend.svg";
import SearchIcon from "../../assets/svg/search.svg";
import FiChevronLeftSVG from "../../assets/svg/fiChevronLeft.svg";
import FiFolderPlusSVG from "../../assets/svg/fiFolderPlus.svg";
// import ArrowIcon from "@SVG/fiArrowRight.svg";
import SmileIcon from "../../assets/svg/fiSmile.svg";
import FiImageSVG from "../../assets/svg/fiImage.svg";
import ChannelLibrary from "../ChannelLibrary/ChannelLibrary";
import FiIconPdf from "../../assets/svg/fiIconPDF.svg";

import SmileIcon1 from "../../assets/svg/smileIcon-1.svg";
import SmileIcon2 from "../../assets/svg/smileIcon-2.svg";
import SmileIcon3 from "../../assets/svg/smileIcon-3.svg";
import SmileIcon4 from "../../assets/svg/smileIcon-4.svg";
import SmileIcon5 from "../../assets/svg/smileIcon-5.svg";
import SmileIcon6 from "../../assets/svg/smileIcon-6.svg";
import BookmarkIconDark from "../../assets/svg/bookmarkIconDark.svg";
import FiBookOpenSVG from "../../assets/svg/fiBookOpen.svg";
import FiFilmSVG from "../../assets/svg/fiFilm.svg";
import MsgEditIcon from "../../assets/svg/MsgEdit.svg";
import FiVolumeMuteSVG from "../../assets/svg/fiVolumeMute.svg";
import FiReplySVG from "../../assets/svg/fiReply.svg";
import FiCopySVG from "../../assets/svg/fiCopy.svg";
import FiBookmarkOutlinedSVG from "../../assets/svg/fiBookmarkOutlined.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
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
import { limits } from "../../constants/constantLimit";
import ReactPlayer from 'react-player';
import BookmarkIconSVG from "../../assets/svg/bookmarkIcon.svg";
import BookMarkMessage from "../BookMarkMessage/BookMarkMessage";
import { sendMessageRequest } from "../../services/api";
import { NetworkInfo } from "../../constants/network";

// firebase.initializeApp(firebaseConfig);

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
  const [userDataList, setUserDataList] = useState<any>([]);
  const [scrollDown, setScrollDown] = useState(false);
  const [searchInChat, setSearchInChat] = useState(false);
  const [username, setUsername] = useState("");
  const [loggeInUserDesignation, setLoggedInUserDesignation] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountPinned, setTotalCountPinned] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [showUpChat, setShowUpChat] = useState<any>(false);
  const [mentionMembers, setMentionMembers] = useState<any>([]);
  const [memberFilter, setMemberFilter] = useState([]);
  const [isTagged, setIstagged] = useState(false);
  const [tileChat, setTileChat] = useState(false);
  const [pinChat, setPinChat] = useState(false);
  const [replyMessage, setReplyMessage] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState<boolean>(false);
  const [channelLibrary, setChannelLibrary] = useState(false);
  const [enc_channelID, setenc_channelID] = useState("");
  const [seeAttachment, setSeeAttachment] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showBookMark, setShowBookMark] = useState<any>(false);
  const [showBookmarksData, setshowBookmarksData] = useState<any>([]);
  const [bookMarkMessage, setBookMarkMessage] = useState(false);
  const [editData, setEditData] = useState<any>("");
  const [editMessage, setEditMessage] = useState(false);
  const [selectedDoc, setSelectDoc] = useState<any>(false);
  const [taggedUser, setTaggedUser] = useState([]);
  const [taggedUserActive, setTaggedUserActive] = useState(false);
  const [getTaggedData, setTaggedData] = useState([]);
  const bottomToTopRef: any = useRef(null);
  const arrawScroll = useRef(null);
  const commentRef: any = useRef();
  const loginUserId = localStorage.getItem("EmployeeID");
  const initializeApp: any = localStorage.getItem("initializeApp") || "";
  let name: any = loginUserId;
  let lastChatMessage;

  let firestore: any;
  let storage: any;
  if (allChannelItem && initializeApp === "true") {
    firebase.initializeApp(firebaseConfig);
    firestore = firebase.firestore();
    storage = firebase.storage();
  }

  const sanitizer = DOMPurify.sanitize;
  let currentChatDate: any = null;
  var storageToken: any;

  setTimeout(() => {
    storageToken = JSON.parse(localStorage.getItem("apiKey") || "{}");
  }, 0);

  let initials1 = name
    ?.split(" ")
    .reduce((acc: any, subname: any) => acc + subname[0], "");




  const channelMainDropdown: any = [
    {
      label: ChannelMenu.SEARCH_IN_CHAT,
      key: ChannelMenu.SEARCH_IN_CHAT,
      icon: <SearchIcon />,
    },
    {
      label: ChannelMenu.BOOKMARKS,
      key: ChannelMenu.BOOKMARKS,
      icon: <BookmarkIconDark width="12" />,
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

  const chatDropdownNoBookMark = [
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
  const getIsReadUser = async () => {
    const collectionRef = firestore.collection(
      `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats`
    );
    const query = collectionRef.orderBy("date", "desc").limit(1);

    try {
      const querySnapshot = await query.get();

      if (!querySnapshot.empty) {
        const lastChatDoc = querySnapshot.docs[0];
        const lastChatID = lastChatDoc.id;
        const subcollectionRef = firestore.collection(
          `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats/${lastChatID}/user_chats/`
        );
        subcollectionRef
          .where("userEmpID", "==", loginUserId)
          .get()
          .then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
              // Update the specific document within the subcollection
              const docRef = subcollectionRef.doc(doc.id);
              docRef
                .update({
                  // Update the fields you want here
                  // For example, you can add a new field like "isRead" with a value of true
                  isRead: true,
                })
                .then(() => {
                  // console.log(`Document ${doc.id} updated.`);
                })
                .catch((error: any) => {
                  console.error(`Error updating document ${doc.id}:`, error);
                });
            });
          })
          .catch((error: any) => {
            console.error("Error getting user chats data:", error);
          });
        // for (let i = 0; i < userDataList.length; i++) {
        //  await collectionRef.update(userDataList[i]);
        // }
      } else {
        // console.log("No chat documents found.");
      }
    } catch (error) {
      console.error("Error getting last chat ID:", error);
    }
  };
  useEffect(() => {
    if (scrollDown === true) {
      localStorage.setItem("scrollDown", "true")
      getIsReadUser();
    }
    // console.log("allChannelItemallChannelItem",userDataListuserDataListuserDataList)
    //

  }, [scrollDown])

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

  useEffect(() => {
    // if (taggedUserActive) {
      const getMetionmememberlist = mentionMembers.filter((items: any) => {
        const commentText = commentRef?.current?.innerText.trim();

        return (
          commentText && commentText.match(new RegExp(items.userName, "g"))
        );
      });
      // console.log(
      //   "getMetionmememberlistgetMetionmememberlist",
      //   getMetionmememberlist
      // );
      setTaggedUser(getMetionmememberlist);
      // console.log("checking", getMetionmememberlist);
    // }
  }, [commentRef?.current?.innerText]);
  const createCollection = async (data: any) => {
    try {
      // const firestore = firebase.firestore();
      const collectionRef = firestore.collection(
        `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats/${data}/user_chats/`
      );

      for (let i = 0; i < userDataList.length; i++) {
        let newuserList: any = {
          ...userDataList[i],
          chatId: data,
        };
        await collectionRef.add(newuserList);
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

      sendMessageRequest(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileSelect = (e: any, fileType: any) => {
    const files = e.target.files;
    const newSelectedFiles = [];



    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileTypeOfFile = file.type;
      const fileNameParts = file.name.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (fileTypeOfFile.startsWith("image/") && fileType === "image") {

        const wordsForimage = [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "svg"
        ];
        setSelectedImage(true);
        setSelectDoc(false);
        if (wordsForimage.includes(fileExtension)) {
          newSelectedFiles.push(file);
        } else {
          messageApi.open({
            type: "error",
            content: `${fileExtension} type of image not supported`,
          });
        }
      } else if (fileTypeOfFile.startsWith("video/") && fileType === "image") {
        const wordsForvideo = ["mp4", "mov"];

        setSelectedImage(true);
        setSelectDoc(false);
        if (wordsForvideo.includes(fileExtension)) {
          newSelectedFiles.push(file);
        } else {
          messageApi.open({
            type: "error",
            content: `${fileExtension} type of video not supported `,
          });
        }

      } else if (
        fileType === "doc" &&
        fileTypeOfFile.startsWith("application/")
      ) {
        const wordsForpdf = ["pdf"];
        const wordsFordoc = ["doc", "docx", "xls", "xlsx", "csv"];

        setSelectedImage(false);
        setSelectDoc(true);
        if (wordsForpdf.includes(fileExtension) || wordsFordoc.includes(fileExtension)) {
          newSelectedFiles.push(file);
        } else {
          messageApi.open({
            type: "error",
            content: `${fileExtension} type of document not supported`,
          });
        }


      } else if (fileType === "doc" && fileTypeOfFile.startsWith("text/")) {
        const wordsFortext = ["txt"];
        setSelectedImage(false);
        setSelectDoc(true);
        if (wordsFortext.includes(fileExtension)) {
          newSelectedFiles.push(file);
        } else {
          messageApi.open({
            type: "error",
            content: `${fileExtension} type of document not supported`,
          });
        }


      }
    }

    setSelectedFile([...selectedFile, ...newSelectedFiles]);
  };
  const handleFileClose = (items: any) => {
    const updatedItems = selectedFile.filter((item: any) => item !== items);
    setSelectedFile(updatedItems);
  };
  const sendMessage = async (e: any) => {
    if(editData){
      if (commentRef.current.innerText.trim().length > 0 ||
      (selectedFile && selectedFile.length > 0)) 
      {
      localStorage.setItem("msgSend", "true");
      setMessageHandler("");
      sendMessageAPI();
      setSenderClass(true);
      setScrollDown(true);
      setSelectedImage(false);
      let UploadedFiles = [];
      if (selectedFile.length > 0) {
        for (const file of selectedFile) {
          const currentDate = new Date().toISOString().split("T")[0];
          const currentTime = new Date();
          const hours = currentTime.getHours().toString().padStart(2, "0");
          const minutes = currentTime.getMinutes().toString().padStart(2, "0");
          const seconds = currentTime.getSeconds().toString().padStart(2, "0");

          const formattedTime = `${hours}:${minutes}:${seconds}`;

          const filename = `${currentDate}-${formattedTime}-${file.name}`;
          const originalFilename = file.name;

          if (file.type.toLowerCase().startsWith("video/")) {
            setUploading(true);
            const storageRef = storage.ref(
              `videos/${allChannelItem?.enc_channelID}`
            );
            const videoname = originalFilename.replace(/\.mov$/, ".mp4");
            const videoFileName = `${currentDate}-${formattedTime}-${videoname}`;

            const updatedBlob = new Blob([file], { type: "video/mp4" });
            const fileRef = storageRef.child(videoFileName);

            try {
              await fileRef.put(updatedBlob);
              const downloadURL = await fileRef.getDownloadURL();
              UploadedFiles.push(downloadURL);
            } catch (error) {
              console.error("Error uploading file: ", error);
            } finally {
              setUploading(false);
            }
          } else if (file.type.toLowerCase().startsWith("image/")) {
            setUploading(true);
            const storageRef = storage.ref(
              `images/${allChannelItem?.enc_channelID}`
            );
            const fileRef = storageRef.child(filename);

            try {
              await fileRef.put(file);
              const downloadURL = await fileRef.getDownloadURL();
              UploadedFiles.push(downloadURL);
            } catch (error) {
              console.error("Error uploading file: ", error);
            } finally {
              setUploading(false);
            }
          } else {
            setUploading(true);
            const storageRef = storage.ref(
              `document/${allChannelItem?.enc_channelID}`
            );
            const fileRef = storageRef.child(filename);

            try {
              await fileRef.put(file);
              const downloadURL = await fileRef.getDownloadURL();
              UploadedFiles.push(downloadURL);
            } catch (error) {
              console.error("Error uploading file: ", error);
            } finally {
              setUploading(false);
            }
          }
        }
      }

      try {
        let obj: any = {
          enc_chatID: editData?.enc_chatID,
          hrID: allChannelItem?.hrID,
          text: commentRef.current.innerHTML.replace(/\s+/g, " "),
          files:
            UploadedFiles.length > 0 || editData.files
              ? [...UploadedFiles, ...editData.files]
              : "",
          messageEdited: true,
        };

        setReplyMessageSection(false);
        setReplyMessage({});
        const collectionRef = firestore.collection(
          `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats`
        );
        const { enc_chatID, ...updatedData } = obj;
        const docRef = collectionRef.doc(enc_chatID);
        await docRef.update(updatedData);

        setMessageHandler("");
        // handleScrollTop();
        setEditData("");
        // updateChannelDateTime(channelData);
        setSeeAttachment(false);
        setSelectedFile([]);
        sendMessageAPI();
        let msgSend = localStorage.getItem("msgSend");
        if (msgSend === "true") {
          commentRef.current.innerText = "";
          localStorage.removeItem("msgSend");
        }
      } catch (error) {
        console.error(error);
      }
      setEditMessage(false);
    }
    }else{

      if (commentRef.current.innerText.trim().length > 0 ||
        (selectedFile && selectedFile.length > 0)) {
        setMessageHandler("");
        sendMessageAPI();
        setSenderClass(true);
        setScrollDown(true);
        setSelectedImage(false);
        let UploadedFiles = [];
        if (selectedFile.length > 0) {
          for (const file of selectedFile) {
            const currentDate = new Date().toISOString().split("T")[0];
            const currentTime = new Date();
            const hours = currentTime.getHours().toString().padStart(2, "0");
            const minutes = currentTime.getMinutes().toString().padStart(2, "0");
            const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  
            const formattedTime = `${hours}:${minutes}:${seconds}`;
  
            const filename = `${currentDate}-${formattedTime}-${file.name}`;
            const originalFilename = file.name;
  
            if (file.type.toLowerCase().startsWith("video/")) {
              setUploading(true);
              const storageRef = storage.ref(
                `videos/${allChannelItem?.enc_channelID}`
              );
              const videoname = originalFilename.replace(/\.mov$/, ".mp4");
              const videoFileName = `${currentDate}-${formattedTime}-${videoname}`;
  
              const updatedBlob = new Blob([file], { type: "video/mp4" });
              const fileRef = storageRef.child(videoFileName);
  
              try {
                await fileRef.put(updatedBlob);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            } else if (file.type.toLowerCase().startsWith("image/")) {
              setUploading(true);
              const storageRef = storage.ref(
                `images/${allChannelItem?.enc_channelID}`
              );
              const fileRef = storageRef.child(filename);
  
              try {
                await fileRef.put(file);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            } else {
              setUploading(true);
              const storageRef = storage.ref(
                `document/${allChannelItem?.enc_channelID}`
              );
              const fileRef = storageRef.child(filename);
  
              try {
                await fileRef.put(file);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            }
          }
        }
  
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
              ? replyMessage.text.trim()
              : "",
            files: UploadedFiles.length > 0 ? UploadedFiles : "",
            isRepliedTo: replyMessageSection === true ? loginUserId : "",
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
          setSelectedFile([]);
          setSeeAttachment(false)
          // dispatch(sendMessageHandler(apiObj));
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleKeyDown = async (e: any) => {
    if(editData){
      if (e.key === "Enter" && taggedUserActive) {
        e.preventDefault();
        let tempInnerHTML = commentRef.current.innerHTML.split("@");
        let spanTag = `&nbsp;<span id=${mentionMembers[0]?.userEmpId} contentEditable="false" class=${ChatListingStyles.personTaggedValue}>
        ${mentionMembers[0]?.userName} </span>&nbsp;`;
        tempInnerHTML[tempInnerHTML.length - 1] = spanTag;
        commentRef.current.innerHTML = tempInnerHTML.join("");
        setIstagged(false);
        setTaggedUserActive(false);
      }
     else if (e.key === "Enter" && (commentRef.current.innerText.trim().length > 0 ||
      selectedFile && selectedFile.length > 0)) {
        localStorage.setItem("msgSend", "true");
          e.preventDefault();
        setMessageHandler("");
        sendMessageAPI();
        setSenderClass(true);
        setScrollDown(true);
        let UploadedFiles = [];
        if (selectedFile.length > 0) {
          for (const file of selectedFile) {
            const currentDate = new Date().toISOString().split("T")[0];
            const currentTime = new Date();
            const hours = currentTime.getHours().toString().padStart(2, "0");
            const minutes = currentTime.getMinutes().toString().padStart(2, "0");
            const seconds = currentTime.getSeconds().toString().padStart(2, "0");

            const formattedTime = `${hours}:${minutes}:${seconds}`;

            const filename = `${currentDate}-${formattedTime}-${file.name}`;
            const originalFilename = file.name;

            if (file.type.toLowerCase().startsWith("video/")) {
              setUploading(true);
              const storageRef = storage.ref(
                `videos/${allChannelItem?.enc_channelID}`
              );
              const videoname = originalFilename.replace(/\.mov$/, ".mp4");
              const videoFileName = `${currentDate}-${formattedTime}-${videoname}`;

              const updatedBlob = new Blob([file], { type: "video/mp4" });
              const fileRef = storageRef.child(videoFileName);

              try {
                await fileRef.put(updatedBlob);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            } else if (file.type.toLowerCase().startsWith("image/")) {
              setUploading(true);
              const storageRef = storage.ref(
                `images/${allChannelItem?.enc_channelID}`
              );
              const fileRef = storageRef.child(filename);

              try {
                await fileRef.put(file);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            } else {
              setUploading(true);
              const storageRef = storage.ref(
                `document/${allChannelItem?.enc_channelID}`
              );
              const fileRef = storageRef.child(filename);

              try {
                await fileRef.put(file);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            }
          }
        }
        try {
          let obj: any = {
            enc_chatID: editData?.enc_chatID,
            hrID: allChannelItem?.hrID,
            text: commentRef.current.innerHTML.replace(/\s+/g, " "),
            files:
              UploadedFiles.length > 0 || editData.files
                ? [...UploadedFiles, ...editData.files]
                : "",
            messageEdited: true,
          };

          setReplyMessageSection(false);
          setReplyMessage({});
          const collectionRef = firestore.collection(
            `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats`
          );
          const { enc_chatID, ...updatedData } = obj;
          const docRef = collectionRef.doc(enc_chatID);
          await docRef.update(updatedData);

          setMessageHandler("");
          // handleScrollTop();
          setEditData("");
          // updateChannelDateTime(channelData);
          setSeeAttachment(false);
          setSelectedFile([]);
          sendMessageAPI();
          let msgSend = localStorage.getItem("msgSend");
          if (msgSend === "true") {
            commentRef.current.innerText = "";
            localStorage.removeItem("msgSend");
          }
        } catch (error) {
          console.error(error);
        }
        setEditMessage(false);
      }
    }else{
      if (e.key === "Enter" && taggedUserActive) {
        e.preventDefault();
        let tempInnerHTML = commentRef.current.innerHTML.split("@");
        let spanTag = `&nbsp;<span id=${mentionMembers[0]?.userEmpId} contentEditable="false" class=${ChatListingStyles.personTaggedValue}>
        ${mentionMembers[0]?.userName} </span>&nbsp;`;
        tempInnerHTML[tempInnerHTML.length - 1] = spanTag;
        commentRef.current.innerHTML = tempInnerHTML.join("");
        setIstagged(false);
        setTaggedUserActive(false);
      }else if (e.key === "Enter" && (commentRef.current.innerText.trim().length > 0 ||
      selectedFile && selectedFile.length > 0)) {
          e.preventDefault();
        setMessageHandler("");
        sendMessageAPI();
        setSenderClass(true);
        setScrollDown(true);
        let UploadedFiles = [];
        if (selectedFile.length > 0) {
          for (const file of selectedFile) {
            const currentDate = new Date().toISOString().split("T")[0];
            const currentTime = new Date();
            const hours = currentTime.getHours().toString().padStart(2, "0");
            const minutes = currentTime.getMinutes().toString().padStart(2, "0");
            const seconds = currentTime.getSeconds().toString().padStart(2, "0");

            const formattedTime = `${hours}:${minutes}:${seconds}`;

            const filename = `${currentDate}-${formattedTime}-${file.name}`;
            const originalFilename = file.name;

            if (file.type.toLowerCase().startsWith("video/")) {
              setUploading(true);
              const storageRef = storage.ref(
                `videos/${allChannelItem?.enc_channelID}`
              );
              const videoname = originalFilename.replace(/\.mov$/, ".mp4");
              const videoFileName = `${currentDate}-${formattedTime}-${videoname}`;

              const updatedBlob = new Blob([file], { type: "video/mp4" });
              const fileRef = storageRef.child(videoFileName);

              try {
                await fileRef.put(updatedBlob);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            } else if (file.type.toLowerCase().startsWith("image/")) {
              setUploading(true);
              const storageRef = storage.ref(
                `images/${allChannelItem?.enc_channelID}`
              );
              const fileRef = storageRef.child(filename);

              try {
                await fileRef.put(file);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            } else {
              setUploading(true);
              const storageRef = storage.ref(
                `document/${allChannelItem?.enc_channelID}`
              );
              const fileRef = storageRef.child(filename);

              try {
                await fileRef.put(file);
                const downloadURL = await fileRef.getDownloadURL();
                UploadedFiles.push(downloadURL);
              } catch (error) {
                console.error("Error uploading file: ", error);
              } finally {
                setUploading(false);
              }
            }
          }
        }
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
              ? replyMessage.text.trim()
              : "",
            files: UploadedFiles.length > 0 ? UploadedFiles : "",
            isRepliedTo: replyMessageSection === true ? loginUserId : "",
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
          setSelectedFile([]);
          setSeeAttachment(false)
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
      if (listingChats?.length) {
     
        const matchingItem = listingChats.find((item: any) =>
          getTaggedData.some(
            (taggedItem: any) => taggedItem.chatId === item.enc_chatID
          )
        );
        if (matchingItem) {
          const targetMessage = document.getElementById(
            matchingItem.enc_chatID
          );
          if (targetMessage) {
            setTimeout(() => {
              targetMessage.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 100);
          }
        } else {
          scrollToBottom();
        }
      }
      setScrollDown(false);
      setIstagged(false)
      commentRef.current.innerText = "";
    }
  }, [getTaggedData,showChat, listingChats]);

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
      localStorage.setItem("scrollDown", "false");
    } else if (upChat == "pinchat") {
      setIsPinChat(false);
      setPinChat(false);
      setUpChat("");
      localStorage.setItem("scrollDown", "false");
    }
  };
  const closeReplyMessage = () => {
    setReplyMessageSection(false);
  };

  const closeEditMessage = () =>{
    setEditMessage(false);
    commentRef.current.innerText = "";
  }

  useEffect(() => {
    if (initializeApp === "true" || allChannelItem) {
      try {
        const unsubscribe = firestore
          .collection(`ChannelUserMapping/${allChannelItem?.enc_channelID}/user`)
          .onSnapshot((snapshot: any) => {
            const userData: any = snapshot.docs.map((doc: any) => {
              const userEmpId = doc.get("userEmpId");
              return {
                // id: doc.id,
                enc_channelID: allChannelItem?.enc_channelID,
                isRead: loginUserId === userEmpId ? true : false,
                userEmpID: userEmpId,
                isTaggedUser: taggedUser.some(
                  (item: any) => item.userEmpId === userEmpId
                ),
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
    }

  }, [allChannelItem,taggedUser]);

  const chatListDropdown = (value: any) => {
    if (value.key === ChannelMenu.VIEW_HR_DETAILS) {
      window.open(
        `http://${NetworkInfo.VIEWHRDOMIN}/allhiringrequest/${allChannelItem?.hrID}`,
        "_blank"
      );
    }
    if (value.key === ChannelMenu.SEARCH_IN_CHAT) {
      setSearchInChat(true);
    }
    if (value.key === ChannelMenu.CHANNEL_LIBRARY) {
      setChannelLibrary(true);
      setBookMarkMessage(false);
      setenc_channelID(allChannelItem?.enc_channelID);
    }
    if (value.key === ChannelMenu.BOOKMARKS) {
      setBookMarkMessage(true);
      setChannelLibrary(false);
    }
  };

  useEffect(() => {
    if (showChatList) {
      setChannelLibrary(false);
      setBookMarkMessage(false);
    }
  }, [showChatList]);

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
    if (value.key === ChannelMenu.BOOKMARKS) {
      const userChatsQuery = firestore
        .collection("ChannelChatsMapping")
        .doc(allChannelItem?.enc_channelID)
        .collection("chats")
        .doc(item.enc_chatID)
        .collection("user_chats")
        .where("userEmpID", "==", loginUserId);
      userChatsQuery
        .get()
        .then((querySnapshot: any) => {
          // Process the data returned by the query
          querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            const updatedData = {
              ...data,
              IsBookMark: true,
              enc_chatID: item.enc_chatID,
            };
            doc.ref
              .update(updatedData)
              .then(() => {
                setShowBookMark(updatedData);
              })
              .catch((error: any) => {
                console.error("Error updating user chat data:", error);
              });

            // userChat.push(data);
            // Handle the data here
          });
        })
        .catch((error: any) => {
          console.error("Error getting user chats:", error);
        });
    }
  };

  useEffect(() => {
    if (allChannelItem?.enc_channelID) {
      const userChatsQuery = firestore
        .collectionGroup("user_chats")
        .where("IsBookMark", "==", true)
        .where("enc_channelID", "==", allChannelItem?.enc_channelID)
        .where("userEmpID", "==", loginUserId);
      userChatsQuery
        .get()
        .then((querySnapshot: any) => {
          let uniqueChatIDs = new Set();
          querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            uniqueChatIDs.add(data.enc_chatID);
          });
          const uniqueChatIDsArray: any = Array.from(uniqueChatIDs);
          setshowBookmarksData(uniqueChatIDsArray);
        })
        .catch((error: any) => {
          console.error("Error getting user chats:", error);
        });
    }
  }, [showBookMark, showChatList]);


  useEffect(() => {
    if (initializeApp === "true" || allChannelItem) {
      try {
        const firestore = firebase.firestore();
        const unsubscribe = firestore
          .collection(`ChannelUserMapping/${allChannelItem?.enc_channelID}/user`)
          .onSnapshot((snapshot:any) => {
            const userData: any = snapshot.docs.map((doc:any) => ({
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
  const getUnReadtaggedData = async (
    channelData: any,
    loginUserId: any,
    setTaggedData: any
  ) => {
    try {
      const query = firestore
        .collectionGroup("user_chats")
        .where("enc_channelID", "==", allChannelItem?.enc_channelID)
        .where("isRead", "==", false)
        .where("isTaggedUser", "==", true)
        .where("userEmpID", "==", loginUserId);

      const querySnapshot = await query.get();
      const taggedData: any = [];
      querySnapshot.forEach((doc: any) => {
        const data = doc.data();
        taggedData.push(data);
      });

      setTaggedData(taggedData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (allChannelItem) {
      getUnReadtaggedData(
        allChannelItem?.enc_channelID,
        loginUserId,
        setTaggedData
      );
    }
  }, [allChannelItem]);

  const onKeyPressHandler = (e: any) => {
    let tempString = commentRef.current.innerText;
    if (e.ctrlKey && e.which === 65) {
      setIstagged(false);
    }
    if (tempString.length === 0) setIstagged(false);
    if (e.key === "@" || e.which === "@") {
      setIstagged(true);
      setTaggedUserActive(true);

    } else if (e.which === 8) {
      if (
        tempString[tempString.length - 1] === "@" ||
        tempString[tempString.length] === 0
      )
        setIstagged(false);
      else if (tempString.length > 0 && tempString.includes("@"))
       { setIstagged(true);
        setTaggedUserActive(true);
}
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

  // const mouseOverEvent = async () => {
  //   try {
  //     const unsubscribe = firestore
  //       .collection(
  //         `ChannelChatsMapping/${allChannelItem?.enc_channelID}/chats`
  //       )
  //       .orderBy("date", "asc")
  //       .onSnapshot((snapshot: any) => {
  //         const messagesData = snapshot.docs.map((doc: any) => doc.data());
  //         // setListingChats(messagesData);
  //       });

  //     // Query user_chats for updating isRead status
  //     const userChatsQuery = firestore
  //       .collectionGroup("user_chats")
  //       .where("userEmpID", "==", loginUserId)
  //       .where("enc_channelID", "==", allChannelItem?.enc_channelID)
  //       .limit(limits.pageSize);

  //     const tempObj = { isRead: true }; // Update object

  //     const querySnapshot = await userChatsQuery.get();

  //     const batch = firestore.batch();

  //     querySnapshot.docs.forEach((snapshot: any) => {
  //       const docRef = snapshot.ref;
  //       batch.update(docRef, tempObj);
  //     });

  //     await batch.commit();

  //     // Return a cleanup function to unsubscribe when needed
  //     return () => {
  //       unsubscribe();
  //     };
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleReplyMessageClick = (originalMessageID:any) => {
    const targetMessage = document.getElementById(
      originalMessageID.reply_enc_ID
    );
    if (targetMessage) {
      setTimeout(() => {
        targetMessage.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const editMessageClick = (item: any) => {
    setEditData(item);
    setEditMessage(true);
    commentRef.current.innerHTML = displayNotes(item?.text).innerHTML;
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (commentRef.current) {
        const range: any = document.createRange();
        const sel: any = window.getSelection();
        range.selectNodeContents(commentRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        commentRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timerId);
  }, [isTagged]);

  return (
    <>
      {contextHolder}
      {!(showChatList || pinnedChatsDetails || snoozeChatsDetails) && (
        <main className={`${ChatListingStyles.main} ${toggle ? ChatListingStyles.chatListingExpanded : ""
          } ${toggle ? "" : ChatListingStyles.chatListingCollapsed}`}>
          {toggle && initializeApp === "true" && (
            <>
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
                {toggle && initializeApp === "true" && (
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
        // onMouseOver={mouseOverEvent}
        >
          {channelLibrary === true ? (
            <>
              <div className={ChatListingStyles.channelWindowHeader}>
                <div className={ChatListingStyles.channelHeaderLeft}>
                  <div
                    className={` ${ChatListingStyles.chatInitialThumb}`}
                    style={{ background: allChannelItem?.backGroudColor, color: allChannelItem?.fontColor }}
                  >
                    {allChannelItem?.companyInitial}
                  </div>
                  <div className={ChatListingStyles.channelName}>
                    {allChannelItem?.role} | {allChannelItem?.companyName}|
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

              <div className={ChatListingStyles.channelLibraryHeader}>
                <div className={ChatListingStyles.channelStatusLeft}>
                  <FiBookOpenSVG width="20" />
                  Channel Library
                </div>
                <div
                  className={ChatListingStyles.channelStatusRight}
                  onClick={() => setChannelLibrary(false)}
                >
                  <FiChevronLeftSVG width="14" height="14" />
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>)}
            <div
            className={`${
              channelLibrary === true
                ? ChatListingStyles.channelLibraryScrollWrapper
                : bookMarkMessage === true
                ? ChatListingStyles.bookmarkWindowWrap
                : ChatListingStyles.channelWindowInner
            } `}
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
            {channelLibrary === true ? (
              <ChannelLibrary enc_channelID={enc_channelID} />
            ) : bookMarkMessage === true ? (
              <BookMarkMessage
                setBookMarkMessage={setBookMarkMessage}
                enc_channelID={allChannelItem?.enc_channelID}
              />
            ) : (
              <div
                className={ChatListingStyles.channelWindowMessages}
                id="content"
              >
                {uploading && <div><Spin /></div>}
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
                            className={` ${ChatListingStyles.channelMessageMain} ${ChatListingStyles.systemGeneratedMainNotes} ${ChatListingStyles.lightGreyBg} `}

                          >
                            <div
                              className={ChatListingStyles.systemGeneratedHeaderNotes}
                            >
                              <span>Note By: {item.senderName}</span>
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
                          <div className={ChatListingStyles.channelMessageMain} id={item.enc_chatID}>
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
                              {item?.messageEdited && (
                                <span
                                  className={`${ChatListingStyles.timeStamp} ${ChatListingStyles.editedDots}`}
                                >
                                  Edited
                                </span>
                              )}
                              <Dropdown
                                className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                                placement="bottomRight"
                                menu={{
                                  items: showBookmarksData?.includes(item.enc_chatID) === true? chatDropdownNoBookMark: chatDropdown,
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
                              {showBookmarksData?.includes(item.enc_chatID) && (
                                <BookmarkIconSVG
                                  className={ChatListingStyles.bookmarkIcon}
                                />
                              )}
                            </div>
                            <div className={ChatListingStyles.channelMessageBoxWrap}>
                              <div
                                className={` ${ChatListingStyles.channelMessageBox} ${ChatListingStyles.channelMessageRight} ` } onClick={() => handleReplyMessageClick(item)}
                              >
                                <div className={ChatListingStyles.quotedMessage}>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizer(
                                        displayNotes(
                                          ReplyMessage(item?.enc_chatID)?.[0]
                                            ?.Replied
                                        ).innerHTML
                                      ),
                                    }}
                                  ></p>
                                  <div
                                    className={ChatListingStyles.quotedMessageChild}
                                  >
                                    <FiReplySVG width="10" height="16" />
                                    {ReplyMessage(item?.enc_chatID)?.[0]?.senderName}
                                    {/* <span>Today at 12:31PM</span> */}
                                  </div>
                                </div>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizer(
                                      displayNotes(item?.text).innerHTML
                                    ),
                                  }}
                                ></span>
                                  {item.senderName === username && (
                                  <div
                                    className={ChatListingStyles.chatReaction}
                                    onClick={() => editMessageClick(item)}
                                  >
                                    <div
                                      className={
                                        ChatListingStyles.chatReactionInner
                                      }
                                    >
                                      <div
                                        className={
                                          ChatListingStyles.chatReactionCircle
                                        }
                                      >
                                        <span
                                          className={
                                            ChatListingStyles.chatReactionSmile
                                          }
                                        >
                                          <MsgEditIcon />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
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
                        <div className={ChatListingStyles.channelMessageWrapper} id={item.enc_chatID}>
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
                              {item?.messageEdited && (
                                <span
                                  className={`${ChatListingStyles.timeStamp} ${ChatListingStyles.editedDots}`}
                                >
                                  Edited
                                </span>
                              )}
                              <Dropdown
                                className={` ${ChatListingStyles.dotMenuMain} ${ChatListingStyles.dotMenuhz} `}
                                placement="bottomRight"
                                menu={{
                                  items: showBookmarksData?.includes(item.enc_chatID) === true? chatDropdownNoBookMark: chatDropdown,
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
                              {showBookmarksData?.includes(item.enc_chatID) && (
                                <BookmarkIconSVG
                                  className={ChatListingStyles.bookmarkIcon}
                                />
                              )}
                            </div>
                            <div
                              className={` ${ChatListingStyles.channelMessageBox} ${username === item?.senderName
                                ? ChatListingStyles.channelMessageRight
                                : "null"
                                } `}
                            // dangerouslySetInnerHTML={{
                            //   __html: sanitizer(
                            //     displayNotes(item?.text).innerHTML
                            //   ),
                            // }}
                            >
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: sanitizer(
                                    displayNotes(item?.text).innerHTML
                                  ),
                                }}
                              ></p>
                               {item.senderName === username && (
                                  <div
                                    className={ChatListingStyles.chatReaction}
                                    onClick={() => editMessageClick(item)}
                                  >
                                    <div
                                      className={
                                        ChatListingStyles.chatReactionInner
                                      }
                                    >
                                      <div
                                        className={
                                          ChatListingStyles.chatReactionCircle
                                        }
                                      >
                                        <span
                                          className={
                                            ChatListingStyles.chatReactionSmile
                                          }
                                        >
                                          <MsgEditIcon />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              <ul
                                className={
                                  ChatListingStyles.imageItemInnerMsgBox
                                }
                              >
                                {item?.files?.length > 0
                                  ? item?.files &&
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
                                    const fileName =
                                      getFileNameFromUrl(fileitem);

                                    return (
                                      <li key={indexs}>
                                        {isImage && (
                                          <>
                                            <a
                                              download={fileName}
                                              onClick={() =>
                                                window.open(
                                                  fileitem,
                                                  "_blank"
                                                )
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
                                                window.open(
                                                  fileitem,
                                                  "_blank"
                                                ); // Open the link in a new tab
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
                                                window.open(
                                                  fileitem,
                                                  "_blank"
                                                )
                                              }
                                              download={fileName}
                                              title={fileName}
                                            >
                                              <FiIconPdf />
                                            </a>
                                          </>
                                        )}
                                        {isDoc && (
                                          <>
                                            <a
                                              // href={fileitem}
                                              onClick={() =>
                                                window.open(
                                                  fileitem,
                                                  "_blank"
                                                )
                                              }
                                              download={fileName}
                                              title={fileName}
                                            >
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
                                                window.open(
                                                  fileitem,
                                                  "_blank"
                                                )
                                              }
                                              // href={fileitem}
                                              download={fileName}
                                              title={fileName}
                                            >
                                              <FiIconWord />

                                              {/* <div>
                                                <div>{fileName}</div>
                                              </div> */}
                                            </a>
                                          </>
                                        )}
                                      </li>
                                    );
                                  })
                                  : ""}
                              </ul>
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
                 {editMessage === true && (
                  <div className={ChatListingStyles.replyToWrapper}>
                    <div className={ChatListingStyles.replyToTop}>
                      <span className={ChatListingStyles.editMeesageText}>
                        Edit Message
                      </span>
                      {/* <span className={ChatListingStyles.editMeesageIcon}>
                        <MsgEditIcon />
                      </span> */}
                       <span
                        className="chatWindowClose"
                        onClick={closeEditMessage}
                      ></span>
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
            )}
          </div>
          {channelLibrary === false && bookMarkMessage === false &&(
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
              {seeAttachment && (
                <span
                  className={` ${ChatListingStyles.channelAddMedia} ${ChatListingStyles.channelAddMediaActive} `}
                >
                  <div className={ChatListingStyles.mediaOptions}>
                    {/* <span>
                      <SmileIcon />
                      <div
                        className={` ${ChatListingStyles.chatPopup} ${ChatListingStyles.chatArrowBottom} ${ChatListingStyles.emojiPopup} `}
                        style={{
                          display: "none",
                        }}
                      >
                        <div className={ChatListingStyles.chatPopupInner}>
                          <div className={ChatListingStyles.emojiPopupSearch}>
                            <SearchIcon
                              className={ChatListingStyles.searchIcon}
                            />
                            <input type="text" placeholder="Search Emoji" />
                          </div>
                          <div className={ChatListingStyles.popupContent}>
                            <span>Smileys & People</span>
                          </div>
                        </div>
                      </div>
                    </span> */}

                    <span
                      className={
                        // selectedImage && ChatListingStyles.mediaOptionsActive
                        selectedImage ? ChatListingStyles.mediaOptionsActive : ""
                      }
                    >
                      <Tooltip
                        placement="bottom"
                        title="Add image & videos"
                      >
                        <input
                          type="file"
                          id="fileInput"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileSelect(e, "image")}
                          multiple
                          accept="image/*,video/*"
                        />
                        <label htmlFor="fileInput">
                          <FiImageSVG />
                        </label>
                      </Tooltip>
                      {selectedImage &&
                        selectedFile !== null &&
                        selectedFile.length > 0 && (
                          <div
                            className={` ${ChatListingStyles.chatPopup} ${ChatListingStyles.chatArrowBottom} ${ChatListingStyles.attachementPopup} `}
                          >
                            <div className={ChatListingStyles.chatPopupInner}>
                              <div className={ChatListingStyles.popupContent}>
                                <span>Attachments</span>
                                <div className={ChatListingStyles.attachedMedia}>
                                  {selectedFile.length > 0 &&
                                    selectedFile.map((file: any, index: any) => {
                                      const fileType = file.type.split("/")[0];
                                      // console.log("fileType", fileType);
                                      return (
                                        <span key={index}>
                                          <span
                                            className={
                                              ChatListingStyles.chatWindowClose
                                            }
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleFileClose(file);
                                            }}
                                          ></span>
                                          {fileType === "image" && (
                                            <img
                                              src={URL.createObjectURL(file)}
                                              alt={`Selected ${fileType}`}
                                              width="56"
                                              height="56"
                                            />
                                          )}
                                          {fileType === "video" && (
                                            <div
                                              onClick={(e) => {
                                                handleFileClose(file);
                                              }}
                                            >
                                              <video width="100" height="100">
                                                <source
                                                  src={URL.createObjectURL(file)}
                                                  type={file.type}
                                                />
                                                Your browser does not support the
                                                video tag.
                                              </video>
                                            </div>
                                          )}
                                          {/* {fileType === "application" && (
                                  <>
                                    <FiIconPDF />
                                    <div>{file.name}</div>
                                  </>
                                )} */}
                                        </span>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </span>


                    <span
                      className={
                        selectedDoc && ChatListingStyles.mediaOptionsActive
                      }
                    >
                      <Tooltip
                        placement="bottom"
                        title="Add document"
                      >
                        <input
                          type="file"
                          id="fileInput1"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileSelect(e, "doc")}
                          accept=".doc, .docx, .pdf, .txt, .XLS, .XLSX, .csv"
                          multiple
                        />
                        <label htmlFor="fileInput1">
                          <FiFolderPlusSVG />
                        </label>
                      </Tooltip>
                      {selectedDoc &&
                        selectedFile !== null &&
                        selectedFile.length > 0 && (
                          <div
                            className={` ${ChatListingStyles.chatPopup} ${ChatListingStyles.chatArrowBottom} ${ChatListingStyles.attachementPopup} `}
                          >
                            <div className={ChatListingStyles.chatPopupInner}>
                              <div className={ChatListingStyles.popupContent}>
                                <span>Attachments</span>
                                <div className={ChatListingStyles.attachedMedia}>
                                  {selectedFile.length > 0 &&
                                    selectedFile.map((file: any, index: any) => {
                                      const fileType = file.name.split(".")[1];
                                      return (
                                        <span key={index}>
                                          <span
                                            className={
                                              ChatListingStyles.chatWindowClose
                                            }
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleFileClose(file);
                                            }}
                                          ></span>

                                          {fileType === "docx" && (
                                            <>
                                              <FiIconWord />
                                              <div>{file.name}</div>
                                            </>
                                          )}
                                          {fileType === "xls" && (
                                            <>
                                              <FiIconWord />

                                              <div>{file.name}</div>
                                            </>

                                          )}
                                          {fileType === "xlsx" && (
                                            <>
                                              <FiIconWord />

                                              <div>{file.name}</div>
                                            </>
                                          )}
                                          {fileType === "csv" && (
                                            <>
                                              <FiIconWord />

                                              <div>{file.name}</div>
                                            </>
                                          )}
                                          {fileType === "doc" && (
                                            <>
                                              <FiIconWord />
                                              <div>{file.name}</div>
                                            </>
                                          )}
                                          {fileType === "txt" && (
                                            <>
                                              <FiIconWord />
                                              <div>{file.name}</div>
                                            </>
                                          )}
                                          {fileType === "pdf" && (
                                            <>
                                              <FiIconPDF />
                                              <div>{file.name}</div>
                                            </>
                                          )}
                                        </span>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </span>

                    {/* <span onChange={handleFileSelect}><FiFolderPlusSVG /></span> */}
                  </div>
                  <span
                    className={ChatListingStyles.mediaPlus}
                    onClick={() => setSeeAttachment(false)}
                  ></span>
                </span>
              )}
              {seeAttachment === false && (
                <span className={ChatListingStyles.channelAddMedia}>
                  <span
                    className={ChatListingStyles.mediaPlus}
                    onClick={() => setSeeAttachment(true)}
                  ></span>
                </span>
              )}
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
                                setTaggedUserActive(false);
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
          )}

        </div>
      )}
    </>
  );
};

export default ChatListing;
