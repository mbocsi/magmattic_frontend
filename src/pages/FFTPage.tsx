import { useEffect, useRef } from "react";
import { FFTChart } from "../components/charts";
import "./FFTPage.css";
import { useApp } from "../AppContext";
import { ECharts, connect } from "echarts/core";
import { DataCard, DataList } from "../components/datacard";
import { DetectedSignals } from "../components/detectedsignals";

const windows: { [key: string]: { cg: number; enbw: number } } = {
	rectangular: { cg: 1, enbw: 1 },
	hann: { cg: 0.5, enbw: 1.5 },
	hamming: { cg: 0.54, enbw: 1.36 },
	blackmanharris: { cg: 0.42, enbw: 1.71 },
	blackman: { cg: 0.42, enbw: 1.73 },
};

export default function FFTPage() {
	const {
		fftMagData,
		fftPhaseData,
		windowFunc,
		minFreq,
		maxFreq,
		signals,
		minSnr,
		setMinSnr,
		sendWebsocket,
	} = useApp();
	const fftChartRef = useRef<ECharts | null>(null);
	const phaseChartRef = useRef<ECharts | null>(null);

	const freq_resolution =
		(fftMagData[fftMagData.length - 1]?.value[0] -
			fftMagData[0]?.value[0]) /
		(fftMagData.length - 1);

	const maxMagnitude = fftMagData
		.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
		.reduce(
			(curMax, curVal) =>
				curMax[1] < curVal.value[1] ? curVal.value : curMax,
			[-Infinity, -Infinity]
		);

	const raw_power = fftMagData
		.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
		.reduce(
			(curSum, curVal) =>
				curSum + freq_resolution * Math.pow(curVal.value[1], 2),
			0
		);

	const estimated_power = raw_power / windows[windowFunc].enbw;
	const estimated_amplitude = Math.sqrt(estimated_power);

	const amplitude_spectral_density = Math.sqrt(
		fftMagData
			.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
			.reduce(
				(curSum, curVal) => curSum + Math.pow(curVal.value[1], 2),
				0
			) /
			((maxFreq - minFreq) / freq_resolution)
	);

	const power_spectral_density = Math.pow(amplitude_spectral_density, 2);

	useEffect(() => {
		connect("fftPage");
	}, []);

	useEffect(() => {
		fftChartRef.current?.setOption({
			series: [{ data: fftMagData }],
		});
	}, [fftMagData]);

	useEffect(() => {
		phaseChartRef.current?.setOption({
			series: [{ data: fftPhaseData }],
		});
	}, [fftPhaseData]);
	return (
		<main>
			<div style={{ gridColumn: "1 / 3", gridRow: "1" }}>
				<FFTChart
					id="mag-ff-chart"
					title="Magnitude"
					group="fftPage"
					width="100%"
					height="100%"
					chartRef={fftChartRef}
				/>
			</div>
			<div style={{ gridColumn: "1/3", gridRow: "2" }}>
				<FFTChart
					id="phase-fft-chart"
					title="Phase"
					group="fftPage"
					color="#66ff00"
					width="100%"
					height="100%"
					chartRef={phaseChartRef}
					minY={-180}
					maxY={180}
				/>
			</div>
			<DataList className="data-display">
				<h3>Windowed Stats</h3>
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
			<div className="data-display">
				<h3>Detected Signals</h3>
				<div className="snr-select">
					<p>Minimum SNR:</p>
					<input
						type="number"
						value={minSnr}
						onChange={(e) => setMinSnr(parseInt(e.target.value))}
						onBlur={() => {
							sendWebsocket({
								topic: "calculation/command",
								payload: { min_snr: minSnr },
							});
						}}
					/>
				</div>
				<DetectedSignals signals={signals} />
			</div>
		</main>
	);
}
