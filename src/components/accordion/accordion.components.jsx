import { Fragment, useState } from 'react';
import AccordionStyle from './accordion.module.css';
import { ReactComponent as ArrowDownSVG } from '@SVG/arrowDown.svg';
import Tile from '@Components/tile/tile.components';

const Accordion = ({ icon, label, isCollapsible, accordionList }) => {
	const [showBody, setShowBody] = useState(true);

	const toggleAccordion = () => {
		setShowBody(!showBody);
	};
	return (
		<Fragment>
			<div
				className={AccordionStyle.container}
				onClick={isCollapsible ? toggleAccordion : null}>
				<div className={AccordionStyle.containerInnerHeader}>
					{icon}
					<div className={AccordionStyle.title}>{label}</div>
				</div>
				<div>
					<ArrowDownSVG />
				</div>
			</div>
			{showBody && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((item) => <Tile />)}
		</Fragment>
	);
};

export default Accordion;
