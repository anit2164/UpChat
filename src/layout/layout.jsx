import { Outlet } from 'react-router-dom';
import LayoutStyle from './layout.module.css';
import { useState } from 'react';
import Collapse from '@Components/collapsible/collapsible.components';
import Header from '@Components/header/header.components';
import UpTabs from '@/components/upTabs/upTabs.components';

import { Dropdown, Space } from 'antd';
import InfoIcon from "../assets/svg/fiInfo.svg"
import SendIcon from "../assets/svg/fiSend.svg"
import BookmarkIcon from "../assets/svg/bookmarkIcon.svg"
import SearchIcon from "../assets/svg/search.svg"

const Layout = () => {
	const [toggle, setToggle] = useState(false);

	const items = [
	{
		label: 'PIN Channel',
		key: '0',
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

	const item1 = [
	{
		label: 'Test',
		key: '0',
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
				<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} menu={{
					item1,
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
				<div className={LayoutStyle.channelStatusLeft}>
				HR Status: In Process
				</div>
				<div className={LayoutStyle.channelStatusRight}>
				<span>6 members</span>
				<span className={LayoutStyle.channelStatusInfo}><img src={InfoIcon} /></span>
				</div>
			</div>
			<div className={LayoutStyle.channelWindowInner}>
				<div className={LayoutStyle.channelWindowMessages}>
				<div className={LayoutStyle.searchInChatWrapper}>
					<div className={LayoutStyle.searchInChatInner}>
					<img className={LayoutStyle.searchIcon} src={SearchIcon} />
					<input type="text" placeholder="Please allow me sometime" />
					<span className={LayoutStyle.closeIcon}></span>
					<span>3/17</span>
					</div>
				</div>

				<div className={LayoutStyle.channelMessageMain}>
					<div className={LayoutStyle.channelMessageInner}>
					<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
					<div className={LayoutStyle.profileName}>Prachi Porwal</div>
					<span className={` ${LayoutStyle.profileDesignation} ${LayoutStyle.sales} `}>Sales Consultant</span>
					<span className={LayoutStyle.timeStamp}>5:48PM</span>
					<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} menu={{
						item1,
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
					<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} menu={{
						item1,
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
					</div>
				</div>
				<div className={LayoutStyle.channelMessageMain}>
					<div className={LayoutStyle.channelMessageInner}>
					<img className={LayoutStyle.profileAvtar} src="https://i.pravatar.cc/40" width="30" height="30" />
					<div className={LayoutStyle.profileName}>Bhuvan Desai</div>
					<span className={LayoutStyle.timeStamp}>12:34PM</span>
					<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} menu={{
						item1,
						}}
						trigger={['click']}>
						<a onClick={(e) => e.preventDefault()}>
						<Space>
							<span className={LayoutStyle.dotMenu}></span>
						</Space>
						</a>
					</Dropdown>
					<img className={LayoutStyle.bookmarkIcon} src={BookmarkIcon}/>
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
					<Dropdown className={` ${LayoutStyle.dotMenuMain} ${LayoutStyle.dotMenuhz} `} menu={{
						item1,
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
			<div className={LayoutStyle.channelWindowFooter}>
				<input type="text" placeholder="Please allow me sometime" />
				<span className={LayoutStyle.channelAddMedia}>
				<span className={LayoutStyle.mediaPlus}></span>
				</span>
				<span className={LayoutStyle.channelSubmit}>
				<img src={SendIcon}/>
				</span>
			</div>
		</div>
	</>
	);
};

export default Layout;
