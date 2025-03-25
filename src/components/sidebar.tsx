import {
	Activity,
	BarChart2,
	Sliders,
	AudioWaveformIcon as Waveform,
} from "lucide-react";
import "./sidebar.css";
import { NavLink } from "react-router";

const navItems = [
	{ name: "Dashboard", href: "/", icon: Activity },
	{ name: "FFT Data", href: "/fft", icon: BarChart2 },
	{ name: "Time Domain", href: "/time-domain", icon: Waveform },
	{ name: "Calculations", href: "/calculations", icon: Sliders },
];
export default function Sidebar() {
	const connected = false;
	return (
		<aside className="sidebar">
			<div className="sidebar-content">
				<SidebarTitle title="Magmattic Client" />
				<ControlSection title="Navigation">
					{navItems.map((item) => (
						<div style={{ width: "100%" }} key={item.href}>
							<NavLink className="nav-link" to={item.href}>
								<item.icon className="nav-icon" />
								<span>{item.name}</span>
							</NavLink>
						</div>
					))}
				</ControlSection>
				<ControlSection title="Server">
					<label>Server Address</label>
					<input
						className={
							connected ? "input-connected" : "input-disconnected"
						}
						defaultValue="ws://magpi.local:44444"
					/>
					<button className="btn-primary">Connect</button>
					<button className="btn-secondary">Disconnect</button>
				</ControlSection>
				<ControlSection title="Controls">
					<label>Nbuf</label>
					<input />
				</ControlSection>
			</div>
		</aside>
	);
}

function SidebarTitle({ title }: { title: string }) {
	return (
		<div className="sidebar-title">
			<h2 className="sidebar-title">{title}</h2>
		</div>
	);
}

function ControlSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="control-section">
			<div className="control-title">{title}</div>
			<div className="control-content">{children}</div>
		</div>
	);
}
