import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import AppLayout from "./AppLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import FFTPage from "./pages/FFTPage.tsx";
import TimeDomainPage from "./pages/TimeDomainPage.tsx";
import CalculationPage from "./pages/CalculationPage.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route index element={<Dashboard />} />
					<Route path="/fft" element={<FFTPage />} />
					<Route path="/time-domain" element={<TimeDomainPage />} />
					<Route path="/calculations" element={<CalculationPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
