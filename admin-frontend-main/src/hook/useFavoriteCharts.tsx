import { useMemo } from "react";
import { RootState } from "@/redux/store";
import { useAppSelector } from "./useReduxHooks";

const useFavoriteCharts = (chartType: string) => {
    const favoriteCharts = useAppSelector((state: RootState) => state.analytics.favoriteCharts);
    const isFavorite = useMemo(() => favoriteCharts.includes(chartType), [favoriteCharts, chartType]);
    return { isFavorite };
};

export default useFavoriteCharts;
