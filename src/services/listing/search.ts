import { useSearchStore } from "@/app/components/ui/propertypage/store/searchpage";
import APICONSTANT from "@/utils/apiconstant";
import { ApiResponse } from "@/utils/apiresponse";
import { Request } from "@/utils/request";

export async function SearchApi(data: { body: any }): Promise<ApiResponse> {
    debugger
    try {
        const response = await Request<ApiResponse>(
            'listings/search',
            'GET',
            data.body,
        );
        debugger
        // Ensure setSearchData always receives an array
        const listings = Array.isArray(response?.data?.data) ? response.data.data : [];
        console.log('Listings received from API:', listings);
        useSearchStore?.getState().setSearchData(listings);
        return response?.data as ApiResponse;
    } catch (error) {
        throw error;
    }
}