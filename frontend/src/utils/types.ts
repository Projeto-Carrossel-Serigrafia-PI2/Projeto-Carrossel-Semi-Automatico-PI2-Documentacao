import React from 'react';

export interface OptionProps {
  icon: React.ReactElement;
  title: string;
  active?: boolean;
  onClick?(): void;
  route?: string;
}

export interface ModalPaintsProps {
  isModalOpen: boolean;
  closeModal(): void;
  paint: PaintProps;
  mode: 'editar' | 'criar';
  setSessionActive?: (value: string) => void;
  setIsModalOpen?: (value: boolean) => void;
}

export interface ButtonEditParamProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement;
}

export interface ButtonConfirmProps
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
  id?: string;
  type: string;
  dryingTemperature: number;
  dryingTime: number;
}
