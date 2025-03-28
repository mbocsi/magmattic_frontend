import { useApp } from "../AppContext";
import { DataCard, DataList } from "../components/datacard";

export default function CalculationPage() {
	const { signal, bfield } = useApp();
	return (
		<main>
			<DataList>
				<DataCard
					label="Signal Magnitude"
					value={signal.amplitude.toFixed(9)}
					units="V"
				/>
				<DataCard
					label="Signal Phase"
					value={signal.theta.toFixed(9)}
					units="Rad"
				/>
				<DataCard
					label="Signal Angular Velocity"
					value={signal.omega.toFixed(9)}
					units="Rad/s"
				/>
				<DataCard
					label="B-Field (Vector)"
					value={`[${bfield[0].toFixed(9)}, ${bfield[1].toFixed(9)}]`}
					units="T"
				/>
				<DataCard
					label="B-Field Magnitude"
					value={Math.sqrt(
						Math.pow(bfield[0], 2) + Math.pow(bfield[1], 2)
					).toFixed(9)}
					units="T"
				/>
			</DataList>
		</main>
	);
}
