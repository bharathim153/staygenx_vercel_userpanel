import { create } from "zustand";
import { IListing } from "../../homepage/store/type";


interface ResultsState<IListing> {
    searchdata: IListing[];
    loading: boolean;
    error: string | null;

    setSearchData: (data: IListing[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useSearchStore = create<ResultsState<IListing>>((set) => ({
    searchdata: [],
    loading: false,
    error: null,

    setSearchData: (data) => set({ searchdata: data }),

    setLoading: (loading) => set({ loading }),
}));