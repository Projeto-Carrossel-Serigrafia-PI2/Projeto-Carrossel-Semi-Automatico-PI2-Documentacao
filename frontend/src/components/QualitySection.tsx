import { QualitySectionProps } from '../utils/types';

import '../styles/components/QualitySection.scss';

export function QualitySection(props: QualitySectionProps) {
  return (
    <section id='quality-section'>
      <div>
        <h3>{props.qualityType}</h3>
      </div>

      <aside>
        <div className='quality-photo-group'>
          <h4>Imagem Referência</h4>
          <div>
            <img src={`data:image/png;base64,${props.imageReference}`} alt='' />
          </div>
        </div>
        <div className='quality-photo-group'>
          <h4>Imagem Lote</h4>
          <div>
            <img src={`data:image/png;base64,${props.imageBatch}`} alt='' />
          </div>
        </div>
        <div className='quality-report-session'>
          <div />
          <h4>Relatório</h4>
          <p>{props.reportDescription}</p>
          <span>{props.reportResult}</span>
        </div>
      </aside>
    </section>
  );
}
