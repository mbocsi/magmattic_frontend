import { useEffect, useRef, useState } from "react";
import "./App.css";
import VoltageChart from "./VoltageChart";
import { Data } from "./types";
import { ECharts } from "echarts/core";
import FFTChart from "./FFTChart";
import FFTData from "./FFTData";
import VoltageData from "./VoltageData";

const VOLTAGE_DATA_SIZE = 1000;

const App = () => {
	const ws = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [address, setAddress] = useState<string | null>(
		"ws://localhost:44444"
	);

	const [voltageData, setVoltageData] = useState<Data>(
		Array.from({ length: VOLTAGE_DATA_SIZE }, (_, i) => ({
			name: i,
			value: [i, 0],
		}))
	);
	const [fftData, setFftData] = useState<Data>(
		Array.from({ length: VOLTAGE_DATA_SIZE }, (_, i) => ({
			name: i * 0.5,
			value: [i * 0.5, 0],
		}))
	);
	const [voltageChart, setVoltageChart] = useState<ECharts | null>(null);
	const [fftChart, setFftChart] = useState<ECharts | null>(null);

	const [minFreq, setMinFreq] = useState<number>(0);
	const [maxFreq, setMaxFreq] = useState<number>(500);

	const voltageChartRef = useRef<ECharts | null>(null);
	const fftChartRef = useRef<ECharts | null>(null);
	const counterRef = useRef<number>(1000);

	useEffect(() => {
		voltageChartRef.current = voltageChart;
		fftChartRef.current = fftChart;
	}, [voltageChart]);

	useEffect(() => {
		if (ws.current) {
			ws.current.close(); // Close existing connection before creating a new one
		}
		if (!address) return;

		const socket = new WebSocket(address);
		ws.current = socket;

		socket.onopen = () => {
			console.log("Connected to server:", address);
			setIsConnected(true);
		};

		socket.onclose = () => {
			console.log("Disconnected from server:", address);
			setIsConnected(false);
		};

		socket.onerror = (e) => {
			console.error("WebSocket error:", e);
			setIsConnected(false);
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case "voltage":
					setVoltageData((prevData: Data) => {
						const newData = [...prevData];
						data.val.forEach((val: number, i: number) => {
							newData.shift();
							newData.push({
								name: counterRef.current + i,
								value: [counterRef.current + i, val],
							});
						});
						return newData;
					});
					counterRef.current += data.val.length;
					break;

				case "fft":
					setFftData(
						data.val.map((val: [number, number]) => ({
							name: val[0],
							value: val,
						}))
					);
					break;

				default:
					console.log(`Unknown type detected: ${data.type}`);
			}
		};

		return () => {
			socket.close();
		};
	}, [address]);

	useEffect(() => {
		voltageChartRef?.current?.setOption({
			series: [{ data: voltageData }],
		});
	}, [voltageData]);

	useEffect(() => {
		fftChartRef?.current?.setOption({
			series: [{ data: fftData }],
		});
	}, [fftData]);

	function handleConnect(e: any) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const address = formData.get("address");
		if (typeof address === "string") setAddress(address);
	}

	function handleSnapShot(e: any) {
		const jsonString = JSON.stringify(
			{ voltageData: voltageData, fftData: fftData },
			null,
			2
		);
		const newWindow = window.open();
		if (!newWindow) return;
		newWindow.document.write(`<pre>${jsonString}</pre>`);
		newWindow.document.close();
	}

	function handleControl(data: {}) {
		ws.current?.send(JSON.stringify(data));
	}

	return (
		<div id="control-center">
			<header>
				<h1>Magmattic (dev) Client </h1>
			</header>
			<div className="layout">
				<aside id="sidebar">
					<form onSubmit={handleConnect} id="connect-form">
						<input
							type="text"
							className={
								isConnected
									? "input-connected"
									: "input-disconnected"
							}
							name="address"
							placeholder="ws://0.0.0.0:44444"
							defaultValue="ws://localhost:44444"
						/>
						<button type="submit" className="btn-primary">
							Connect
						</button>
						<button
							type="button"
							className="btn-secondary"
							onClick={() => setAddress(null)}
						>
							Disconnect
						</button>
					</form>
					<div id="controls">
						<h2>Controls</h2>
						<button onClick={handleSnapShot}>
							Take Data Snapshot
						</button>
						<label htmlFor="fft-duration">
							FFT Sample Duration (samples)
						</label>
						<input
							name="fft-duration"
							type="number"
							defaultValue={1000}
							onBlur={(e) =>
								handleControl({
									type: "adc",
									value: {
										M: e.target.value,
									},
								})
							}
						/>
						<label htmlFor="batch-size">Data batch size</label>
						<input
							name="batch-size"
							type="number"
							defaultValue={32}
							onBlur={(e) =>
								handleControl({
									type: "adc",
									value: { N: e.target.value },
								})
							}
						/>
					</div>
				</aside>
				<main id="data-display">
					<div className="chart">
						<VoltageChart
							width="100%"
							height="320px"
							setChart={setVoltageChart}
						/>
					</div>
					<div className="chart">
						<FFTChart
							chart={fftChart}
							width="100%"
							height="320px"
							setChart={setFftChart}
							minFreq={minFreq}
							maxFreq={maxFreq}
						/>
					</div>
					<div className="chart">
						<VoltageData voltageData={voltageData} />
					</div>
					<div className="chart">
						<FFTData
							fftData={fftData}
							minFreq={minFreq}
							setMinFreq={setMinFreq}
							maxFreq={maxFreq}
							setMaxFreq={setMaxFreq}
						/>
					</div>
				</main>
			</div>
		</div>
	);
};

export default App;
