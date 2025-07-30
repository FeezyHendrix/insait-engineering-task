import { favoriteChartRequest } from "../types/interfaces";
import logger from "../libs/pino";
import { addUserFavoriteChart, getUserSettingsByUsername, removeUserFavoriteChart } from "../models/userSettingsModel";

export const updateFavoriteChart = async (username: string, payload: favoriteChartRequest) => {
    const { chartType, action } = payload;
    if (!['add', 'remove'].includes(action)) {
        throw new Error('Action must be either "add" or "remove"');
    };
    if (!username) {
        throw new Error('username is required');
    };
    if (!chartType) {
        throw new Error('chartType is required');
    };
    const addedFavoriteChart = action === 'add' ? await addUserFavoriteChart(username, chartType) : await removeUserFavoriteChart(username, chartType);
    const successMessage = `Chart ${addedFavoriteChart} ${action === 'add' ? 'added to' : 'removed from'} ${username}'s favorite charts`;
    logger.info(successMessage);
    const userFavoriteCharts = (await getUserSettingsByUsername(username)).favoriteCharts;
    return userFavoriteCharts;
};
