import React from 'react';

export interface OptionProps {
  icon: React.ReactElement;
  title: string;
  active?: boolean;
  onClick?(): void;
}

export interface ModalConfigSessionProps {
  isModalOpen: boolean;
  closeModal(): void;
  setSessionActive: (value: string) => void;
  setIsModalOpen: (value: boolean) => void;
}

export interface ButtonEditParamProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement;
}

export interface ButtonConfirmProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export interface SessionProps {
  id?: string;
  quantityPaint: number;
  temperatureFlashcure: number;
  speedEngine: number;
  typePaint: string;
}

export interface PaintProps {
  id: string;
  type: string;
  speedDefault: number;
  temperatureDefault: number;
}
