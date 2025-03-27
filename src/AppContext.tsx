import {
	Context,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Data } from "./types";

// TODO: Figure out what this type and appContext is supposed to have
type AppData = {
	connectWebsocket: (x: string) => void;
	disconnectWebsocket: () => void;
	sendWebsocket: (data: object) => void;
	isConnected: boolean;
	Nsig: number;
	setNsig: React.Dispatch<React.SetStateAction<number>>;
	Ntot: number;
	setNtot: React.Dispatch<React.SetStateAction<number>>;
	Nbuf: number;
	setNbuf: React.Dispatch<React.SetStateAction<number>>;
	windowFunc: string;
	setWindowFunc: React.Dispatch<React.SetStateAction<string>>;
	rollingFft: boolean;
	setRollingFft: React.Dispatch<React.SetStateAction<boolean>>;
	sampleRate: number;
	setSampleRate: React.Dispatch<React.SetStateAction<number>>;
	voltageData: Data;
	fftMagData: Data;
	fftPhaseData: Data;
	minFreq: number;
	setMinFreq: React.Dispatch<React.SetStateAction<number>>;
	maxFreq: number;
	setMaxFreq: React.Dispatch<React.SetStateAction<number>>;
	createDump: () => void;
};

const appContext: Context<AppData> = createContext<AppData>({} as AppData);

export const useApp = () => useContext(appContext);

export function ProvideApp({ children }: { children: React.ReactNode }) {
	const data = useProvideApp();
	return <appContext.Provider value={data}>{children}</appContext.Provider>;
}

export function useProvideApp() {
	const ws = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [Nsig, setNsig] = useState<number>(1200);
	const [Nbuf, setNbuf] = useState<number>(32);
	const [Ntot, setNtot] = useState<number>(1200);
	const [windowFunc, setWindowFunc] = useState<string>("rectangular");
	const [rollingFft, setRollingFft] = useState<boolean>(false);
	const [sampleRate, setSampleRate] = useState<number>(1200);
	const [minFreq, setMinFreq] = useState<number>(0);
	const [maxFreq, setMaxFreq] = useState<number>(600);

	// FIXME: Make this variable length based on Nsig
	const [voltageData, setVoltageData] = useState<Data>(
		Array.from({ length: 1200 }, (_, i) => ({
			name: i,
			value: [i, 0],
		}))
	);
	const [fftMagData, setFftMagData] = useState<Data>([]);
	const [fftPhaseData, setFftPhaseData] = useState<Data>([]);

	useEffect(() => {
		connectWebsocket("ws://magpi.local:44444");

		return () => {
			ws.current?.close();
		};
	}, []);

	function connectWebsocket(address: string) {
		if (ws.current) {
			ws.current.close(); // Close existing connection before creating a new one
		}
		if (!address) return;

		const socket = new WebSocket(address);
		ws.current = socket;

		socket.onopen = () => {
			console.log("Connected to server:", address);
			socket.send(
				JSON.stringify({
					topic: "subscribe",
					payload: {
						topics: [
							"adc/status",
							"calculation/status",
							"fft_mags/data",
							"fft_phases/data",
							"voltage/data",
							"signal/data",
							"bfield/data",
						],
					},
				})
			);
			setIsConnected(true);
		};

		socket.onclose = () => {
			console.log("Disconnected from server:", address);
			setIsConnected(false);
		};

		socket.onerror = (e) => {
			console.error("WebSocket error:", e);
			setIsConnected(false);
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.topic) {
				case "voltage/data":
					setVoltageData((prevData: Data) => {
						const newData = prevData.slice(data.payload.length);
						const counter =
							prevData.length > 0
								? prevData[prevData.length - 1].name + 1
								: 0;

						const updatedData = data.payload.map(
							(val: number, i: number) => ({
								name: counter + i,
								value: [counter + i, val],
							})
						);

						return [...newData, ...updatedData];
					});
					break;

				case "fft_mags/data":
					setFftMagData(
						data.payload.map((val: [number, number]) => ({
							name: val[0],
							value: val,
						}))
					);
					// setWindowFunc(data.metadata.window);
					break;

				case "fft_phases/data":
					setFftPhaseData(
						data.payload.map((val: [number, number]) => ({
							name: val[0],
							value: val,
						}))
					);
					// setWindowFunc(data.metadata.window);
					break;

				case "adc/status":
					console.log("Received adc status: ", data);
					setNbuf(data.payload.Nsig);
					setSampleRate(data.payload.sample_rate);
					break;

				case "calculation/status":
					console.log("Received calculation status: ", data);
					setNsig(data.payload.Nsig);
					setNtot(data.payload.Ntot);
					setWindowFunc(data.payload.window);
					setRollingFft(data.payload.rolling_fft);
					break;

				default:
					console.log(`Unknown topic detected: ${data}`);
			}
		};
	}

	function disconnectWebsocket() {
		ws.current?.close();
	}

	function sendWebsocket(data: object) {
		console.log("Sending message:", data);
		ws.current?.send(JSON.stringify(data));
	}

	function createDump() {
		const jsonString = JSON.stringify(
			{
				voltage_data: voltageData,
				fft_mag_data: fftMagData,
				fft_phase_data: fftPhaseData,
				metadata: {
					Nsig: Nsig,
					Ntot: Ntot,
					Nbuf: Nbuf,
					rolling_fft: rollingFft,
					window: windowFunc,
					sample_rate: sampleRate,
					minFreq: minFreq,
					maxFreq: maxFreq,
				},
			},
			null,
			2
		);
		const newWindow = window.open();
		if (!newWindow) return;
		newWindow.document.write(`<pre>${jsonString}</pre>`);
		newWindow.document.close();
	}

	return {
		connectWebsocket,
		disconnectWebsocket,
		sendWebsocket,
		isConnected,
		Nsig,
		setNsig,
		Ntot,
		setNtot,
		Nbuf,
		setNbuf,
		windowFunc,
		setWindowFunc,
		rollingFft,
		setRollingFft,
		sampleRate,
		setSampleRate,
		voltageData,
		fftMagData,
		fftPhaseData,
		minFreq,
		setMinFreq,
		maxFreq,
		setMaxFreq,
		createDump,
	};
}
