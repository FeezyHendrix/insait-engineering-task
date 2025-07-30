import { RequestHandler } from "express";
import { getUserSettingsByUsername } from "../models/userSettingsModel";
import tryCatch from "../utils/tryCatch";
import { updateFavoriteChart } from "../services/userSettingsServices";
import { favoriteChartRequest } from "../types/interfaces";

export const getUserSettings: RequestHandler = tryCatch(async (req, res, next) => {
    const { username } = req.body.data ?? req.body;
    const userSettings = await getUserSettingsByUsername(username);
    res.status(200).json(userSettings);
});

export const updateUserSettings: RequestHandler = tryCatch(async (req, res, next) => {
    const { username, payload } = req.body.data ?? req.body as { username: string, payload: favoriteChartRequest }; // when we add other settings add more types
    const { field } = req.params;

    switch (field) {
        case 'favoriteCharts':
            const updatedUserCharts = await updateFavoriteChart(username, payload);
            res.status(200).json(updatedUserCharts);
            break;

        default:
            res.status(400).json({ error: `Invalid settings field: ${field}` });
            return;
    };
});