import { useEffect, useRef, useState } from "react";
import VoltageChart from "./VoltageChart";
import { Data } from "./types";
import { ECharts } from "echarts/core";
import FFTChart from "./FFTChart";
import FFTData from "./FFTData";
import VoltageData from "./VoltageData";
import "./App.css";
import Sidebar from "./components/sidebar";
import { Route, Routes } from "react-router";

const VOLTAGE_DATA_SIZE = 1200;

const App = () => {
	const ws = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);

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

	const [windowFunc, setWindowFunc] = useState<string>("rectangular");
	const [Nbuf, setNbuf] = useState<number>(32);
	const [Nsig, setNsig] = useState<number>(1024);
	const [Ntot, setNtot] = useState<number>(1024);
	const [rollingFft, setRollingFft] = useState<boolean>(false);
	const [sampleRate, setSampleRate] = useState<number>(1000);

	const voltageChartRef = useRef<ECharts | null>(null);
	const fftChartRef = useRef<ECharts | null>(null);

	useEffect(() => {
		voltageChartRef.current = voltageChart;
		fftChartRef.current = fftChart;
	}, [voltageChart]);

	useEffect(() => {
		connectWebsocket("ws://magpi.local:44444");

		return () => {
			ws.current?.close();
		};
	}, []);

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

	function connectWebsocket(address: string) {
		if (ws.current) {
			ws.current.close(); // Close existing connection before creating a new one
		}
		if (!address) return;

		const socket = new WebSocket(address);
		ws.current = socket;

		socket.onopen = () => {
			console.log("Connected to server:", address);
			socket.send(
				JSON.stringify({
					topic: "subscribe",
					payload: {
						topics: [
							"voltage/data",
							"fft/data",
							"adc/status",
							"calculation/status",
						],
					},
				})
			);
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
			switch (data.topic) {
				case "voltage/data":
					setVoltageData((prevData: Data) => {
						const newData = prevData.slice(data.payload.length);
						const counter =
							prevData.length > 0
								? prevData[prevData.length - 1].name + 1
								: 0;

						const updatedData = data.payload.map(
							(val: number, i: number) => ({
								name: counter + i,
								value: [counter + i, val],
							})
						);

						return [...newData, ...updatedData];
					});
					break;

				case "fft/data":
					setFftData(
						data.payload.map((val: [number, number]) => ({
							name: val[0],
							value: val,
						}))
					);
					setWindowFunc(data.metadata.window);
					break;

				case "adc/status":
					console.log("Received adc status: ", data);
					setNbuf(data.payload.Nsig);
					setSampleRate(data.payload.sample_rate);
					break;

				case "calculation/status":
					console.log("Received calculation status: ", data);
					setNsig(data.payload.Nsig);
					setNtot(data.payload.Ntot);
					setWindowFunc(data.payload.window);
					setRollingFft(data.payload.rolling_fft);
					break;

				default:
					console.log(`Unknown topic detected: ${data}`);
			}
		};
	}

	function handleConnect(e: any) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const address = formData.get("address");
		if (typeof address === "string") connectWebsocket(address);
	}

	function handleSnapShot() {
		const jsonString = JSON.stringify(
			{
				voltageData: voltageData,
				fftData: fftData,
				metadata: {
					fftSignalLength: Nsig,
					fftTotalLength: Ntot,
					batchSize: Nbuf,
					rollingFft: rollingFft,
					windowFunction: windowFunc,
				},
			},
			null,
			2
		);
		const newWindow = window.open();
		if (!newWindow) return;
		newWindow.document.write(`<pre>${jsonString}</pre>`);
		newWindow.document.close();
	}

	function handleControl(data: {}) {
		console.log("Sending control data", data);
		ws.current?.send(JSON.stringify(data));
	}

	function handleWindowChange(e: any) {
		const value = e.target.value;
		handleControl({
			topic: "calculation/command",
			payload: { window: value },
		});
	}

	return <div>test</div>;
	/* <div id="control-center">
			<div className="layout">
				{/* <Sidebar /> */
	/* <aside id="sidebar">
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
							defaultValue="ws://magpi.local:44444"
						/>
						<button type="submit" className="btn-primary">
							Connect
						</button>
						<button
							type="button"
							className="btn-secondary"
							onClick={() => ws.current?.close()}
						>
							Disconnect
						</button>
					</form>
					<div id="controls">
						<h2>Controls</h2>
						<button onClick={handleSnapShot}>
							Take Data Snapshot
						</button>
						<label htmlFor="fft-signal-length">Signal Length</label>
						<input
							id="fft-signal-length"
							type="number"
							value={Nsig}
							onChange={(e) => setNsig(parseInt(e.target.value))}
							onBlur={() =>
								handleControl({
									topic: "calculation/command",
									payload: {
										Nsig: Nsig,
									},
								})
							}
						/>
						<label htmlFor="fft-total-length">
							Total FFT Length (padding)
						</label>
						<input
							id="fft-total-length"
							type="number"
							value={Ntot}
							onChange={(e) => setNtot(parseInt(e.target.value))}
							onBlur={() =>
								handleControl({
									topic: "calculation/command",
									payload: {
										Ntot: Ntot,
									},
								})
							}
						/>
						<label htmlFor="batch-size">Data batch size</label>
						<input
							id="batch-size"
							type="number"
							value={Nbuf}
							onChange={(e) => setNbuf(parseInt(e.target.value))}
							onBlur={() =>
								handleControl({
									topic: "adc/command",
									payload: { Nbuf: Nbuf },
								})
							}
						/>
						<label htmlFor="sample-rate">
							ADC sample rate (SPS)
						</label>
						<input
							id="sample-rate"
							type="number"
							value={sampleRate}
							onChange={(e) =>
								setSampleRate(parseInt(e.target.value))
							}
							onBlur={() =>
								handleControl({
									topic: "adc/command",
									payload: { sample_rate: sampleRate },
								})
							}
						/>
						<label htmlFor="rolling-fft">Rolling FFT</label>
						<input
							id="rolling-fft"
							type="checkbox"
							checked={rollingFft}
							onChange={(e) => {
								setRollingFft(e.target.checked);
								handleControl({
									topic: "calculation/command",
									payload: { rolling_fft: e.target.checked },
								});
							}}
						/>
						<label htmlFor="window-function">Window Function</label>
						<select
							onChange={handleWindowChange}
							value={windowFunc}
							id="window-function"
						>
							<option value="rectangular">Rectangular</option>
							<option value="hann">Hann</option>
							<option value="hamming">Hamming</option>
							<option value="blackman">Blackman</option>
							<option value="blackmanharris">
								Blackman-Harris
							</option>
						</select>
					</div>
				</aside> 
				<main id="data-display">
					<div className="chart">
						<VoltageChart
							width="100%"
							height="350px"
							setChart={setVoltageChart}
						/>
					</div>
					<div className="chart">
						<div className="chart-controls">
							<FFTChart
								width="100%"
								height="350px"
								setChart={setFftChart}
								setMinFreq={setMinFreq}
								setMaxFreq={setMaxFreq}
							/>
						</div>
					</div>
					<div className="chart">
						<VoltageData voltageData={voltageData} />
					</div>
					<div className="chart">
						<FFTData
							fftData={fftData}
							minFreq={minFreq}
							maxFreq={maxFreq}
							windowFunc={windowFunc}
						/>
					</div>
				</main>
			</div>
		</div> */
};

export default App;
