import { create } from "zustand";

export interface SearchParams {
    city: string;
    checkIn: Date | null | string;   // store as ISO
    checkOut: Date | null | string;  // store as ISO
    adults: number;
    children: number;
    infants: number;
    pets: number;
}

interface SearchParamsState {
    searchParams: SearchParams;

    setSearchParams: (params: Partial<SearchParams>) => void;
    resetSearchParams: () => void;
}

const initialSearchParams: SearchParams = {
    city: "",
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
};

export const useSearchParamsStore = create<SearchParamsState>((set) => ({

    searchParams: initialSearchParams,

    setSearchParams: (params) =>
        set((state) => ({
            searchParams: {

                ...state.searchParams,
                ...params,
            },
        })),


    resetSearchParams: () =>
        set({
            searchParams: initialSearchParams,
        }),

}));