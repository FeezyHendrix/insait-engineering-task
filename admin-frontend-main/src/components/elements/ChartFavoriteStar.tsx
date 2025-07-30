import { useAppDispatch } from "@/hook/useReduxHooks";
import { updateFavoriteCharts } from "@/redux/slices/analytics/request";
import { t } from "i18next";
import { getErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import CustomTooltip from "./CustomTooltip";

const ChartFavoriteStar = ({ isFavorite, chartType }: { isFavorite: boolean, chartType: string }) => {
    const dispatch = useAppDispatch()
    const handleFavoriteClick = async () => {
        try {
            const favoriteResponse = await dispatch(updateFavoriteCharts({chartType, action: isFavorite ? 'remove' : 'add'}))
            if (favoriteResponse.meta.requestStatus !== 'fulfilled') {
                throw new Error(t('feedback.errorWrong'))
            };
        } catch (error) {
        const errorMessage = getErrorMessage(error)
        toast.error(errorMessage || t('feedback.errorWrong'))
        }
    };
    return (
        <div 
            onClick={handleFavoriteClick} 
            className="transition-colors duration-300 rounded-full w-8 h-8 flex items-center justify-center"
            onMouseEnter={(e) => e.currentTarget.className += ' bg-[#e6f1f8]'}
            onMouseLeave={(e) => e.currentTarget.className = e.currentTarget.className.replace(' bg-[#e6f1f8]', '')}
        >
            <CustomTooltip title={t('chart.favorite')}>
                <FaStar className={`w-5 h-5 ${isFavorite ? `text-yellow-500` : 'text-gray-300'}`} />
            </CustomTooltip>
        </div>
    )
}

export default ChartFavoriteStar