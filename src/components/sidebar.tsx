import {
	Activity,
	BarChart2,
	Sliders,
	AudioWaveformIcon as Waveform,
} from "lucide-react";
import "./sidebar.css";
import { NavLink } from "react-router";
import ToggleButton from "./togglebutton";
import { useApp } from "../AppContext";

const navItems = [
	{ name: "Dashboard", href: "/", icon: Activity },
	{ name: "FFT Data", href: "/fft", icon: BarChart2 },
	{ name: "Time Domain", href: "/time-domain", icon: Waveform },
	{ name: "Calculations", href: "/calculations", icon: Sliders },
];

export default function Sidebar() {
	const {
		isConnected,
		rollingFft,
		setRollingFft,
		connectWebsocket,
		disconnectWebsocket,
		sendWebsocket,
		Nsig,
		setNsig,
		Ntot,
		setNtot,
		Nbuf,
		setNbuf,
		sampleRate,
		setSampleRate,
		windowFunc,
		setWindowFunc,
		createDump,
		motorVel,
		setMotorVel,
	} = useApp();

	return (
		<aside className={`sidebar ${isConnected ? "connected" : ""}`}>
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
					<label htmlFor="server-address">Server Address</label>
					<div style={{ width: "100%" }}>
						<input
							id="server-address"
							style={{ maxWidth: "100%" }}
							className={
								isConnected
									? "input-connected"
									: "input-disconnected"
							}
							defaultValue="ws://magpi.local:44444"
						/>
					</div>
					<div className="socket-buttons">
						<button
							className="btn-primary"
							onClick={() => {
								const input: HTMLInputElement =
									document.getElementById(
										"server-address"
									) as HTMLInputElement;

								connectWebsocket(input.value);
							}}
						>
							Connect
						</button>
						<button
							className="btn-secondary"
							onClick={disconnectWebsocket}
						>
							Disconnect
						</button>
					</div>
				</ControlSection>
				<ControlSection title="Controls" className="controls">
					<label htmlFor="Nbuf">Nbuf</label>
					<input
						id="Nbuf"
						type="number"
						value={Nbuf}
						onChange={(e) => setNbuf(parseInt(e.target.value))}
						onBlur={() =>
							sendWebsocket({
								topic: "adc/command",
								payload: { Nbuf: Nbuf },
							})
						}
					/>
					<label htmlFor="Nsig">Nsig</label>
					<input
						id="Nsig"
						type="number"
						value={Nsig}
						onChange={(e) => setNsig(parseInt(e.target.value))}
						onBlur={() =>
							sendWebsocket({
								topic: "calculation/command",
								payload: { Nsig: Nsig },
							})
						}
					/>
					<label htmlFor="Ntot">Ntot</label>
					<input
						id="Ntot"
						type="number"
						value={Ntot}
						onChange={(e) => setNtot(parseInt(e.target.value))}
						onBlur={() =>
							sendWebsocket({
								topic: "calculation/command",
								payload: { Ntot: Ntot },
							})
						}
					/>
					<label htmlFor="motor-speed">Motor Speed (Hz)</label>
					<input
						id="motor-speed"
						type="number"
						value={motorVel}
						onChange={(e) => setMotorVel(parseInt(e.target.value))}
						onBlur={() =>
							sendWebsocket({
								topic: "motor/command",
								payload: { freq: motorVel },
							})
						}
					/>
					<label htmlFor="sample-rate">Sample Rate</label>
					<select
						id="sample-rate"
						value={sampleRate}
						onChange={(e) => {
							const sample_rate = parseInt(e.target.value);
							setSampleRate(sample_rate);
							sendWebsocket({
								topic: "adc/command",
								payload: { sample_rate: sample_rate },
							});
						}}
					>
						<option value={400}>400 SPS</option>
						<option value={1200}>1200 SPS</option>
						<option value={2400}>2400 SPS</option>
						<option value={4800}>4800 SPS</option>
						<option value={7200}>7200 SPS</option>
					</select>
					<label htmlFor="window-function">Window Function</label>
					<select
						id="window-function"
						value={windowFunc}
						onChange={(e) => {
							const window = e.target.value;
							setWindowFunc(window);
							sendWebsocket({
								topic: "calculation/command",
								payload: { window: window },
							});
						}}
					>
						<option value="rectangular">Rectangular</option>
						<option value="hann">Hann</option>
						<option value="hamming">Hamming</option>
						<option value="blackman">Blackman</option>
						<option value="blackmanharris">Blackman-Harris</option>
					</select>
					<ToggleButton
						value={rollingFft}
						onChange={(e) => {
							setRollingFft(e.target.checked);
							sendWebsocket({
								topic: "calculation/command",
								payload: { rolling_fft: e.target.checked },
							});
						}}
						id="rolling-fft"
					>
						Rolling FFT - {rollingFft ? "On" : "Off"}
					</ToggleButton>
					<button onClick={createDump}>Open data dump</button>
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
	className,
}: {
	title: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`control-section ${className}`}>
			<div className="control-title">{title}</div>
			<div className="control-content">{children}</div>
		</div>
	);
}
