import { useState, useEffect } from "react";
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
import { VoltageData, VoltageDataPoint } from "./types";

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LineChart,
	CanvasRenderer,
	UniversalTransition,
]);

const VoltageChart = ({
	setChart,
}: {
	setChart: (x: echarts.ECharts) => void;
}) => {
	useEffect(() => {
		var voltageChartDom = document.getElementById("main");
		var voltageChart = echarts.init(voltageChartDom);
		console.log(voltageChart);
		setChart(voltageChart);
		var voltageOption = {
			title: {
				text: "Voltage vs Time",
			},
			tooltip: {
				trigger: "axis",
				formatter: function (params: VoltageData) {
					const point = params[0];
					return point.name + " : " + point.value[1];
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
					data: [],
					showSymbol: false,
					type: "line",
				},
			],
			animationThreshold: 2000,
			animationDurationUpdate: 100,
			animationEasingUpdate: (t: number) => t,
		};

		voltageOption && voltageChart.setOption(voltageOption);
	}, []);

	return <div id="main" style={{ width: "1000px", height: "500px" }} />;
};

export default VoltageChart;
