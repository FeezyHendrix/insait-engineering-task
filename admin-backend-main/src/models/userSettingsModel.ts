import logger from "../libs/pino";
import { prisma } from "../libs/prisma"
import { ValidationError } from "../utils/error";

export const getUserSettingsByUsername = async (username: string): Promise<{favoriteCharts?: string[] | undefined}> => {
    const userSettings = await prisma.userSetting.findUnique({
        where: {
            username
        }
    });
    return userSettings || {};
};

export const addUserFavoriteChart = async (username: string, chartType: string) => {
        const currentFavorites: string[] = (await prisma.userSetting.findUnique({
            where: {
                username
            },
            select: {
                favoriteCharts: true
            }
        }))?.favoriteCharts || [];
        if (currentFavorites?.includes(chartType)) {
            throw new ValidationError(`Chart ${chartType} is already a favorite of ${username}`);
        };
        const updatedFavorites: string[] = currentFavorites.concat(chartType);
        await prisma.userSetting.upsert({
            where: {
                username,
            },
            update: {
                favoriteCharts: {
                    set: updatedFavorites || []
                }
            },
            create: {
                username,
                favoriteCharts: {
                    set: updatedFavorites
                }
            }
        });
        logger.info(`Chart ${chartType} added to ${username}'s favorite charts`);
        return chartType;
    };
    
    export const removeUserFavoriteChart = async (username: string, chartType: string) => {
        const currentFavorites = (await prisma.userSetting.findUnique({
            where: {
                username
            },
            select: {
                favoriteCharts: true
            }
        }))?.favoriteCharts;
        if (!currentFavorites?.includes(chartType)) {
            throw new ValidationError(`Chart ${chartType} is not a favorite of ${username}`);
        };
        const updatedFavorites = currentFavorites?.filter((favorite: string) => favorite !== chartType);
        await prisma.userSetting.update({
            where: {
                username
            },
            data: {
                favoriteCharts: {
                    set: updatedFavorites
                }
            }
        });
        logger.info(`Chart ${chartType} removed from ${username}'s favorite charts`);
        return chartType;
    }