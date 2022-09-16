import { ButtonTakePhotoProps } from '../utils/types';

import '../styles/components/ButtonTakePhoto.scss';

export function ButtonTakePhoto({
  icon,
  title,
  filename,
  mode,
  onClick,
  ...rest
}: ButtonTakePhotoProps) {
  return (
    <div id="button-photo-container">
      {mode === 'upload' ? (
        <label id="button-take-photo">
          <input
            {...rest}
            id="button-take-photo"
            type="file"
            accept="image/*"
          />
          {icon}
          <h3>{title}</h3>
        </label>
      ) : (
        <button id="button-take-photo" onClick={onClick}>
          {icon}
          <h3>{title}</h3>
        </button>
      )}

      <p>{filename}</p>
    </div>
  );
}
