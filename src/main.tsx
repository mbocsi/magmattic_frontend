import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import AppLayout from "./AppLayout.tsx";
import Dashboard from "./components/dashboard.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route index element={<Dashboard />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
