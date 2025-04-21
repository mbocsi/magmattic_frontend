import { useApp } from "../AppContext";
import { DataCard, DataList } from "../components/datacard";
import "./Dashboard.css";
export default function Dashboard() {
	const { signal } = useApp();
	return (
		<main>
			<DataList>
				{signal ? (
					<>
						<DataCard
							label="Frequency"
							value={signal.freq.toFixed(3)}
							units="Hz"
						/>
						<DataCard
							label="FFT Magnitude"
							value={signal.mag.toFixed(9)}
							units="V"
						/>
						<DataCard
							label="Signal Amplitude"
							value={signal.ampl.toFixed(9)}
							units="V"
						/>
						<DataCard
							label="Phase"
							value={signal.phase.toFixed(3)}
							units="Rad"
						/>
						<DataCard
							label="Bfield"
							value={`[${signal.bfield[0].toFixed(
								6
							)}, ${signal.bfield[1].toFixed(6)}]`}
							units="T"
						/>
						<DataCard
							label="Bfield Magnitude"
							value={Math.sqrt(
								signal.bfield[0] ** 2 + signal.bfield[1] ** 2
							).toFixed(6)}
							units="T"
						/>
						{/* <VectorArrow
							x={signal.bfield[0]}
							y={signal.bfield[1]}
						/> */}
					</>
				) : (
					""
				)}
			</DataList>
			<VectorArrow x={signal.bfield[0]} y={signal.bfield[1]} />
		</main>
	);
}

function VectorArrow({ x, y }: { x: number; y: number }) {
	// const length = Math.sqrt(x * x + y * y);
	// const angle = Math.atan2(y, x) * (180 / Math.PI);

	return (
		<svg
			width="580"
			height="580"
			viewBox="-100 -100 200 200"
			style={{ marginTop: "16px" }}
		>
			<line
				x1={0}
				y1={0}
				x2={Math.ceil(-x * 20000)}
				y2={Math.ceil(-y * 20000)}
				stroke="#646cff"
				strokeWidth="2"
				markerEnd="url(#arrowhead)"
			/>
			<line x1={0} y1={0} x2={250} y2={0} stroke="blue" strokeWidth="1" />
			<line x1={0} y1={0} x2={0} y2={-250} stroke="red" strokeWidth="1" />
			<defs>
				<marker
					id="arrowhead"
					markerWidth="10"
					markerHeight="7"
					refX="0"
					refY="2"
					orient="auto"
				>
					<polygon points="0 0, 5 2, 0 4" fill="#646cff" />
				</marker>
			</defs>
		</svg>
	);
}
