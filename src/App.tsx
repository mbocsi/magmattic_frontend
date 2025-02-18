import { useEffect, useRef, useState } from "react";
import "./App.css";
import VoltageChart from "./VoltageChart";
import { VoltageData } from "./types";
import { ECharts } from "echarts/core";

const VOLTAGE_DATA_SIZE = 1000;

const App = () => {
	const [ws, setWs] = useState<WebSocket | null>(null);
	// const [counter, setCounter] = useState<number>(1000);
	const [voltageData, setVoltageData] = useState<VoltageData>(
		Array.from({ length: VOLTAGE_DATA_SIZE }, (_, i) => ({
			name: i,
			value: [i, 0],
		}))
	);
	const [voltageChart, setVoltageChart] = useState<ECharts | null>(null);

	const voltageChartRef = useRef<ECharts | null>(null);
	const counterRef = useRef<number>(1000);

	useEffect(() => {
		voltageChartRef.current = voltageChart;
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
					setVoltageData((prevData) => {
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
					// setFftData(
					// 	data.val.map(([name, value]) => ({ name, value }))
					// );
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

	return (
		<div>
			<VoltageChart setChart={setVoltageChart} />
		</div>
	);
};

export default App;
