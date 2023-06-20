import { ReactComponent as ArrowDownSVG } from '@SVG/arrowDown.svg';
import HeaderStyle from './header.module.css';
const Header = ({ setToggle }) => {
	return (
		<div
			className={HeaderStyle.container}
			onClick={() => setToggle(false)}>
			<div className={HeaderStyle.containerBody}>
				<img
					src="https://www.w3schools.com/howto/img_avatar.png"
					className={HeaderStyle.avatar}
					alt="avatar"
					style={{
						cursor: 'pointer',
					}}
				/>
				<div className={HeaderStyle.title}>Bhuvan Desai</div>
			</div>
			<div>
				<ArrowDownSVG />
			</div>
		</div>
	);
};

export default Header;
