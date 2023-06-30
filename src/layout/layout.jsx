import { Outlet } from 'react-router-dom';
import LayoutStyle from './layout.module.css';
import { useEffect, useState } from 'react';
import Collapse from '@Components/collapsible/collapsible.components';
import Header from '@Components/header/header.components';
import UpTabs from '@/components/upTabs/upTabs.components';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Dropdown, Space } from 'antd';

import { ReactComponent as InfoIcon } from '@SVG/fiInfo.svg';
import { ReactComponent as SendIcon } from '@SVG/fiSend.svg';
import { ReactComponent as BookmarkIcon } from '@SVG/bookmarkIcon.svg';
import { ReactComponent as SearchIcon } from '@SVG/search.svg';
import { ReactComponent as ArrowIcon } from '@SVG/fiArrowRight.svg';
import { ReactComponent as SmileIcon } from '@SVG/fiSmile.svg';
import { ReactComponent as SmileIcon1 } from '@SVG/smileIcon-1.svg';
import { ReactComponent as SmileIcon2 } from '@SVG/smileIcon-2.svg';
import { ReactComponent as SmileIcon3 } from '@SVG/smileIcon-3.svg';
import { ReactComponent as SmileIcon4 } from '@SVG/smileIcon-4.svg';
import { ReactComponent as SmileIcon5 } from '@SVG/smileIcon-5.svg';
import { ReactComponent as SmileIcon6 } from '@SVG/smileIcon-6.svg';
import { ReactComponent as PinSVG } from '@SVG/pin.svg';
import { ReactComponent as BookmarkIconDark } from '@SVG/bookmarkIconDark.svg';
import { ReactComponent as FiBookOpenSVG } from '@SVG/fiBookOpen.svg';
import { ReactComponent as FiFilmSVG } from '@SVG/fiFilm.svg';
import { ReactComponent as FiVolumeMuteSVG } from '@SVG/fiVolumeMute.svg';

import { ReactComponent as FiReplySVG } from '@SVG/fiReply.svg';
import { ReactComponent as FiCopySVG } from '@SVG/fiCopy.svg';
import { ReactComponent as FiBookmarkOutlinedSVG } from '@SVG/fiBookmarkOutlined.svg';
import { ReactComponent as EmojiThumbsUpLightSkinSVG } from '@SVG/emojiThumbsUpLightSkin.svg';

import { ReactComponent as FiUsersSVG } from '@SVG/fiUsers.svg';
import { ReactComponent as FiUserPlusSVG } from '@SVG/fiUserPlus.svg';
import { ReactComponent as FiShareSVG } from '@SVG/fiShare.svg';
import { ReactComponent as FiImageSVG } from '@SVG/fiImage.svg';
import { ReactComponent as FiFolderPlusSVG } from '@SVG/fiFolderPlus.svg';
import { ReactComponent as ScrollToBottomSVG } from '@SVG/scrollToBottom.svg';
import { ReactComponent as FiChevronLeftSVG } from '@SVG/fiChevronLeft.svg';

const Layout = () => {
	const [toggle, setToggle] = useState(false);

	const channelMainDropdown = [
		{
			label: 'Search in chat',
			key: '0',
			icon: <SearchIcon />,
		},
		{
			label: 'Bookmarks',
			key: '1',
			icon: <BookmarkIconDark width="11" height="13" />,
		},
		{
			label: 'Channel Library',
			key: '2',
			icon: <FiBookOpenSVG />,
		},
		{
			label: 'View HR Detail Page',
			key: '3',
			icon: <FiFilmSVG />,
		},
		{
			type: 'divider',
		},
		{
			label: 'Snooze Channel',
			key: '4',
			icon: <FiVolumeMuteSVG />,
		},
	];

	const chatDropdown = [
		{
			label: 'Reply',
			key: '0',
			icon: <FiReplySVG />,
		},
		{
			label: 'Copy',
			key: '1',
			icon: <FiCopySVG />,
		},
		{
			label: 'Bookmark',
			key: '2',
			icon: <FiBookmarkOutlinedSVG />,
		},
	];

	const membersDropdown = [
		{
			key: '0',
			label: (
				<div className={LayoutStyle.membersMenuMain}>
					6 Members
					<span  className={LayoutStyle.chatWindowClose}></span>
				</div>
			),
			icon: <FiUsersSVG />,
		},
		{
			type: 'divider',
		},
		{
			key: '1',
			label: (
				<div className={LayoutStyle.membersArea}>
					<div className={LayoutStyle.membersAreaLeft}>
						<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
						<div className={LayoutStyle.profileName}>Prachi Porwal</div>
						<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.sales} `}>Sales Consultant</span>
					</div>
					<span className={LayoutStyle.removeLink}>Remove</span>
				</div>
			),
		},
		{
			key: '2',
			label: (
				<div className={LayoutStyle.membersArea}>
					<div className={LayoutStyle.membersAreaLeft}>
						<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
						<div className={LayoutStyle.profileName}>Majid Ali</div>
						<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.deliveryTeam} `}>Delivery Team</span>
					</div>
					<span className={LayoutStyle.removeLink}>Remove</span>
				</div>
			),
		},
		{
			key: '3',
			label: (
				<div className={LayoutStyle.membersArea}>
					<div className={LayoutStyle.membersAreaLeft}>
						<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
						<div className={LayoutStyle.profileName}>Darshan Modi</div>
						<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.coeteam} `}>COE Team</span>
					</div>
				</div>
			),
		},
		{
			key: '4',
			label: (
				<div className={LayoutStyle.membersArea}>
					<div className={LayoutStyle.membersAreaLeft}>
						<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
						<div className={LayoutStyle.profileName}>Bhuvan Desai</div>
					</div>
					<span className={LayoutStyle.removeLink}>Leave Chat</span>
				</div>
			),
		},
		{
			type: 'divider',
		},
		{
			label: (
				<div className={LayoutStyle.membersArea}>
					<div className={LayoutStyle.membersAreaLeft}>
						<FiUserPlusSVG />
						<div className={LayoutStyle.addMembers}>Add Members</div>
					</div>
					<span><FiShareSVG /></span>
				</div>
			),
		},
	];

	useEffect(() => {
		document.documentElement.scrollTop = document.documentElement.clientHeight;
		document.documentElement.scrollLeft = document.documentElement.clientWidth;
	}, []);

	return (
		<>
		<main className={LayoutStyle.main}>
			{toggle && (
				<>
					<Header setToggle={setToggle} />
					<UpTabs />
				</>
			)}

			<Collapse
				setToggle={setToggle}
				toggle={toggle}
			/>
		</main>

		{/* Channel Library Starts */}
		<div className={` ${LayoutStyle.channelWindow} ${LayoutStyle.channelLibraryWindow} `}>
			<div className={LayoutStyle.channelWindowHeader}>
				<div className={LayoutStyle.channelHeaderLeft}>
					<div className={` ${LayoutStyle.chatInitialThumb} ${LayoutStyle.blueThumb} `}>AN</div>
					<div className={LayoutStyle.channelName}>Senior Backend... | Andela | HR170523201242</div>
				</div>
				<div className={LayoutStyle.channelHeaderRight}>
					<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `}  placement="bottomRight" menu={{
						items: channelMainDropdown,
						}}
						trigger={['click']}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<span className={LayoutStyle.dotMenu}></span>
							</Space>
						</a>
					</Dropdown>
					<span  className={LayoutStyle.chatWindowClose}></span>
				</div>
			</div>

			<div className={LayoutStyle.channelLibraryHeader}>
				<div className={LayoutStyle.channelStatusLeft}>
					<FiBookOpenSVG width="20" />
					Channel Library
				</div>
				<div className={LayoutStyle.channelStatusRight}>
					<FiChevronLeftSVG width="14" height="14" />
				</div>
			</div>

			<div className={LayoutStyle.channelWindowInner}>
				<Tabs className={LayoutStyle.channelLibTabs}>
					<TabList>
						<Tab>Images</Tab>
						<Tab>Documents</Tab>
						<Tab>Videos</Tab>
						<Tab>Links</Tab>
					</TabList>

					<TabPanel className={LayoutStyle.tabContent}>
						<div className={LayoutStyle.contentGrid}>
							<ul>
								<li className={LayoutStyle.dividerText}>Last Week</li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li className={LayoutStyle.dividerText}>Last Week</li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
								<li><img src="https://i.pravatar.cc/95" width="95" height="95" /></li>
							</ul>
						</div>
					</TabPanel>
					<TabPanel>
						Documents
					</TabPanel>
					<TabPanel>
						Videos
					</TabPanel>
					<TabPanel>
						Links
					</TabPanel>
				</Tabs>
			</div>

			<div className={LayoutStyle.channelLibraryFooterWrap}>
				<div className={LayoutStyle.channelLibraryFooter}>
					24 Photos, 16 Documents, 8 Videos, 6 Links
				</div>
			</div>
		</div>
		{/* Channel Library Ends */}

		{/* Bookmarked Messages Starts */}
		{/* <div className={` ${LayoutStyle.channelWindow} ${LayoutStyle.bookmarkChannelWindow} `}>
			<div className={LayoutStyle.channelWindowHeader}>
				<div className={LayoutStyle.channelHeaderLeft}>
					<div className={` ${LayoutStyle.chatInitialThumb} ${LayoutStyle.blueThumb} `}>AN</div>
					<div className={LayoutStyle.channelName}>Senior Backend... | Andela | HR170523201242</div>
				</div>
				<div className={LayoutStyle.channelHeaderRight}>
					<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `}  placement="bottomRight" menu={{
						items: channelMainDropdown,
						}}
						trigger={['click']}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<span className={LayoutStyle.dotMenu}></span>
							</Space>
						</a>
					</Dropdown>
					<span  className={LayoutStyle.chatWindowClose}></span>
				</div>
			</div>

			<div className={LayoutStyle.bookMarkedHeader}>
				<div className={LayoutStyle.channelStatusLeft}>
					<BookmarkIconDark width="13" height="17" />
					Bookmarked messages
				</div>
				<div className={LayoutStyle.channelStatusRight}>
					<FiChevronLeftSVG width="14" height="14" />
				</div>
			</div>

			<div className={LayoutStyle.channelWindowInner}>
				<div className={LayoutStyle.channelWindowMessages}>
					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Bhuvan Desai</div>
							<span className={LayoutStyle.timeStamp}>12:34PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageRight} `}>
							<p>Yes <b>Prachi</b>, please allow me sometime will update you shortly regarding total number of talents available for interview.</p>
							<div className={LayoutStyle.messageReactionWrapper}>
								<span className={LayoutStyle.messageReaction}>
									<EmojiThumbsUpLightSkinSVG />2
								</span>
								<span className={LayoutStyle.messageReaction}>
									<EmojiThumbsUpLightSkinSVG />10
								</span>
							</div>
						</div>
					</div>

					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Darshan Modi</div>
							<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.deliveryTeam} `}>Delivery Team</span>
							<span className={LayoutStyle.timeStamp}>12:44PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
							<p>That will be great <b>Prachi</b> & <b>Bhuvan</b>, this will help us get things moving ahead with a schedule.</p>
						</div>
					</div>
				</div>
			</div>

			<div className={LayoutStyle.bookmarkWindowFooterWrap}>
				<div className={LayoutStyle.bookmarkWindowFooter}>
					2 Bookmarked Message
				</div>
			</div>
		</div> */}
		{/* Bookmarked Messages Ends */}

		<div className={` ${LayoutStyle.channelWindow} ${LayoutStyle.channelWindowTwo} `}>
			<div className={LayoutStyle.channelWindowHeader}>
				<div className={LayoutStyle.channelHeaderLeft}>
					<div className={` ${LayoutStyle.chatInitialThumb} ${LayoutStyle.blueThumb} `}>AN</div>
					<div className={LayoutStyle.channelName}>Senior Backend... | Andela | HR170523201242</div>
				</div>
				<div className={LayoutStyle.channelHeaderRight}>
					<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `}  placement="bottomRight" menu={{
						items: channelMainDropdown,
						}}
						trigger={['click']}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<span className={LayoutStyle.dotMenu}></span>
							</Space>
						</a>
					</Dropdown>
					<span  className={LayoutStyle.chatWindowClose}></span>
				</div>
			</div>
			<div className={LayoutStyle.channelWindowStatus}>
				<div className={LayoutStyle.channelStatusLeft}>HR Status: In Process</div>
				<div className={LayoutStyle.channelStatusRight}>
					<span>6 members</span>
					<Dropdown className={LayoutStyle.channelStatusInfo} placement="bottomRight" menu={{
						items: membersDropdown,
						}}
						trigger={['click']}
						>
						<InfoIcon />
					</Dropdown>
				</div>
			</div>

			
			<div className={LayoutStyle.channelWindowInner}>
				<div className={LayoutStyle.channelWindowMessages}>
					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Prachi Porwal</div>
							<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.sales} `}>Sales Consultant</span>
							<span className={LayoutStyle.timeStamp}>5:48PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
							<p>Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
							<div className={LayoutStyle.chatReaction}>
								<div className={LayoutStyle.chatReactionInner}>
									<div className={LayoutStyle.chatReactionPopup}>
										<span><SmileIcon1 /></span>
										<span><SmileIcon2 /></span>
										<span><SmileIcon3 /></span>
										<span><SmileIcon4 /></span>
										<span><SmileIcon5 /></span>
										<span><SmileIcon6 /></span>
										<span className={LayoutStyle.addNewEmoji}></span>
									</div>
									<div className={LayoutStyle.chatReactionCircle}>
										<span className={LayoutStyle.chatReactionActive}>
											<SmileIcon />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={LayoutStyle.divider}>
						<span>TODAY</span>
					</div>
					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Prachi Porwal</div>
							<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.sales} `}>Sales Consultant</span>
							<span className={LayoutStyle.timeStamp}>5:48PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
							<p>Hi <b>all</b> I would like to update that considering the provided HR details, how many more interviews can we schedule by tommorow.</p>
							<div className={LayoutStyle.messageReactionWrapper}>
								<span className={LayoutStyle.messageReaction}>
									<EmojiThumbsUpLightSkinSVG />2
								</span>
								<span className={LayoutStyle.messageReaction}>
									<EmojiThumbsUpLightSkinSVG />10
								</span>
							</div>
							<div className={LayoutStyle.chatReaction}>
								<div className={LayoutStyle.chatReactionInner}>
									<div className={LayoutStyle.chatReactionCircle}>
										<span className={LayoutStyle.chatReactionSmile}>
											<SmileIcon />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Bhuvan Desai</div>
							<span className={LayoutStyle.timeStamp}>12:34PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
							<BookmarkIcon className={LayoutStyle.bookmarkIcon} />
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageRight} `}>
						<p>Yes <b>Prachi</b>, please allow me sometime will update you shortly regarding total number of talents available for interview.</p>
						</div>
					</div>

					<div className={LayoutStyle.divider}>
						<span className={LayoutStyle.dividerInner}>2 Unread Messages</span>
					</div>

					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
						<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
						<div className={LayoutStyle.profileName}>Darshan Modi</div>
						<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.deliveryTeam} `}>Delivery Team</span>
						<span className={LayoutStyle.timeStamp}>12:44PM</span>
						<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
							items: chatDropdown,
							}}
							trigger={['click']}>
							<a onClick={(e) => e.preventDefault()}>
								<Space>
									<span className={LayoutStyle.dotMenu}></span>
								</Space>
							</a>
						</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
						<p>That will be great <b>Prachi</b> & <b>Bhuvan</b>, this will help us get things moving ahead with a schedule.</p>
						</div>
					</div>

					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Bhuvan Desai</div>
							<span className={LayoutStyle.timeStamp}>12:34PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
							<p>Here are the images you were asking for please check.</p>
							<div className={LayoutStyle.attachedMedia}>
								<img src="https://i.pravatar.cc/56" width="56" height="56" />
								<img src="https://i.pravatar.cc/56" width="56" height="56" />
								<img src="https://i.pravatar.cc/56" width="56" height="56" />
							</div>
						</div>
					</div>
				</div>
				
				<span className={LayoutStyle.scrollToBottom}><ScrollToBottomSVG /></span>
				
			</div>
			<div className={LayoutStyle.channelWindowFooterWrap}>
				<div className={LayoutStyle.channelWindowFooter}>
					<input type="text" placeholder="Please allow me sometime" />

					{/* User mention popup Starts */}
					<div className={` ${LayoutStyle.chatPopup} ${LayoutStyle.chatArrowBottom} ${LayoutStyle.userMentionPoup} `}
						style={{
							display: 'block'
						}}
					>
						<div className={LayoutStyle.chatPopupInner}>
							<div className={LayoutStyle.membersArea}>
								<div className={LayoutStyle.membersAreaLeft}>
									<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
									<div className={LayoutStyle.profileName}>Prachi PorwalPorwal</div>
									<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.sales} `}>Sales Consultant</span>
								</div>
							</div>
							<div className={LayoutStyle.membersArea}>
								<div className={LayoutStyle.membersAreaLeft}>
									<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
									<div className={LayoutStyle.profileName}>Majid Ali</div>
									<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.deliveryTeam} `}>Delivery Team</span>
								</div>
							</div>
							<div className={LayoutStyle.membersArea}>
								<div className={LayoutStyle.membersAreaLeft}>
									<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
									<div className={LayoutStyle.profileName}>Darshan Modi</div>
									<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.coeteam} `}>COE Team</span>
								</div>
							</div>
							<div className={LayoutStyle.membersArea}>
								<div className={LayoutStyle.membersAreaLeft}>
									<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
									<div className={LayoutStyle.profileName}>Chintan Doshi</div>
									<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.deliveryTeam} `}>Delivery Team</span>
								</div>
							</div>
							<div className={LayoutStyle.membersArea}>
								<div className={LayoutStyle.membersAreaLeft}>
									<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="24" height="24" />
									<div className={LayoutStyle.profileName}>Reema Madan</div>
									<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.sales} `}>Sales Consultant</span>
								</div>
							</div>
						</div>
					</div>
					{/* User mention popup Ends */}

					<span className={` ${LayoutStyle.channelAddMedia} ${LayoutStyle.channelAddMediaActive} `}>
						<div className={LayoutStyle.mediaOptions}>
							<span>
								<SmileIcon />
								<div className={` ${LayoutStyle.chatPopup} ${LayoutStyle.chatArrowBottom} ${LayoutStyle.emojiPopup} `}
									style={{
										display: 'none'
									}}
								>
									<div className={LayoutStyle.chatPopupInner}>
										<div className={LayoutStyle.emojiPopupSearch}>
											<SearchIcon className={LayoutStyle.searchIcon} />
											<input type="text" placeholder="Search Emoji" />
										</div>
										<div className={LayoutStyle.popupContent}>
											<span>Smileys & People</span>
										</div>
									</div>
								</div>

							</span>
							<span className={LayoutStyle.mediaOptionsActive}>
								<FiImageSVG />
								<div className={` ${LayoutStyle.chatPopup} ${LayoutStyle.chatArrowBottom} ${LayoutStyle.attachementPopup} `}
									style={{
										display: 'none'
									}}
								>
									<div className={LayoutStyle.chatPopupInner}>
										<div className={LayoutStyle.popupContent}>
											<span>Attachments</span>
											<div className={LayoutStyle.attachedMedia}>
												<span>
													<span className={LayoutStyle.chatWindowClose}></span>
													<img src="https://i.pravatar.cc/56" width="56" height="56" />
												</span>
												<span>
													<span className={LayoutStyle.chatWindowClose}></span>
													<img src="https://i.pravatar.cc/56" width="56" height="56" />
												</span>
												<span>
													<span className={LayoutStyle.chatWindowClose}></span>
													<img src="https://i.pravatar.cc/56" width="56" height="56" />
												</span>
											</div>
										</div>
									</div>
								</div>
							</span>
							<span><FiFolderPlusSVG /></span>
						</div>
						<span className={LayoutStyle.mediaPlus}></span>
					</span>
					<span className={LayoutStyle.channelSubmit}><SendIcon/></span>
				</div>
			</div>
		</div>

		<div  className={` ${LayoutStyle.channelWindow} ${LayoutStyle.channelWindowThree} `}>
			<div className={LayoutStyle.channelWindowHeader}>
				<div className={LayoutStyle.channelHeaderLeft}>
					<div className={` ${LayoutStyle.chatInitialThumb} ${LayoutStyle.blueThumb} `}>AN</div>
					<div className={LayoutStyle.channelName}>Senior Backend... | Andela | HR170523201242</div>
				</div>
				<div className={LayoutStyle.channelHeaderRight}>
					<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `}  placement="bottomRight" menu={{
						items: channelMainDropdown,
						}}
						trigger={['click']}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<span className={LayoutStyle.dotMenu}></span>
							</Space>
						</a>
					</Dropdown>
					<span  className={LayoutStyle.chatWindowClose}></span>
				</div>
			</div>
			<div className={LayoutStyle.channelWindowStatus}>
				<div className={LayoutStyle.channelStatusLeft}>HR Status: In Process</div>
				<div className={LayoutStyle.channelStatusRight}>
					<span>6 members</span>
					<Dropdown className={LayoutStyle.channelStatusInfo} placement="bottomRight" menu={{
						items: membersDropdown,
						}}
						trigger={['click']}
						>
						<InfoIcon />
					</Dropdown>
				</div>
			</div>
			<div className={LayoutStyle.channelWindowInner}>
				<div className={LayoutStyle.searchInChatWrapper}>
					<div className={LayoutStyle.searchInChatInner}>
						<SearchIcon className={LayoutStyle.searchIcon} />
						<input type="text" placeholder="Search in chat" />
						<span className={LayoutStyle.closeIcon}></span>
						<span className={LayoutStyle.numberOfSearch}>
							<span className={LayoutStyle.arrowIcon}><ArrowIcon /></span>
							3/17
							<span className={LayoutStyle.arrowIconRight}><ArrowIcon /></span>
						</span>
					</div>
				</div>
				<div className={LayoutStyle.channelWindowMessages}>
					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Bhuvan Desai</div>
							<span className={LayoutStyle.timeStamp}>12:34PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
							<BookmarkIcon className={LayoutStyle.bookmarkIcon} />
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageRight} `}>
							<div className={LayoutStyle.quotedMessage}>
								<p>That will be great <b>Prachi</b> & <b>Bhuvan</b>, this will help us get things moving ahead with a schedule.</p>
								<div className={LayoutStyle.quotedMessageChild}><FiReplySVG width="10" height="16" />Darshan Modi, <span>Today at 12:31PM</span></div>
							</div>
							<p>Yes <b>Darshan</b>, kindly proceed.</p>
							<div className={LayoutStyle.chatReaction}>
								<div className={LayoutStyle.chatReactionInner}>
									<div className={LayoutStyle.chatReactionCircle}>
										<span className={LayoutStyle.chatReactionSmile}>
											<SmileIcon />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Prachi Porwal</div>
							<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.sales} `}>Sales Consultant</span>
							<span className={LayoutStyle.timeStamp}>5:48PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
							<p>Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
							<div className={LayoutStyle.chatReaction}>
								<div className={LayoutStyle.chatReactionInner}>
									<div className={LayoutStyle.chatReactionPopup}>
										<span><SmileIcon1 /></span>
										<span><SmileIcon2 /></span>
										<span><SmileIcon3 /></span>
										<span><SmileIcon4 /></span>
										<span><SmileIcon5 /></span>
										<span><SmileIcon6 /></span>
										<span className={LayoutStyle.addNewEmoji}></span>
									</div>
									<div className={LayoutStyle.chatReactionCircle}>
										<span className={LayoutStyle.chatReactionActive}>
											<SmileIcon />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={LayoutStyle.divider}>
						<span>TODAY</span>
					</div>
					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Prachi Porwal</div>
							<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.sales} `}>Sales Consultant</span>
							<span className={LayoutStyle.timeStamp}>5:48PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
							<p>Hi <b>all</b> I would like to update that considering the provided HR details, how many more interviews can we schedule by tommorow.</p>
							<div className={LayoutStyle.messageReactionWrapper}>
								<span className={LayoutStyle.messageReaction}>
									<EmojiThumbsUpLightSkinSVG />2
								</span>
								<span className={LayoutStyle.messageReaction}>
									<EmojiThumbsUpLightSkinSVG />10
								</span>
							</div>
							<div className={LayoutStyle.chatReaction}>
								<div className={LayoutStyle.chatReactionInner}>
									<div className={LayoutStyle.chatReactionCircle}>
										<span className={LayoutStyle.chatReactionSmile}>
											<SmileIcon />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* System Generated Message Starts */}
					<div className={` ${LayoutStyle.channelMessageMain} ${LayoutStyle.systemGeneratedMain} `}>
						<div className={LayoutStyle.systemGeneratedHeader}>
							<span>Open HR Accepted | Action By: Harleen Kaur</span>
							<span>05-06-2023 | 12:24 PM</span>
						</div>
					</div>
					{/* System Generated Message Ends */}

					{/* System Generated Message Starts */}
					<div className={` ${LayoutStyle.channelMessageMain} ${LayoutStyle.systemGeneratedMain} `}>
						<div className={LayoutStyle.systemGeneratedHeader}>
							<span>Open HR Accepted | Action By: Harleen Kaur</span>
							<span>05-06-2023 | 12:24 PM</span>
						</div>
						<div className={` ${LayoutStyle.systemGeneratedInner} ${LayoutStyle.systemGeneratedCollapsed} `}>
							<span>Note: Years of exp
								a) .NET Developer Sr: 4 -6 years
								b) Test Automation Engineer Sr: 3.5 - 6 years
								c) Android Developer: 3 - 5 years
								d) iOS Developer: 3 - 5 years

								Key Skills:
								a) .NET Developer Sr : .Net + .Net Core + C# + Typescript (Angular)
								b) Test Automation Engineer Sr: Automation Testing + BDD Framework
								Selenium with Java +Jenkins

								Budget:
								a) .NET Developer Sr:15-17 LPA
								b) Test Automation Engineer Sr: 15-17 LPA
								c) Android Developer: 15-17 LPA
								d) iOS Developer: 15-17 LPA
								If we feel that a candidate is really good all he or she ticks all the boxes then we can consider 19LPA for them.

								Additional information
								Preference should be given to Bangalore candidates.
								Preference should be given to candidates with a lesser notice period.
								Avoid sourcing candidates from regions like Andhra Pradesh and Telangana.
							</span>
							<a href="javascript:void(0);">Read More</a>
						</div>
					</div>
					{/* System Generated Message Ends */}

					{/* System Generated Message Starts */}
					<div className={` ${LayoutStyle.channelMessageMain} ${LayoutStyle.systemGeneratedMain} `}>
						<div className={LayoutStyle.systemGeneratedHeader}>
							<span>Open HR Accepted | Action By: Harleen Kaur</span>
							<span>05-06-2023 | 12:24 PM</span>
						</div>
						<div className={` ${LayoutStyle.systemGeneratedInner} `}>
							<span>Note: Years of exp
								a) .NET Developer Sr: 4 -6 years
								b) Test Automation Engineer Sr: 3.5 - 6 years
								c) Android Developer: 3 - 5 years
								d) iOS Developer: 3 - 5 years

								Key Skills:
								a) .NET Developer Sr : .Net + .Net Core + C# + Typescript (Angular)
								b) Test Automation Engineer Sr: Automation Testing + BDD Framework
								Selenium with Java +Jenkins

								Budget:
								a) .NET Developer Sr:15-17 LPA
								b) Test Automation Engineer Sr: 15-17 LPA
								c) Android Developer: 15-17 LPA
								d) iOS Developer: 15-17 LPA
								If we feel that a candidate is really good all he or she ticks all the boxes then we can consider 19LPA for them.

								Additional information
								Preference should be given to Bangalore candidates.
								Preference should be given to candidates with a lesser notice period.
								Avoid sourcing candidates from regions like Andhra Pradesh and Telangana.
							</span>
							<a href="javascript:void(0);">Read Less</a>
						</div>
					</div>
					{/* System Generated Message Ends */}

					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
							<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
							<div className={LayoutStyle.profileName}>Bhuvan Desai</div>
							<span className={LayoutStyle.timeStamp}>12:34PM</span>
							<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
								items: chatDropdown,
								}}
								trigger={['click']}>
								<a onClick={(e) => e.preventDefault()}>
									<Space>
										<span className={LayoutStyle.dotMenu}></span>
									</Space>
								</a>
							</Dropdown>
							<BookmarkIcon className={LayoutStyle.bookmarkIcon} />
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageRight} `}>
						<p>Yes <b>Prachi</b>, please allow me sometime will update you shortly regarding total number of talents available for interview.</p>
						</div>
					</div>

					<div className={LayoutStyle.divider}>
						<span className={LayoutStyle.dividerInner}>2 Unread Messages</span>
					</div>

					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
						<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
						<div className={LayoutStyle.profileName}>Darshan Modi</div>
						<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.deliveryTeam} `}>Delivery Team</span>
						<span className={LayoutStyle.timeStamp}>12:44PM</span>
						<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
							items: chatDropdown,
							}}
							trigger={['click']}>
							<a onClick={(e) => e.preventDefault()}>
								<Space>
									<span className={LayoutStyle.dotMenu}></span>
								</Space>
							</a>
						</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
						<p>That will be great <b>Prachi</b> & <b>Bhuvan</b>, this will help us get things moving ahead with a schedule.</p>
						</div>
					</div>

					<div className={LayoutStyle.channelMessageMain}>
						<div className={LayoutStyle.channelMessageInner}>
						<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
						<div className={LayoutStyle.profileName}>Bhuvan Desai</div>
						<span className={LayoutStyle.timeStamp}>12:34PM</span>
						<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} placement="bottomRight" menu={{
							items: chatDropdown,
							}}
							trigger={['click']}>
							<a onClick={(e) => e.preventDefault()}>
								<Space>
									<span className={LayoutStyle.dotMenu}></span>
								</Space>
							</a>
						</Dropdown>
						</div>
						<div className={` ${LayoutStyle.channelMessageBox} ${LayoutStyle.channelMessageLeft} `}>
							<p>Here are the images you were asking for please check.</p>
							<div className={LayoutStyle.attachedMedia}>
								<img src="https://i.pravatar.cc/56" width="56" height="56" />
								<img src="https://i.pravatar.cc/56" width="56" height="56" />
								<img src="https://i.pravatar.cc/56" width="56" height="56" />
							</div>
						</div>
					</div>
				</div>

				{/* Reply To Message Feature Starts */}
				<div className={LayoutStyle.replyToWrapper}>
					<div className={LayoutStyle.replyToTop}>
						<FiReplySVG />Replying to Darshan Modi, <span>Today at 12:31PM</span>
						<span className={LayoutStyle.chatWindowClose}></span>
						</div>
					<div className={LayoutStyle.replyToMessage}>
						<p>That will be great <b>Prachi & Bhuvan</b>, this will help us get things moving ahead with a schedule.</p>
						{/* <p>That will be great <b>Prachi & Bhuvan</b>, this will help us get things moving ahead with a schedule. That will be great Prachi & Bhuvan, this will help us get things moving ahead with a schedule. That will be great Prachi & Bhuvan, this will help us get things moving ahead with a schedule. That will be great Prachi & Bhuvan, this will help us get things moving ahead with a schedule.</p> */}
					</div>
				</div>
				{/* Reply To Message Feature Ends */}
			</div>
			<div className={LayoutStyle.channelWindowFooterWrap}>
				<div className={LayoutStyle.channelWindowFooter}>
					<input type="text" placeholder="Please allow me sometime" />
					<span className={LayoutStyle.channelAddMedia}>
						<span className={LayoutStyle.mediaPlus}></span>
					</span>
					<span className={LayoutStyle.channelSubmit}><SendIcon/></span>
				</div>
			</div>
		</div>
	</>
	);
};

export default Layout;
