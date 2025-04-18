import { useApp } from "../AppContext";
import { VectorSignals } from "../components/signalsvector";
import "./CalculationPage.css";

export default function CalculationPage() {
	const { signals } = useApp();
	return (
		<main className="calculation">
			<VectorSignals signals={signals} />
		</main>
	);
}
