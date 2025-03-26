import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	ToolboxComponent,
	DataZoomComponent,
	BrushComponent,
	MarkPointComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { ECBasicOption } from "echarts/types/src/util/types.js";
import { Data } from "../types";

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LineChart,
	CanvasRenderer,
	UniversalTransition,
	ToolboxComponent,
	DataZoomComponent,
	BrushComponent,
	MarkPointComponent,
]);

export function FFTPhaseChart({
	chartRef,
	id,
	width,
	height,
}: {
	chartRef: React.RefObject<echarts.ECharts | null>;
	id: string;
	width: string;
	height: string;
}) {
	const options = {
		title: [
			{
				left: "center",
				text: "Magnitude",
			},
			{
				top: "50%",
				left: "center",
				text: "Phase",
			},
		],
		grid: [
			{
				bottom: "55%",
			},
			{
				top: "55%",
			},
		],
		toolbox: [
			{
				feature: {
					saveAsImage: {},
				},
			},
		],
		brush: {
			toolbox: ["lineX", "clear"],
			xAxisIndex: 0,
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
				animation: false,
				label: {
					backgroundColor: "#505765",
				},
			},
		},
		dataZoom: [
			{
				show: true,
				realtime: true,
				start: 0,
				end: 25,
			},
			{
				type: "inside",
				realtime: true,
				start: 0,
				end: 25,
			},
		],
		xAxis: [
			{
				type: "value",
				splitLine: {
					show: false,
				},
				axisLine: { onZero: false },
				boundaryGap: false,
			},
			{
				type: "value",
				splitLine: {
					show: false,
				},
				axisLine: { onZero: false },
				boundaryGap: false,
				gridIndex: 1,
			},
		],
		yAxis: [
			{
				type: "value",
				splitLine: {
					show: false,
				},
			},
			{
				type: "value",
				splitLine: {
					show: false,
				},
				gridIndex: 1,
			},
		],
		series: [
			{
				name: "Magnitude",
				areaStyle: {},
				lineStyle: {
					width: 1,
				},
				emphasis: {
					focus: "series",
				},
				data: [],
				showSymbol: false,
				type: "line",
			},
			{
				name: "Phase",
				areaStyle: {},
				lineStyle: {
					width: 1,
				},
				emphasis: {
					focus: "series",
				},
				data: [],
				showSymbol: false,
				type: "line",
				xAxisIndex: 1,
				yAxisIndex: 1,
			},
		],
		animationThreshold: 2000,
		animationDurationUpdate: 100,
		animationEasingUpdate: (t: number) => t,
	};

	return (
		<Chart
			id={id}
			chartRef={chartRef}
			width={width}
			height={height}
			options={options}
		/>
	);
}

export function VoltageChart({
	chartRef,
	id,
	width,
	height,
}: {
	chartRef: React.RefObject<echarts.ECharts | null>;
	id: string;
	width: string;
	height: string;
}) {
	const options = {
		title: {
			text: "Voltage vs Time",
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
			type: "time",
			splitLine: {
				show: false,
			},
		},
		yAxis: {
			type: "value",
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
	return (
		<Chart
			id={id}
			chartRef={chartRef}
			width={width}
			height={height}
			options={options}
		/>
	);
}

export function FFTChart({
	chartRef,
	id,
	width,
	height,
}: {
	chartRef: React.RefObject<echarts.ECharts | null>;
	id: string;
	width: string;
	height: string;
}) {
	const options = {
		title: {
			text: "FFT",
		},
		grid: {
			bottom: 80,
		},
		toolbox: {
			feature: {
				saveAsImage: {},
			},
		},
		brush: {
			toolbox: ["lineX", "clear"],
			xAxisIndex: 0,
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
				animation: false,
				label: {
					backgroundColor: "#505765",
				},
			},
		},
		dataZoom: [
			{
				show: true,
				realtime: true,
				start: 0,
				end: 25,
			},
			{
				type: "inside",
				realtime: true,
				start: 0,
				end: 25,
			},
		],
		xAxis: {
			type: "value",
			splitLine: {
				show: false,
			},
			axisLine: { onZero: false },
			boundaryGap: false,
		},
		yAxis: {
			type: "value",
			splitLine: {
				show: true,
			},
		},
		series: [
			{
				name: "FFT",
				areaStyle: {},
				lineStyle: {
					width: 1,
				},
				emphasis: {
					focus: "series",
				},
				data: [],
				showSymbol: false,
				type: "line",
				markPoint: {
					data: [{ type: "max", name: "Max", symbol: "pin" }],
				},
			},
		],
		animationThreshold: 2000,
		animationDurationUpdate: 100,
		animationEasingUpdate: (t: number) => t,
	};
	// TODO: Figure out what to do with min and max frequencies
	chartRef.current?.on("brushSelected", function (params: any) {
		try {
			const [minFreq, maxFreq] = params.batch[0].areas[0].coordRange;
			// setMinFreq(minFreq);
			// setMaxFreq(maxFreq);
		} catch {
			// This is some quality javascript right here
		}
	});
	return (
		<Chart
			chartRef={chartRef}
			id={id}
			width={width}
			height={height}
			options={options}
		/>
	);
}

function Chart({
	chartRef,
	id,
	width,
	height,
	options,
}: {
	chartRef: React.RefObject<echarts.ECharts | null>;
	id: string;
	width: string;
	height: string;
	options: ECBasicOption;
}) {
	useEffect(() => {
		var chartDom = document.getElementById(id);
		var chart = echarts.init(chartDom, null, {
			renderer: "canvas",
		});
		chartRef.current = chart;

		options && chart.setOption(options);
	}, []);

	return <div id={id} style={{ width: width, height: height }} />;
}
