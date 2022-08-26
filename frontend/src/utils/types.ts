import React from 'react';

export interface OptionProps {
  icon: React.ReactElement;
  title: string;
  active?: boolean;
  onClick?(): void;
  route?: string;
}

export interface ModalProps {
  isModalOpen: boolean;
  closeModal(): void;
  paint?: PaintProps;
  mode?: 'editar' | 'criar';
  setSessionActive?: (value: string) => void;
  setIsModalOpen?: (value: boolean) => void;
}

export interface ModalPhotoProps {
  isModalOpen: boolean;
  closeModal(): void;
  setIsModalOpen?: (value: boolean) => void;
  image?: string;
  setImage?: (value: string) => void;
}

export interface ButtonEditParamProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement;
}

export interface ButtonTakePhotoProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactElement;
  title: string;
  filename?: string;
  mode: 'upload' | 'taken';
  onClick?(): void;
}

export interface ButtonRequestProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  color?: string;
}

export interface SessionProps {
  id?: string;
  quantityPaint: number;
  temperatureFlashcure: number;
  speedEngine: number;
  typePaint: string;
}

export interface PaintProps {
  id?: number;
  type: string;
  dryingTemperature: number;
  dryingTime: number;
  reload?: boolean;
  setReload?: (value: boolean) => void;
}

export interface ColorProps {
  id?: number;
  color: string;
  type: number;
}

export interface QualitySectionProps {
  qualityType: string;
  imageReference: string;
  imageBatch?: string;
  reportDescription: string;
  reportResult: string;
}

export interface ProductionProps {
  id: number;
  paints?: {
    id: number;
    base_id: number;
    production_id: number;
    color: string;
  }[];
  created_at: string;
  image_reference: string;
  total_shirts: number;
  speed: number;
}

export interface BatchProps {
  id: number;
  image: string;
  image_failures: string;
  production_id: number;
  quantity_shirts: number;
  quantity_failures: number;
  similarity_colors: string;
  similarity_format: string;
}
