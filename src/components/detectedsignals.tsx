import { DataCard, DataList } from "./datacard";
import { useState, useEffect } from "react";
import "./detectedsignals.css";
export function DetectedSignals({
	signals,
}: {
	signals: {
		freq: number;
		mag: number;
		phase: number;
		ampl: number;
		bfield: [number, number];
	}[];
}) {
	const [activeFreq, setActiveFreq] = useState<number>(0);
	function findClosest(
		arr: {
			freq: number;
			mag: number;
			phase: number;
			ampl: number;
			bfield: [number, number];
		}[],
		target: number
	) {
		if (!arr || arr.length === 0) {
			return null; // Handle empty or invalid array
		}

		let closest = arr[0];
		let minDiff = Math.abs(arr[0].freq - target);

		for (let i = 1; i < arr.length; i++) {
			const currentDiff = Math.abs(arr[i].freq - target);
			if (currentDiff < minDiff) {
				minDiff = currentDiff;
				closest = arr[i];
			} else if (currentDiff === minDiff && arr[i] > closest) {
				closest = arr[i]; // If equal distances, pick the larger number
			}
		}
		return closest;
	}
	const activeSignal = findClosest(signals, activeFreq);

	useEffect(() => {
		if (activeSignal) {
			setActiveFreq(activeSignal.freq);
		}
	}, [signals]);

	return (
		<>
			<div className="detected-signals">
				{signals.map((sig) => (
					<SignalCard
						key={sig.freq}
						freq={sig.freq}
						mag={sig.mag}
						active={sig.freq == activeFreq}
						onClick={() => setActiveFreq(sig.freq)}
					/>
				))}
			</div>
			<DataList>
				{activeSignal ? (
					<>
						<DataCard
							label="Frequency"
							value={activeSignal.freq.toFixed(3)}
							units="Hz"
						/>
						<DataCard
							label="FFT Magnitude"
							value={activeSignal.mag.toFixed(9)}
							units="V"
						/>
						<DataCard
							label="Signal Amplitude"
							value={activeSignal.ampl.toFixed(9)}
							units="V"
						/>
						<DataCard
							label="Phase"
							value={activeSignal.phase.toFixed(3)}
							units="Rad"
						/>
						<DataCard
							label="Bfield"
							value={`[${activeSignal.bfield[0].toFixed(
								6
							)}, ${activeSignal.bfield[1].toFixed(6)}]`}
							units="T"
						/>
						<DataCard
							label="Bfield Magnitude"
							value={Math.sqrt(
								activeSignal.bfield[0] ** 2 +
									activeSignal.bfield[1] ** 2
							).toFixed(6)}
							units="T"
						/>
					</>
				) : (
					""
				)}
			</DataList>
		</>
	);
}

export function SignalCard({
	freq,
	mag,
	active,
	onClick,
}: {
	freq: number;
	mag: number;
	active: boolean;
	key?: any;
	onClick?: () => void;
}) {
	const [updated, setUpdated] = useState<boolean>(false);
	useEffect(() => {
		setUpdated(true);
		const timer = setTimeout(() => setUpdated(false), 250);
		return () => clearTimeout(timer);
	}, []);
	return (
		<button
			className={`signal-card ${active ? "active" : ""} ${
				updated ? "new" : ""
			}`}
			onClick={onClick}
		>
			<p>{freq.toFixed(2)}Hz</p>
			<p>{mag.toFixed(3)}V</p>
		</button>
	);
}
