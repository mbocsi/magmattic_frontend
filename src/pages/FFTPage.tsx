import { memo, useEffect, useRef, useState } from "react";
import { FFTPhaseChart } from "../components/charts";
import "./FFTPage.css";
import { useApp } from "../AppContext";
import { ECharts } from "echarts/core";
import { DataCard, DataList } from "../components/datacard";

const windows: { [key: string]: { cg: number; enbw: number } } = {
	rectangular: { cg: 1, enbw: 1 },
	hann: { cg: 0.5, enbw: 1.5 },
	hamming: { cg: 0.54, enbw: 1.36 },
	blackmanharris: { cg: 0.42, enbw: 1.71 },
	blackman: { cg: 0.42, enbw: 1.73 },
};

export default function FFTPage() {
	console.log("Rerendered FFTPage");
	const { fftData, windowFunc, minFreq, maxFreq } = useApp();
	const chartRef = useRef<ECharts | null>(null);

	console.log(fftData);
	const freq_resolution =
		(fftData[fftData.length - 1]?.value[0] - fftData[0]?.value[0]) /
		(fftData.length - 1);
	console.log(freq_resolution);

	const maxMagnitude = fftData
		.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
		.reduce(
			(curMax, curVal) =>
				curMax[1] < curVal.value[1] ? curVal.value : curMax,
			[-Infinity, -Infinity]
		);

	const raw_power = fftData
		.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
		.reduce(
			(curSum, curVal) =>
				curSum + freq_resolution * Math.pow(curVal.value[1], 2),
			0
		);

	const estimated_power = raw_power / windows[windowFunc].enbw;
	const estimated_amplitude = Math.sqrt(estimated_power);

	const amplitude_spectral_density = Math.sqrt(
		fftData
			.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
			.reduce(
				(curSum, curVal) => curSum + Math.pow(curVal.value[1], 2),
				0
			) /
			((maxFreq - minFreq) / freq_resolution)
	);

	const power_spectral_density = Math.pow(amplitude_spectral_density, 2);

	useEffect(() => {
		chartRef.current?.setOption({
			series: [{ data: fftData }, { data: fftData }],
		});
		console.log("Updated FFT data");
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
			<DataList className="data-display">
				<DataCard
					label="Window Min Frequency"
					value={minFreq.toFixed(2)}
					units="Hz"
				/>
				<DataCard
					label="Window Max Frequency"
					value={maxFreq.toFixed(2)}
					units="Hz"
				/>
				<DataCard
					label="Frequency Resolution"
					value={freq_resolution.toFixed(3)}
					units="Hz"
				/>
				<DataCard
					label="Peak Frequency"
					value={maxMagnitude[0].toFixed(3)}
					units="Hz"
				/>
				<DataCard
					label="Peak Magnitude"
					value={maxMagnitude[1].toFixed(9)}
					units="V"
				/>
				<DataCard
					label="Amplitude Spectral Density"
					value={amplitude_spectral_density.toFixed(9)}
					units={
						<>
							V<sub>RMS</sub>/&radic;Hz
						</>
					}
				/>
				<DataCard
					label="Power Spectral Density"
					value={power_spectral_density.toFixed(9)}
					units={
						<>
							V<sub>RMS</sub>
							<sup>2</sup>/Hz
						</>
					}
				/>
				<DataCard
					label="FFT Power (Raw)"
					value={raw_power.toFixed(9)}
					units={
						<>
							V<sup>2</sup>
						</>
					}
				/>
				<DataCard
					label="Real Power (Window adjustment)"
					value={estimated_power.toFixed(9)}
					units={
						<>
							V<sup>2</sup>
						</>
					}
				/>
				<DataCard
					label="Signal Amplitude"
					value={estimated_amplitude.toFixed(9)}
					units="V"
				/>
			</DataList>
			<DataList className="data-display">
				<DataCard label="Max Phase" value="0.0" units="Rad" />
			</DataList>
		</main>
	);
}
