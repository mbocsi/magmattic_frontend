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

type VoltageData = { type: "voltage"; val: number[] };
type FFTData = { type: "fft"; val: number[][] };
type DataMessage = VoltageData | FFTData;

const VOLTAGE_LENGTH = 1000;

ChartJS.register(
	CategoryScale,
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	Title
);

function App() {
	const [url, setUrl] = useState<string | null>(null);
	const [voltageData, setVoltageData] = useState<FifoBuffer>(
		new FifoBuffer(VOLTAGE_LENGTH, [])
	);
	const [fftData, setFftData] = useState<number[][]>([]);
	const { readyState, lastJsonMessage } = useWebSocket<DataMessage>(url, {
		// onMessage: handleMessage,
	});
	const [labels, setLabels] = useState<number[]>([0]);

	const vData = {
		datasets: [
			{
				label: "Voltage",
				pointRadius: 0,
				showLine: true,
				data: [] as any,
				backgroundColor: "rgba(255, 99, 132, 1)",
			},
		],
	};
	const vOptions = {
		xAxes: [
			{
				type: "realtime",
				realtime: {
					onRefresh: function () {
						if (
							!lastJsonMessage ||
							lastJsonMessage.type !== "voltage"
						)
							return;
						vData.datasets[0].data.push(
							lastJsonMessage.val.map((v, i) => ({
								x: labels[labels.length - 1] + i,
								y: v,
							}))
						);
						const newLabels = [...labels];
						for (let i = 0; i < lastJsonMessage.val.length; i++) {
							newLabels.push(labels[labels.length - 1] + i + 1);
						}
						while (newLabels.length > 1000) {
							newLabels.shift();
						}
						setLabels(newLabels);
					},
					delay: 300,
					refresh: 10,
				},
			},
		],
		yAxes: [
			{
				scaleLabel: {
					display: true,
					fontFamily: "Arial",
					labelString: "Moment",
					fontSize: 20,
					fontColor: "#6c757d",
				},
				ticks: {
					max: 100,
					min: 0,
				},
			},
		],
		animation: {
			duration: 10, // Set animation duration to 0
			easing: "linear",
		},
		elements: {
			point: {
				radius: 0,
			},
		},
	};

	// function handleMessage(msg: MessageEvent) {
	// 	if (!msg) return;
	// 	const data = JSON.parse(msg.data);
	// 	switch (data.type) {
	// 		case "voltage":
	// 			setVoltageData((prev) => prev.push(data.val));
	// 			const newLabels = [...labels];
	// 			for (let i = 0; i < data.val.length; i++) {
	// 				newLabels.push(labels[labels.length - 1] + 1);
	// 			}
	// 			while (newLabels.length > 1000) {
	// 				newLabels.shift();
	// 			}
	// 			setLabels(newLabels);
	// 			break;
	// 		case "fft":
	// 			setFftData(data.val);
	// 			break;
	// 		default:
	// 			console.log(`Unknown type detected ${data.type}`);
	// 	}
	// }

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
					options={vOptions}
					data={vData}
					style={{ backgroundColor: "#FFFFFF" }}
				/>
				{/* <Line
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
				/> */}
			</div>
		</div>
	);
}

export default App;
