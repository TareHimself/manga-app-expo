import { useCallback, useEffect } from "react";
import 'react-native-get-random-values';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { incrementSource, loadSource, setSourceByIndex } from "../redux/slices/sourceSlice";
import { MangaSource } from "../types";

const DEFAULT_SOURCE: MangaSource = { id: 'mc', name: 'mangaclash' };
export default function useSource(): { setSource: (index: number) => Promise<void>; nextSource: () => Promise<void>; source: MangaSource } {

	const source = useAppSelector((state) => state.source.source);
	const hasInit = useAppSelector((state) => state.bookmarks.init);
	const dispatch = useAppDispatch();

	const nextSource = useCallback(async () => {
		dispatch(incrementSource());
		return;
	}, [dispatch, source]);

	const setSource = useCallback(async (index: number) => {
		dispatch(setSourceByIndex(index));
		return;
	}, [dispatch, source]);


	useEffect(() => {
		if (!hasInit) dispatch(loadSource(source.id));
	}, [])

	return { setSource, nextSource, source }
}