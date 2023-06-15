import CollapseStyle from './collapsible.module.css';
import { ReactComponent as ChatSVG } from '@SVG/chat.svg';
const Collapse = ({ setToggle, toggle }) => {
	return (
		<div
			className={CollapseStyle.container}
			onClick={() => setToggle(!toggle)}>
			<ChatSVG />
			<div className={CollapseStyle.label}>Upchat</div>
		</div>
	);
};

export default Collapse;
