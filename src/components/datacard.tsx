import { useEffect, useState } from "react";

import "./datacard.css";

export function DataCard({
	label,
	value,
	units,
}: {
	label: string;
	value: number | string;
	units: React.ReactNode | string;
}) {
	const [updated, setUpdated] = useState<boolean>(false);
	useEffect(() => {
		setUpdated(true);
		const timer = setTimeout(() => setUpdated(false), 250);
		return () => clearTimeout(timer);
	}, [value]);
	return (
		<li className={updated ? "updated" : ""}>
			<p>{label}</p>
			<p>
				{value} {units}
			</p>
		</li>
	);
}

export function DataList({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <ul className={className}>{children}</ul>;
}
