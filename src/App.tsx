import { useEffect, useRef, useState } from "react";
import "./App.css";
import VoltageChart from "./VoltageChart";
import { VoltageData } from "./types";
import { ECharts } from "echarts/core";

const VOLTAGE_DATA_SIZE = 1000;

const App = () => {
	// const [ws, setWs] = useState<WebSocket>(
	// 	new WebSocket("ws://localhost:44444")
	// );
	const [counter, setCounter] = useState<number>(1000);
	const [voltageData, setVoltageData] = useState<VoltageData>(
		Array.from({ length: VOLTAGE_DATA_SIZE }, (_, i) => ({
			name: i,
			value: [i, 0],
		}))
	);
	const [voltageChart, setVoltageChart] = useState<ECharts | null>(null);

	const voltageChartRef = useRef<ECharts | null>(null);
	const counterRef = useRef<number>(0);

	useEffect(() => {
		voltageChartRef.current = voltageChart;
		counterRef.current = counter;
	}, [voltageChart, counter]);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:44444");

		ws.addEventListener("open", () => {
			console.log("Connected to server!");
		});

		ws.addEventListener("message", (event) => {
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

		return () => {
			ws.close();
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
