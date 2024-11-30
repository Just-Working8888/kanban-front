import React from "react";
import ReactModal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  className: string;
}

export const Modal = ({
  isOpen,
  onRequestClose,
  children,
  className,
}: ModalProps) => {
  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className={className}
        overlayClassName="fixed z-[100] inset-0"
      >
        {children}
      </ReactModal>
    </>
  );
};
