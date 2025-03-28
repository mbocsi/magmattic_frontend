import { Outlet } from "react-router";
import Sidebar from "./components/sidebar";
import "./AppLayout.css";
import { ProvideApp } from "./AppContext";

export default function AppLayout() {
	return (
		<div className="screen">
			<ProvideApp>
				<Sidebar />
				<Outlet />
			</ProvideApp>
		</div>
	);
}
