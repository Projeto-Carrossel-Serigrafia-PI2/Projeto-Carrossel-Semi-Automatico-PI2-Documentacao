import Modal from 'react-modal';

import '../../styles/components/dashboard/Modal.scss';

export default function DashboardModal(props) {
	return (
		<Modal
			isOpen={props.isOpen}
			shouldCloseOnEsc={false}
			className="dashboard-modal"
			overlayClassName="modal-overlay"
		>
			{props.children}
		</Modal>
	);
}
