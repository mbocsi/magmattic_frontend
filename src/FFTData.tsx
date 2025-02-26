import { Data } from "./types";
import "./FFTData.css";

const FFTData = ({
	fftData,
	minFreq,
	setMinFreq,
	maxFreq,
	setMaxFreq,
}: {
	fftData: Data;
	minFreq: number;
	setMinFreq: (x: number) => void;
	maxFreq: number;
	setMaxFreq: (x: number) => void;
}) => {
	const maxMagnitude = fftData
		.filter((d) => d.value[0] >= minFreq && d.value[0] <= maxFreq)
		.reduce(
			(curMax, curVal) =>
				curMax[1] < curVal.value[1] ? curVal.value : curMax,
			[-Infinity, -Infinity]
		);

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
			<h2>Peak/RMS FFT Value</h2>
			<div className="freq-select">
				<h3>Frequency Range (hz):</h3>
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
			<h2>
				{maxMagnitude[0].toFixed(3)} Hz : {maxMagnitude[1].toFixed(6)} V
			</h2>
			<h2>RMS: {rms.toFixed(9)} V</h2>
		</div>
	);
};

export default FFTData;
