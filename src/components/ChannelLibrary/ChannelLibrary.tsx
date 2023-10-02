import React, { useEffect, useState } from "react";
import ChannelLibraryStyles from "./ChannelLibrary.module.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FiIconPDF from "../../assets/svg/FiIconPDF.svg";
import FiVideoSVG from "../../assets/svg/FiVideoSVG.svg";
import FiCopySVG from "../../assets/svg/FiCopySVG.svg";
import FiIconWord from "../../assets/svg/FiIconWord.svg";
import FiDownloadSVG from "../../assets/svg/FiDownloadSVG.svg";
import FiLinkSVG from "../../assets/svg/FiLinkSVG.svg";
import FiExternalLinkSVG from "../../assets/svg/FiExternalLinkSVG.svg";
import firebaseConfig from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";


firebase.initializeApp(firebaseConfig);

const ChannelLibrary = ({ enc_channelID }: any) => {
  // Function to fetch all images and group them by month and year
  const fetchImagesGroupedByMonth = async (
    setimageMonths: any,
    settotalImagesCount: any
  ) => {
    try {
      // List all items (files and subfolders) in the folder
      const result = await folderRef.listAll();
      const totalImagesCount = result.items.length;
      settotalImagesCount(totalImagesCount);

      // Group images by month and year
      const imagesByMonth: any = {};

      await Promise.all(
        result.items.map(async (item) => {
          const url = await item.getDownloadURL();
          const filename = item.name;
          const fileDate: any = filename.split("-");
          const imageDate = new Date(fileDate[0], fileDate[1] - 1, fileDate[2]);

          const monthName = imageDate.toLocaleString("default", {
            month: "long",
          });
          const year = imageDate.getFullYear();

          const key = `${monthName}, ${year}`;

          if (!imagesByMonth[key]) {
            imagesByMonth[key] = [];
          }

          imagesByMonth[key].push({ url, name: item.name });
        })
      );
      const sortedKeys = Object.keys(imagesByMonth).sort().reverse();
      const sortedImagesByMonth: any = {};
      sortedKeys.forEach((key) => {
        sortedImagesByMonth[key] = imagesByMonth[key];
      });

      setimageMonths(sortedImagesByMonth);
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };
  const fetchVideoGroupedByMonth = async (
    setvideoMonths: any,
    settotalVideoCount: any
  ) => {
    try {
      // List all items (files and subfolders) in the folder
      const result = await folderRefVideo.listAll();
      const totalImagesCount = result.items.length;
      settotalVideoCount(totalImagesCount);

      // Group images by month and year
      const imagesByMonth: any = {};

      await Promise.all(
        result.items.map(async (item: any) => {
          const url = await item.getDownloadURL();
          const filename = item.name;
          const fileDate = filename.split("-");
          const imageDate = new Date(fileDate[0], fileDate[1] - 1, fileDate[2]);

          const monthName = imageDate.toLocaleString("default", {
            month: "long",
          });
          const year = imageDate.getFullYear();

          const key = `${monthName}, ${year}`;

          if (!imagesByMonth[key]) {
            imagesByMonth[key] = [];
          }

          imagesByMonth[key].push({ url, name: item.name });
        })
      );
      const sortedKeys = Object.keys(imagesByMonth).sort().reverse();
      const sortedImagesByMonth: any = {};
      sortedKeys.forEach((key) => {
        sortedImagesByMonth[key] = imagesByMonth[key];
      });

      setvideoMonths(sortedImagesByMonth);
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };
  const fetchDocumentGroupedByMonth = async (
    setdocumentMonths: any,
    settotalDocumentCount: any
  ) => {
    try {
      // List all items (files and subfolders) in the folder
      const result = await folderRefdocument.listAll();
      const totalImagesCount = result.items.length;
      settotalDocumentCount(totalImagesCount);

      // Group images by month and year
      const imagesByMonth: any = {};

      await Promise.all(
        result.items.map(async (item) => {
          const url = await item.getDownloadURL();
          const filename = item.name;
          const fileDate: any = filename.split("-");
          const imageDate = new Date(fileDate[0], fileDate[1] - 1, fileDate[2]);

          const monthName = imageDate.toLocaleString("default", {
            month: "long",
          });
          const year = imageDate.getFullYear();

          const key = `${monthName}, ${year}`;

          if (!imagesByMonth[key]) {
            imagesByMonth[key] = [];
          }

          imagesByMonth[key].push({ url, name: item.name });
        })
      );
      const sortedKeys = Object.keys(imagesByMonth).sort().reverse();
      const sortedImagesByMonth: any = {};
      sortedKeys.forEach((key) => {
        sortedImagesByMonth[key] = imagesByMonth[key];
      });

      setdocumentMonths(sortedImagesByMonth);
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };
  const fetchImageUrls = async (setImages: any) => {
    // Calculate the date for one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      // List all items (files and subfolders) in the folder
      const result = await folderRef.listAll();

      // Filter the items based on their timestamps
      const lastWeekImages = await Promise.all(
        result.items
          .filter((item) => {
            const filename = item.name;
            const fileDate: any = filename.split("-");
            const imageTimestamp = new Date(
              fileDate[0],
              fileDate[1] - 1,
              fileDate[2]
            );

            return imageTimestamp >= oneWeekAgo;
          })
          .map(async (item) => {
            const url = await item.getDownloadURL();
            return { url, name: item.name };
          })
      );
      setImages({ lastWeekImages });
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };
  const fetchVideoUrls = async (setVideos: any) => {
    // Calculate the date for one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      // List all items (files and subfolders) in the folder
      const result = await folderRefVideo.listAll();

      // Filter the items based on their timestamps
      const lastWeekvideo = await Promise.all(
        result.items
          .filter((item) => {
            const filename = item.name;
            const fileDate: any = filename.split("-");
            const videoTimestamp = new Date(
              fileDate[0],
              fileDate[1] - 1,
              fileDate[2]
            );

            return videoTimestamp >= oneWeekAgo;
          })
          .map(async (item) => {
            const url = await item.getDownloadURL();
            return { url, name: item.name };
          })
      );
      setVideos({ lastWeekvideo });
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };
  const fetchDocumentUrls = async (setDocuments: any) => {
    // Calculate the date for one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      // List all items (files and subfolders) in the folder
      const result = await folderRefdocument.listAll();

      // Filter the items based on their timestamps
      const lastWeekvideo = await Promise.all(
        result.items
          .filter((item: any) => {
            const filename = item.name;
            const fileDate: any = filename.split("-");
            const videoTimestamp = new Date(
              fileDate[0],
              fileDate[1] - 1,
              fileDate[2]
            );

            return videoTimestamp >= oneWeekAgo;
          })
          .map(async (item) => {
            const url = await item.getDownloadURL();
            return { url, name: item.name };
          })
      );
      setDocuments({ lastWeekvideo });
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };
  const [images, setImages] = useState({ lastWeekImages: [] });
  const [imageMonths, setimageMonths] = useState<any>({});
  const [totalImagesCount, settotalImagesCount] = useState(0);
  const [videos, setVideos] = useState({ lastWeekImages: [] });
  const [documents, setDocuments] = useState({ lastWeekImages: [] });
  const [videoMonths, setvideoMonths] = useState<any>({});
  const [documentMonths, setdocumentMonths] = useState<any>({});
  const [totalVideoCount, settotalVideoCount] = useState(0);
  const [totalDocumentCount, settotalDocumentCount] = useState(0);
  const [totalLinkCount, settotalLinkCount] = useState(0);
  const storage = firebase.storage();
  const folderRef = storage.ref(`/images/${enc_channelID}`);
  const folderRefVideo = storage.ref(`/videos/${enc_channelID}`);
  const folderRefdocument = storage.ref(`/document/${enc_channelID}`);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  useEffect(() => {
    fetchImageUrls(setImages);
    fetchVideoUrls(setVideos);
    fetchDocumentUrls(setDocuments);
  }, []);
  useEffect(() => {
    fetchImagesGroupedByMonth(setimageMonths, settotalImagesCount);
    fetchVideoGroupedByMonth(setvideoMonths, settotalVideoCount);
    fetchDocumentGroupedByMonth(setdocumentMonths, settotalDocumentCount);
  }, []);
  return (
    <div
      className={` ${ChannelLibraryStyles.channelWindow} ${ChannelLibraryStyles.channelLibraryWindow} `}
    >
      <div className={ChannelLibraryStyles.channelWindowInner}>
        <Tabs className={ChannelLibraryStyles.channelLibTabs}>
          <TabList>
            <Tab>Images</Tab>
            <Tab>Documents</Tab>
            <Tab>Videos</Tab>
            <Tab>Links</Tab>
          </TabList>

          <TabPanel className={ChannelLibraryStyles.tabContent}>
            <div className={ChannelLibraryStyles.contentGrid}>
              <ul>
                {/* {images.lastWeekImages.length > 0 && (
                  <li className={ChannelLibraryStyles.dividerText}>
                    Last Week
                  </li>
                )}
                {images.lastWeekImages.map((image) => (
                  <li>
                    <img
                      key={image.name}
                      src={image.url}
                      alt={image.name}
                      width="95"
                      height="95"
                    />
                  </li>
                ))} */}
                {Object.keys(imageMonths).map((monthYearKey) => (
                  <>
                    <li
                      key={monthYearKey}
                      className={ChannelLibraryStyles.dividerText}
                    >
                      {monthYearKey}
                    </li>

                    {imageMonths[monthYearKey].map((image: any) => (
                      <li>
                        <img
                          key={image.name}
                          src={image.url}
                          alt={image.name}
                          width="95"
                          height="95"
                        />
                      </li>
                    ))}
                  </>
                ))}

                {/* <li className={ChannelLibraryStyles.dividerText}>
                  April, 2023
                </li> */}
              </ul>
            </div>
          </TabPanel>
          <TabPanel className={ChannelLibraryStyles.tabContent}>
            <div className={ChannelLibraryStyles.assetGrid}>
              <ul>
                {Object.keys(documentMonths).map((monthYearKey) => (
                  <>
                    <li
                      key={monthYearKey}
                      className={ChannelLibraryStyles.dividerText}
                    >
                      {monthYearKey}
                    </li>

                    {documentMonths[monthYearKey].map((document: any) => (
                      <li>
                        <div className={ChannelLibraryStyles.gridContentLeft}>
                          {document.name.split(".")[1] == "pdf" ? (
                            <FiIconPDF />
                          ) : (
                            <FiIconWord />
                          )}
                          <div className={ChannelLibraryStyles.assetDetails}>
                            <div className={ChannelLibraryStyles.assetName}>
                              {document.name}
                            </div>
                            {/* <span>1 page</span>
                            <span>PDF</span> */}
                          </div>
                        </div>
                        <div className={ChannelLibraryStyles.gridContentRight}>
                          <FiDownloadSVG
                            width="14"
                            onClick={() => window.open(document.url)}
                          />
                          <span
                            className={ChannelLibraryStyles.textUnderline}
                            onClick={() => window.open(document.url)}
                          >
                            Download
                          </span>
                        </div>
                      </li>
                    ))}
                  </>
                ))}
              </ul>
            </div>
          </TabPanel>
          <TabPanel className={ChannelLibraryStyles.tabContent}>
            <div className={ChannelLibraryStyles.contentGrid}>
              <ul>
                {Object.keys(videoMonths).map((monthYearKey) => (
                  <>
                    <li
                      key={monthYearKey}
                      className={ChannelLibraryStyles.dividerText}
                    >
                      {monthYearKey}
                    </li>

                    {videoMonths[monthYearKey].map((video: any, index: any) => (
                      <li key={index}>
                        <video
                          width="95"
                          height="95"
                          onClick={() => window.open(video.url)}
                        >
                          <source src={video.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {/* <span>{video.name}</span> */}
                      </li>
                    ))}
                  </>
                ))}
              </ul>
            </div>
          </TabPanel>
          <TabPanel className={ChannelLibraryStyles.tabContent}>
            <div className={ChannelLibraryStyles.assetGrid}>
              <ul>
                <li className={ChannelLibraryStyles.dividerText}>
                  April, 2023
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <span className={ChannelLibraryStyles.iconLink}>
                      <FiLinkSVG width="13" />
                    </span>
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Zeux Innovation Linkedin
                      </div>
                      <span>https://www.linkedin.com/company</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <span className={ChannelLibraryStyles.iconCopy}>
                      <FiCopySVG width="13" />
                    </span>
                    <span className={ChannelLibraryStyles.buttonExLink}>
                      <FiExternalLinkSVG width="14" />
                      Open Link
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <span className={ChannelLibraryStyles.iconLink}>
                      <FiLinkSVG width="13" />
                    </span>
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela Website
                      </div>
                      <span>https://www.linkedin.com/company</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <span className={ChannelLibraryStyles.iconCopy}>
                      <FiCopySVG width="13" />
                    </span>
                    <span className={ChannelLibraryStyles.buttonExLink}>
                      <FiExternalLinkSVG width="14" />
                      Open Link
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <span className={ChannelLibraryStyles.iconLink}>
                      <FiLinkSVG width="13" />
                    </span>
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela Signeasy
                      </div>
                      <span>https://www.linkedin.com/company</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <span className={ChannelLibraryStyles.iconCopy}>
                      <FiCopySVG width="13" />
                    </span>
                    <span className={ChannelLibraryStyles.buttonExLink}>
                      <FiExternalLinkSVG width="14" />
                      Open Link
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      <div className={ChannelLibraryStyles.channelLibraryFooterWrap}>
        <div className={ChannelLibraryStyles.channelLibraryFooter}>
          {totalImagesCount > 0 && `${totalImagesCount} Photos`}
          {totalDocumentCount > 0 && `, ${totalDocumentCount} Documents`}
          {totalVideoCount > 0 && `, ${totalVideoCount} Videos`}
          {totalLinkCount > 0 && `, ${totalLinkCount}Links`}
        </div>
      </div>
    </div>
  );
};

export default ChannelLibrary;
