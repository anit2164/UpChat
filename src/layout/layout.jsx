import { Outlet } from 'react-router-dom';
import LayoutStyle from './layout.module.css';
import { useState } from 'react';
import Collapse from '@Components/collapsible/collapsible.components';
import Header from '@Components/header/header.components';
import UpTabs from '@/components/upTabs/upTabs.components';

import { DownOutlined, UserOutlined } from '@ant-design/icons';

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

const Layout = () => {
	const [toggle, setToggle] = useState(false);

	const items = [
		{
			label: 'PIN Channel',
			key: '0',
			icon: <UserOutlined />,
		},
		
		{
			label: 'View HR Detail Page',
			key: '1',
		},
		{
			label: 'Channel Library',
			key: '2',
		},
		{
			label: 'Snooze',
			key: '3',
		},
		{
			type: 'divider',
		},
		{
			label: 'Leave',
			key: '4',
		}
	];

	const channelMainDropdown = [
		{
			label: 'Search in chat',
			key: '0',
		},
		{
			label: 'Bookmarks',
			key: '1',
		},
		{
			label: 'Channel Library',
			key: '2',
		},
		{
			label: 'View HR Detail Page',
			key: '3',
		},
		{
			label: 'Snooze Channel',
			key: '4',
		},
	];

	const chatDropdown = [
		{
			label: 'Reply',
			key: '0',
		},
		{
			label: 'Copy',
			key: '1',
		},
		{
			label: 'Bookmark',
			key: '2',
		},
	];

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

		<div className={LayoutStyle.channelWindow}>
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
					<span className={LayoutStyle.channelStatusInfo}><InfoIcon /></span>
				</div>
			</div>
			<div className={LayoutStyle.channelWindowInner}>
				<div className={LayoutStyle.channelWindowMessages}>
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
							<div className={LayoutStyle.chatReaction}>
								<div className={LayoutStyle.chatReactionInner}>
									<div className={LayoutStyle.chatReactionCircle}>
										<span>
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
			</div>
			<div className={LayoutStyle.channelWindowFooter}>
				<input type="text" placeholder="Please allow me sometime" />
				<span className={LayoutStyle.channelAddMedia}>
					<span className={LayoutStyle.mediaPlus}></span>
				</span>
				<span className={LayoutStyle.channelSubmit}><SendIcon/></span>
			</div>
		</div>
	</>
	);
};

export default Layout;
