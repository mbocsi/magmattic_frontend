import { Outlet } from "react-router";
import Sidebar from "./components/sidebar";
import "./AppLayout.css";

export default function AppLayout() {
	return (
		<div className="screen">
			<Sidebar />
			<Outlet />
		</div>
	);
}
