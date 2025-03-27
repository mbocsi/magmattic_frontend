import { DataCard, DataList } from "../components/datacard";

export default function CalculationPage() {
	return (
		<main>
			<DataList>
				<DataCard label="Signal Magnitude" value={0.0} units="V" />
				<DataCard label="Signal Phase" value={0.0} units="Rad" />
				<DataCard
					label="B-Field (Vector)"
					value={`[0.0, 0.0]`}
					units="T"
				/>
			</DataList>
		</main>
	);
}
