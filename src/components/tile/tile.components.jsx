import { Dropdown, Space } from 'antd';
import TileStyle from './tile.module.css';
import { ReactComponent as PinSVG } from '@SVG/pin.svg';
import { ReactComponent as FiSliderSVG } from '@SVG/fiSliders.svg';
import { ReactComponent as FiBookOpenSVG } from '@SVG/fiBookOpen.svg';
import { ReactComponent as FiVolumeMuteSVG } from '@SVG/fiVolumeMute.svg';
import { ReactComponent as FiLogoutSVG } from '@SVG/fiLogout.svg';

const Tile = () => {
	const items = [
		{
			label: 'PIN Channel',
			key: '0',
			icon: <PinSVG />,
		},
		{
			label: 'View HR Detail Page',
			key: '1',
			icon: <FiSliderSVG />,
		},
		{
			label: 'Channel Library',
			key: '2',
			icon: <FiBookOpenSVG />,
		},
		{
			label: 'Snooze',
			key: '3',
			icon: <FiVolumeMuteSVG />,
		},
		{
			type: 'divider',
		},
		{
			label: 'Leave',
			key: '4',
			icon: <FiLogoutSVG />,
		},
	];

	return (
		<div className={TileStyle.chatWrapper}>
			<div className={`${TileStyle.chatItem} ${TileStyle.unreadMsg}`}>
				<div className={TileStyle.dFlex}>
					<div
						className={` ${TileStyle.chatInitialThumb} ${TileStyle.blueThumb} `}>
						AN
					</div>
					<div className={TileStyle.chatGroupDetails}>
						<div className={TileStyle.channelName}>
							Senior Backend... | Andela | HR170523201242
						</div>
						<span className={TileStyle.hrStatus}>HR Status : In Process</span>
					</div>
				</div>
				<div className={TileStyle.dFlexTime}>
					<div className={TileStyle.timeStamp}>12:30 PM</div>
					<div className={TileStyle.unreadNum}>5</div>
					<Dropdown
						className={TileStyle.dotMenuMain}
						menu={{
							items,
						}}
						trigger={['click']}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<span className={TileStyle.dotMenu}></span>
							</Space>
						</a>
					</Dropdown>
				</div>
			</div>
		</div>
	);
};

export default Tile;
