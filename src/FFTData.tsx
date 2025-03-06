import { Data } from "./types";
import "./FFTData.css";

const windows: { [key: string]: { cg: number; enbw: number } } = {
	rectangular: { cg: 1, enbw: 1 },
	hann: { cg: 0.5, enbw: 1.5 },
	hamming: { cg: 0.54, enbw: 1.36 },
	blackmanharris: { cg: 0.42, enbw: 1.71 },
	blackman: { cg: 0.42, enbw: 1.73 },
};

const FFTData = ({
	fftData,
	minFreq,
	setMinFreq,
	maxFreq,
	setMaxFreq,
	windowFunc,
}: {
	fftData: Data;
	minFreq: number;
	setMinFreq: (x: number) => void;
	maxFreq: number;
	setMaxFreq: (x: number) => void;
	windowFunc: string;
}) => {
	const maxMagnitude = fftData
		.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
		.reduce(
			(curMax, curVal) =>
				curMax[1] < curVal.value[1] ? curVal.value : curMax,
			[-Infinity, -Infinity]
		);

	const raw_power = fftData
		.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
		.reduce((curSum, curVal) => curSum + Math.pow(curVal.value[1], 2), 0);

	const estimated_power = raw_power / windows[windowFunc].enbw;
	const estimated_amplitude = Math.sqrt(estimated_power);

	const rms = Math.sqrt(
		fftData
			.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
			.reduce(
				(curSum, curVal) => curSum + Math.pow(curVal.value[1], 2),
				0
			) /
			(maxFreq - minFreq)
	);

	return (
		<div>
			<div className="freq-select">
				<label>Frequency Range (hz):</label>
				<input
					id="min-freq"
					className="freq-input"
					type="number"
					defaultValue={0}
					onChange={(e) => setMinFreq(parseFloat(e.target.value))}
				></input>
				-
				<input
					id="max-freq"
					className="freq-input"
					type="number"
					defaultValue={500}
					onChange={(e) => setMaxFreq(parseFloat(e.target.value))}
				></input>
			</div>
			<h3>
				Peak: {maxMagnitude[0].toFixed(3)} Hz :{" "}
				{maxMagnitude[1].toFixed(6)} V
			</h3>
			<table className="data-table">
				<thead>
					<tr className="data-header">
						<th className="data-cell">Measurement</th>
						<th className="data-cell">Value (V)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="data-cell">Windowed RMS</td>
						<td className="data-cell">{rms.toFixed(9)}</td>
					</tr>
					<tr>
						<td className="data-cell">Windowed Power</td>
						<td className="data-cell">{raw_power.toFixed(9)}</td>
					</tr>
					<tr>
						<td className="data-cell">Estimated Power</td>
						<td className="data-cell">
							{estimated_power.toFixed(9)}
						</td>
					</tr>
					<tr>
						<td className="data-cell">
							<strong>Estimated Amplitude</strong>
						</td>
						<td className="data-cell">
							{estimated_amplitude.toFixed(9)}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default FFTData;
