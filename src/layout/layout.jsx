import { Outlet } from 'react-router-dom';
import LayoutStyle from './layout.module.css';
import { useState } from 'react';
import Collapse from '@Components/collapsible/collapsible.components';
import Header from '@Components/header/header.components';
import UpTabs from '@/components/upTabs/upTabs.components';
const Layout = () => {
	const [toggle, setToggle] = useState(false);
	return (
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
	);
};

export default Layout;
