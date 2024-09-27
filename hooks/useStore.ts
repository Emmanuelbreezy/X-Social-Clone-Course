import { create, StateCreator } from "zustand";

// BirthDate slice
type BirthDateSlice = {
  isBirthDateModalOpen: boolean;
  openBirthDateModal: () => void;
  closeBirthDateModal: () => void;
};

const createBirthDateSlice: StateCreator<
  BirthDateSlice,
  [],
  [],
  BirthDateSlice
> = (set) => ({
  isBirthDateModalOpen: false,
  openBirthDateModal: () => set({ isBirthDateModalOpen: true }),
  closeBirthDateModal: () => set({ isBirthDateModalOpen: false }),
});

// EditModal slice
type EditModalSlice = {
  isEditModalOpen: boolean;
  openEditModal: () => void;
  closeEditModal: () => void;
};

const createEditModalSlice: StateCreator<
  EditModalSlice,
  [],
  [],
  EditModalSlice
> = (set) => ({
  isEditModalOpen: false,
  openEditModal: () => set({ isEditModalOpen: true }),
  closeEditModal: () => set({ isEditModalOpen: false }),
});

// Pro Modal slice
type ProModalSlice = {
  isProModalOpen: boolean;
  openProModal: () => void;
  closeProModal: () => void;
};

const createProModalSlice: StateCreator<
  ProModalSlice,
  [],
  [],
  ProModalSlice
> = (set) => ({
  isProModalOpen: false,
  openProModal: () => set({ isProModalOpen: true }),
  closeProModal: () => set({ isProModalOpen: false }),
});

type StoreType = ProModalSlice & BirthDateSlice & EditModalSlice;

// Combine the slices into a single store
export const useStore = create<StoreType>()((...a) => ({
  ...createProModalSlice(...a),
  ...createBirthDateSlice(...a),
  ...createEditModalSlice(...a),
}));
