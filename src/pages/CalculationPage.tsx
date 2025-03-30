import { useApp } from "../AppContext";
import { DetectedSignals } from "../components/detectedsignals";

export default function CalculationPage() {
	const { signals } = useApp();
	return (
		<main>
			<div style={{ padding: "8px" }}>
				<DetectedSignals signals={signals} />
			</div>
		</main>
	);
}
