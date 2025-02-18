import "./style.css";
import * as echarts from "echarts/core";
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LineChart,
	CanvasRenderer,
	UniversalTransition,
]);

var voltageChartDom = document.getElementById("main");
var voltageChart = echarts.init(voltageChartDom);
var voltageOption;

const VOLTAGE_LENGTH = 1000;
let voltageData: { name: number; value: number[] }[] = [];
let counter = 0;

for (let i = 0; i < VOLTAGE_LENGTH; i++) {
	voltageData.push({ name: counter, value: [counter, 0] });
	counter += 1;
}

voltageOption = {
	title: {
		text: "Voltage vs Time",
	},
	tooltip: {
		trigger: "axis",
		formatter: function (params) {
			params = params[0];
			return params.name + " : " + params.value[1];
		},
		axisPointer: {
			animation: false,
		},
	},
	xAxis: {
		type: "time",
		splitLine: {
			show: false,
		},
	},
	yAxis: {
		type: "value",
		// boundaryGap: [0, "100%"],
		splitLine: {
			show: true,
		},
	},
	series: [
		{
			name: "Voltage",
			data: voltageData,
			showSymbol: false,
			type: "line",
		},
	],
	animationThreshold: 2000,
	animationDurationUpdate: 100,
	animationEasingUpdate: (t: number) => t,
};

voltageOption && voltageChart.setOption(voltageOption);

// ==== FFT ====

let fftData: { name: number; value: number[] }[] = [];
for (let i = 0; i < 1000; i++) {
	fftData.push({ name: i * 0.5, value: [i * 0.5, 0] });
}

var fftChartDom = document.getElementById("fft");
var fftChart = echarts.init(fftChartDom);
var fftOption;
fftOption = {
	title: {
		text: "FFT",
	},
	tooltip: {
		trigger: "axis",
		formatter: function (params) {
			params = params[0];
			return params.name + " : " + params.value[1];
		},
		axisPointer: {
			animation: false,
		},
	},
	xAxis: {
		type: "value",
		splitLine: {
			show: false,
		},
	},
	yAxis: {
		type: "value",
		// boundaryGap: [0, "100%"],
		splitLine: {
			show: false,
		},
	},
	series: [
		{
			name: "FFT",
			data: fftData,
			showSymbol: false,
			type: "line",
		},
	],
	animationThreshold: 2000,
	animationDurationUpdate: 100,
	animationEasingUpdate: (t: number) => t,
};

fftOption && fftChart.setOption(fftOption);

// // =========== WS Stuff ===============

const socket = new WebSocket("ws://10.141.199.55:44444");

// Connection opened
socket.addEventListener("open", (event) => {
	console.log("Connected to server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
	const data = JSON.parse(event.data);
	switch (data.type) {
		case "voltage":
			for (let i = 0; i < data.val.length; i++) {
				voltageData.shift();
				voltageData.push({
					name: counter,
					value: [counter, data.val[i]],
				});
				counter += 1;
			}
			voltageChart.setOption({
				series: [
					{
						data: voltageData,
					},
				],
			});
			break;
		case "fft":
			for (let i = 0; i < data.val.length; i++) {
				fftData[i] = { name: data.val[i][0], value: data.val[i] };
			}
			fftChart.setOption({
				series: [
					{
						data: fftData,
					},
				],
			});
			break;
		default:
			console.log(`Unknown type detected ${data.type}`);
	}
});

// setInterval(function () {
// 	voltageChart.setOption({
// 		series: [
// 			{
// 				data: voltageData,
// 			},
// 		],
// 	});
// }, 100);

// setInterval(function () {
// 	fftChart.setOption({
// 		series: [
// 			{
// 				data: fftData,
// 			},
// 		],
// 	});
// }, 100);
