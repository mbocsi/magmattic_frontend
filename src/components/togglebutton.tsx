import "./togglebutton.css";
export default function ToggleButton({
	id,
	children,
	className,
	value,
	setValue,
}: {
	id: string;
	children: React.ReactNode;
	className?: string;
	value: boolean;
	setValue?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<>
			<label
				htmlFor={id}
				className={`toggle-button ${value ? "on" : "off"} ${className}`}
				onClick={() =>
					setValue ? setValue((prev: boolean) => !prev) : null
				}
			>
				{children}
			</label>
			<input id={id} className="toggle-button" type="checkbox" />
		</>
	);
}
