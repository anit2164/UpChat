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
  const [images, setImages] = useState({ lastWeekImages: [] });
  const [imageMonths, setimageMonths] = useState<any>({});
  const [totalImagesCount, settotalImagesCount] = useState(0);

  const storage = firebase.storage();
  const folderRef = storage.ref(`/images/${enc_channelID}`);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  useEffect(() => {
    fetchImageUrls(setImages);
  }, []);
  useEffect(() => {
    fetchImagesGroupedByMonth(setimageMonths, settotalImagesCount);
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
                <li className={ChannelLibraryStyles.dividerText}>
                  April, 2023
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela x Uplers
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Interview Window Schedule
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconWord />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela Talent Briefing
                      </div>
                      <span>3 pages</span>
                      <span>DOC</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela x Uplers
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Interview Window Schedule
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconWord />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela Talent Briefing
                      </div>
                      <span>3 pages</span>
                      <span>DOC</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela x Uplers
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Interview Window Schedule
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconWord />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela Talent Briefing
                      </div>
                      <span>3 pages</span>
                      <span>DOC</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela x Uplers
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Interview Window Schedule
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconWord />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela Talent Briefing
                      </div>
                      <span>3 pages</span>
                      <span>DOC</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela x Uplers
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Interview Window Schedule
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconWord />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela Talent Briefing
                      </div>
                      <span>3 pages</span>
                      <span>DOC</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela x Uplers
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconPDF />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Interview Window Schedule
                      </div>
                      <span>1 page</span>
                      <span>PDF</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
                <li>
                  <div className={ChannelLibraryStyles.gridContentLeft}>
                    <FiIconWord />
                    <div className={ChannelLibraryStyles.assetDetails}>
                      <div className={ChannelLibraryStyles.assetName}>
                        Andela Talent Briefing
                      </div>
                      <span>3 pages</span>
                      <span>DOC</span>
                    </div>
                  </div>
                  <div className={ChannelLibraryStyles.gridContentRight}>
                    <FiDownloadSVG width="14" />
                    <span className={ChannelLibraryStyles.textUnderline}>
                      Download
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </TabPanel>
          <TabPanel className={ChannelLibraryStyles.tabContent}>
            <div className={ChannelLibraryStyles.contentGrid}>
              <ul>
                <li className={ChannelLibraryStyles.dividerText}>Last Week</li>
                <li className={ChannelLibraryStyles.videoGrid}>
                  <img src="https://i.pravatar.cc/95" width="95" height="95" />
                  <span>
                    <FiVideoSVG />
                    02:21
                  </span>
                </li>
                <li className={ChannelLibraryStyles.videoGrid}>
                  <img src="https://i.pravatar.cc/95" width="95" height="95" />
                  <span>
                    <FiVideoSVG />
                    05:20
                  </span>
                </li>
                <li className={ChannelLibraryStyles.videoGrid}>
                  <img src="https://i.pravatar.cc/95" width="95" height="95" />
                  <span>
                    <FiVideoSVG />
                    01:00
                  </span>
                </li>
                <li className={ChannelLibraryStyles.videoGrid}>
                  <img src="https://i.pravatar.cc/95" width="95" height="95" />
                  <span>
                    <FiVideoSVG />
                    03:15
                  </span>
                </li>
                <li className={ChannelLibraryStyles.dividerText}>
                  April, 2023
                </li>
                <li className={ChannelLibraryStyles.videoGrid}>
                  <img src="https://i.pravatar.cc/95" width="95" height="95" />
                  <span>
                    <FiVideoSVG />
                    02:10
                  </span>
                </li>
                <li className={ChannelLibraryStyles.videoGrid}>
                  <img src="https://i.pravatar.cc/95" width="95" height="95" />
                  <span>
                    <FiVideoSVG />
                    04:16
                  </span>
                </li>
                <li className={ChannelLibraryStyles.videoGrid}>
                  <img src="https://i.pravatar.cc/95" width="95" height="95" />
                  <span>
                    <FiVideoSVG />
                    00:21
                  </span>
                </li>
                <li className={ChannelLibraryStyles.videoGrid}>
                  <img src="https://i.pravatar.cc/95" width="95" height="95" />
                  <span>
                    <FiVideoSVG />
                    01:00
                  </span>
                </li>
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
          {totalImagesCount > 0 && totalImagesCount} Photos, 16 Documents, 8
          Videos, 6 Links
        </div>
      </div>
    </div>
  );
};

export default ChannelLibrary;
