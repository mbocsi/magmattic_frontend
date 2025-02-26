import { Data } from "./types";
import "./VoltageData.css";

const VoltageData = ({ voltageData }: { voltageData: Data }) => {
	const maxMagnitude = voltageData.reduce(
		(curMax, curVal) =>
			curMax[1] < curVal.value[1] ? curVal.value : curMax,
		[-Infinity, -Infinity]
	);
	const minMagnitude = voltageData.reduce(
		(curMax, curVal) =>
			curMax[1] > curVal.value[1] ? curVal.value : curMax,
		[Infinity, Infinity]
	);
	const mean =
		voltageData.reduce((curSum, curVal) => curSum + curVal.value[1], 0) /
		voltageData.length;

	const rms = Math.sqrt(
		voltageData.reduce(
			(curSum, curVal) =>
				curSum + Math.pow(curVal.value[1], 2) - Math.pow(mean, 2),
			0
		) / 1000
	);

	return (
		<div>
			<table className="data-table">
				<thead>
					<tr className="data-header">
						<th className="data-cell">Measurement</th>
						<th className="data-cell">Value (V)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="data-cell">Max Magnitude</td>
						<td className="data-cell">
							{maxMagnitude[1].toFixed(6)}
						</td>
					</tr>
					<tr>
						<td className="data-cell">Min Magnitude</td>
						<td className="data-cell">
							{minMagnitude[1].toFixed(6)}
						</td>
					</tr>
					<tr>
						<td className="data-cell">Peak to Peak</td>
						<td className="data-cell">
							{(maxMagnitude[1] - minMagnitude[1]).toFixed(6)}
						</td>
					</tr>
					<tr>
						<td className="data-cell">RMS</td>
						<td className="data-cell">{rms.toFixed(9)}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default VoltageData;
