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
}

export interface ButtonEditParamProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement;
}
