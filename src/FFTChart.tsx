import { useEffect } from "react";
import "./App.css";
import * as echarts from "echarts/core";
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { Data } from "./types";

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LineChart,
	CanvasRenderer,
	UniversalTransition,
]);

const FFTChart = ({ setChart }: { setChart: (x: echarts.ECharts) => void }) => {
	useEffect(() => {
		var chartDom = document.getElementById("fft-chart");
		var chart = echarts.init(chartDom);
		console.log(chart);
		setChart(chart);
		var option = {
			title: {
				text: "FFT",
			},
			tooltip: {
				trigger: "axis",
				formatter: function (params: Data) {
					const point = params[0];
					return point.name + " : " + point.value[1];
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
					show: true,
				},
			},
			series: [
				{
					name: "FFT",
					data: [],
					showSymbol: false,
					type: "line",
				},
			],
			animationThreshold: 2000,
			animationDurationUpdate: 100,
			animationEasingUpdate: (t: number) => t,
		};

		option && chart.setOption(option);
	}, []);

	return <div id="fft-chart" style={{ width: "1600px", height: "400px" }} />;
};

export default FFTChart;
