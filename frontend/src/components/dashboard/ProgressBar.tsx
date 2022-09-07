import '../../styles/components/dashboard/ProgressBar.scss';

export default function ProgressBar(props) {
	function progress() {
		return ((props.current - props.limits[0])/(props.limits[1] - props.limits[0]) * 100) + '%';
	}

	return (
		<div className="progress-bar" style={ {
			width: props.width,
			height: props.height ? props.height : undefined
		} }>
			<div style={ {
				width: progress(),
				backgroundColor: props.color,
				color: props.color,
				height: props.height ? props.height : undefined
			} }>
				<span>{`${props.current} ${props.unit}`}</span>
			</div>

			<span className="limit lower">{`${props.limits[0]} ${props.unit}`}</span>
			<span className="limit higher">{`${props.limits[1]} ${props.unit}`}</span>
		</div>
	);
}
