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
          <img src={props.imageReference} alt='' style={{ width: 300 }} />
        </div>
        <div className='quality-photo-group'>
          <h4>Imagem Lote</h4>
          <img src={props.imageBatch} alt='' style={{ width: 300 }} />
        </div>
        <div>
          <h4>Relatório</h4>
          <p>{props.reportDescription}</p>
          <span>{props.reportResult}</span>
        </div>
      </aside>
    </section>
  );
}
