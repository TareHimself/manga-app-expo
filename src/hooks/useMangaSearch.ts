import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { compareTwoStrings } from "string-similarity";
import { ApiBaseUrl } from "../constants/Urls";
import { IMangaPreviewData } from "../types";
import { useUniqueId } from "./useUniqueId";
export const DefaultMangaSearch = '';

export default function useMangaDexSearch(onSearchCompleted?: (results: IMangaPreviewData[]) => void): [IMangaPreviewData[], (search: string, sourceId: string) => Promise<void>] {
    const [results, setResults] = useState<IMangaPreviewData[]>([]);
    const uniqueId = useUniqueId();
    const lastRequestController = useRef<AbortController | null>();


    const makeSearch = useCallback(async (search: string, sourceId: string) => {
        try {
            const url = `${ApiBaseUrl}${sourceId}/search?${new URLSearchParams({ q: search }).toString()}`;

            if (lastRequestController.current) {
                lastRequestController.current.abort();
                lastRequestController.current = new AbortController();
            }
            else {
                lastRequestController.current = new AbortController();
            }

            if (lastRequestController.current) {


                axios.get(url, {
                    signal: lastRequestController.current.signal
                }).then((response) => {
                    const result: IMangaPreviewData[] = response.data;
                    if (search.toLowerCase().trim() && search.toLowerCase().trim().length > 3) {
                        result.sort((a, b) => {
                            const aRelavance = compareTwoStrings(a.title.toLowerCase().trim(), search.toLowerCase().trim());
                            const bRelavance = compareTwoStrings(b.title.toLowerCase().trim(), search.toLowerCase().trim());

                            if (aRelavance > bRelavance) return -1;

                            if (aRelavance < bRelavance) return 1;

                            return 0;
                        });
                    }
                    setResults([...result]);
                    if (onSearchCompleted) onSearchCompleted(result);
                }).catch((error) => {
                });
            }

        } catch (error) {
            console.log(error);
        }
    }, [results, uniqueId, lastRequestController.current])

    useEffect(() => {

        lastRequestController.current = new AbortController();

        return () => {
            if (lastRequestController.current) {
                lastRequestController.current.abort();
                lastRequestController.current = null;
            }

        }
    }, [])

    return [results, makeSearch]
} 