import "./togglebutton.css";
export default function ToggleButton({
	id,
	children,
	className,
	value,
	onChange,
}: {
	id: string;
	children: React.ReactNode;
	className?: string;
	value: boolean;
	onChange: (e: any) => void;
}) {
	return (
		<>
			<label
				htmlFor={id}
				className={`toggle-button ${value ? "on" : "off"} ${className}`}
			>
				{children}
			</label>
			<input
				id={id}
				className="toggle-button"
				type="checkbox"
				onChange={onChange}
			/>
		</>
	);
}
