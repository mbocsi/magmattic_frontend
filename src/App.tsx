import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState, SendMessage } from "react-use-websocket";
import "./App.css";
import { FifoBuffer } from "./lib/buffer";

type VoltageData = { type: "voltage"; val: number };
type FFTData = { type: "fft"; val: number[][] };
type DataMessage = VoltageData | FFTData;

const VOLTAGE_LENGTH = 32;

function App() {
	const [url, setUrl] = useState<string | null>(null);
	const [voltageData, setVoltageData] = useState<number[]>([]);
	const [fftData, setFftData] = useState<number[][]>([]);
	const { sendMessage, readyState } = useWebSocket<DataMessage>(url, {
		onMessage: handleMessage,
	});

	function handleMessage(msg: MessageEvent) {
		if (!msg) return;
		const data = JSON.parse(msg.data);
		switch (data.type) {
			case "voltage":
				setVoltageData((prev) => {
					const newArray = [...prev, data.val];
					if (newArray.length > VOLTAGE_LENGTH) {
						newArray.shift();
					}
					return newArray;
				});
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

	const handleChangeUrl = useCallback(() => {
		console.log("Clicked on change URL");
		setUrl("10.140.85.161:44444");
	}, []);

	const handleSendControl = useCallback(() => {
		console.log("Clicked on send control");
		sendMessage("Hello Magmattic!");
	}, []);

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
			<button onClick={handleChangeUrl}>Change URL</button>
			<button onClick={handleSendControl}>Send Messsage</button>
			<div style={{ display: "flex", flexDirection: "row" }}>
				<div>
					{voltageData.map((v, i) => (
						<div key={i}>{v}</div>
					))}
				</div>
				<div>
					{fftData.map((v, i) => (
						<div key={i}>{v}</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
