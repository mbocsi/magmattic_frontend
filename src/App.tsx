import { useEffect, useRef, useState } from "react";
import "./App.css";
import VoltageChart from "./VoltageChart";
import { Data } from "./types";
import { ECharts } from "echarts/core";
import FFTChart from "./FFTChart";

const VOLTAGE_DATA_SIZE = 1000;

const App = () => {
	const [ws, setWs] = useState<WebSocket | null>(null);
	// const [counter, setCounter] = useState<number>(1000);
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

	const voltageChartRef = useRef<ECharts | null>(null);
	const fftChartRef = useRef<ECharts | null>(null);
	const counterRef = useRef<number>(1000);

	useEffect(() => {
		voltageChartRef.current = voltageChart;
		fftChartRef.current = fftChart;
	}, [voltageChart]);

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:44444");

		socket.addEventListener("open", () => {
			console.log("Connected to server!");
		});

		socket.addEventListener("message", (event) => {
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
		});

		setWs(socket);

		return () => {
			if (ws) ws.close();
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

	return (
		<div>
			<h1>Magmattic Client</h1>
			<VoltageChart setChart={setVoltageChart} />
			<FFTChart setChart={setFftChart} />
		</div>
	);
};

export default App;
