import { useApp } from "../AppContext";
import { VectorSignals } from "../components/signalsvector";
import "./CalculationPage.css";

export default function CalculationPage() {
	const { signals, signal } = useApp();
	return (
		<main>
			<VectorSignals signals={signals} />
		</main>
	);
}
