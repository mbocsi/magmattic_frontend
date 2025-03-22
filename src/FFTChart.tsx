import { useEffect } from "react";
import "./App.css";
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

const FFTChart = ({
	chart,
	setChart,
	width,
	height,
	setMinFreq,
	setMaxFreq,
}: {
	chart: echarts.ECharts | null;
	setChart: (x: echarts.ECharts) => void;
	width: string;
	height: string;
	setMinFreq: (x: number) => void;
	setMaxFreq: (x: number) => void;
}) => {
	useEffect(() => {
		var chartDom = document.getElementById("fft-chart");
		var chart = echarts.init(chartDom, null, {
			renderer: "canvas",
			// useDirtyRect: false,
		});
		console.log(chart);
		setChart(chart);
		var option = {
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

		option && chart.setOption(option);

		chart.on("brushSelected", function (params) {
			try {
				const [minFreq, maxFreq] = params.batch[0].areas[0].coordRange;
				setMinFreq(minFreq);
				setMaxFreq(maxFreq);
			} catch {
				// This is some quality javascript right here
			}
		});
	}, []);

	// useEffect(() => {
	// 	chart?.setOption({
	// 		xAxis: {
	// 			min: minFreq,
	// 			max: maxFreq,
	// 		},
	// 	});
	// }, [minFreq, maxFreq]);

	return <div id="fft-chart" style={{ width: width, height: height }} />;
};

export default FFTChart;
