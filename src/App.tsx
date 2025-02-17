import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./App.css";

function App() {
	const [url, setUrl] = useState<string | null>(null);
	const { sendMessage, lastMessage, readyState } = useWebSocket(url);

	useEffect(() => {
		if (lastMessage !== null) {
			console.log(lastMessage);
		}
	}, [lastMessage]);

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
			<p>Status: {connectionStatus}</p>
			<button onClick={handleConnect}>Connect</button>
			<button onClick={handleDisconnect}>Disconnect</button>
			<button onClick={handleChangeUrl}>Change URL</button>
			<button onClick={handleSendControl}>Send Messsage</button>
		</div>
	);
}

export default App;
