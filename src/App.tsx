import { useState, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	Title,
} from "chart.js";
import "./App.css";
import { FifoBuffer } from "./lib/buffer";

type VoltageData = { type: "voltage"; val: number };
type FFTData = { type: "fft"; val: number[][] };
type DataMessage = VoltageData | FFTData;

const VOLTAGE_LENGTH = 500;

ChartJS.register(
	CategoryScale,
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	Title
);

const options = {
	// scales: {
	// 	y: {
	// 		min: -1,
	// 		max: 1,
	// 	},
	// },
	animation: {
		duration: 0, // Set animation duration to 0
	},
	// or for specific animations
	animations: {
		y: {
			duration: 0,
		},
	},
};

function App() {
	const [url, setUrl] = useState<string | null>(null);
	const [voltageData, setVoltageData] = useState<FifoBuffer>(
		new FifoBuffer(VOLTAGE_LENGTH, [])
	);
	const [fftData, setFftData] = useState<number[][]>([]);
	const { readyState } = useWebSocket<DataMessage>(url, {
		onMessage: handleMessage,
	});

	function handleMessage(msg: MessageEvent) {
		if (!msg) return;
		const data = JSON.parse(msg.data);
		switch (data.type) {
			case "voltage":
				setVoltageData((prev) => prev.push(data.val));
				break;
			case "fft":
				setFftData(data.val);
				break;
			default:
				console.log(`Unknown type detected ${data.type}`);
		}
	}

	const handleConnect = useCallback(() => {
		console.log("Connecting to server");
		setUrl("ws://localhost:44444");
	}, []);

	const handleDisconnect = useCallback(() => {
		console.log("Disconnecting from server");
		setUrl(null);
	}, []);

	// const handleChangeUrl = useCallback(() => {
	// 	console.log("Clicked on change URL");
	// 	setUrl("10.140.85.161:44444");
	// }, []);

	// const handleSendControl = useCallback(() => {
	// 	console.log("Clicked on send control");
	// 	sendMessage("Hello Magmattic!");
	// }, []);

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
	}[readyState];

	return (
		<div>
			<h1>Magmattic Client</h1>
			<p>
				{url} Status: {connectionStatus}
			</p>
			<button onClick={handleConnect}>Connect</button>
			<button onClick={handleDisconnect}>Disconnect</button>
			<div style={{ display: "flex", flexDirection: "row" }}>
				<Line
					options={options}
					data={{
						labels: Array.from(
							{ length: VOLTAGE_LENGTH },
							(_, i) => i + 1
						),
						datasets: [
							{
								data: voltageData.getElements(),
								backgroundColor: "rgba(255, 99, 132, 1)",
							},
						],
					}}
					style={{ backgroundColor: "#FFFFFF" }}
				/>
				<Line
					options={options}
					data={{
						labels: Array.from(
							{ length: fftData.length },
							(_, i) => fftData[i][0]
						),
						datasets: [
							{
								data: Array.from(
									{ length: fftData.length },
									(_, i) => fftData[i][1]
								),
								backgroundColor: "rgba(255, 99, 132, 1)",
							},
						],
					}}
					style={{ backgroundColor: "#FFFFFF" }}
				/>
			</div>
		</div>
	);
}

export default App;
