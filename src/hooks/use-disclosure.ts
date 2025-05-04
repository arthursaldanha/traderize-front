import { useState } from "react";

type UseDisclosureReturn = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
};

export const useDisclosure = (
  initialState: boolean = false
): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const onOpen = (): void => setIsOpen(true);

  const onClose = (): void => setIsOpen(false);

  const toggle = (): void => {
    setIsOpen((prevState) => !prevState);
  };

  return { isOpen, onOpen, onClose, toggle };
};
