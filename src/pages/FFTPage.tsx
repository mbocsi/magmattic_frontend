import { useEffect, useRef } from "react";
import { FFTPhaseChart } from "../components/charts";
import "./FFTPage.css";
import { useApp } from "../AppContext";
import { ECharts } from "echarts/core";

export default function FFTPage() {
	const { fftData } = useApp();
	const chartRef = useRef<ECharts | null>(null);
	useEffect(() => {
		chartRef.current?.setOption({
			series: [{ data: fftData }],
		});
	}, [fftData]);
	return (
		<main>
			<div className="chart-section">
				<FFTPhaseChart
					id="fft-chart"
					width="100%"
					height="100%"
					chartRef={chartRef}
				/>
			</div>
		</main>
	);
}
