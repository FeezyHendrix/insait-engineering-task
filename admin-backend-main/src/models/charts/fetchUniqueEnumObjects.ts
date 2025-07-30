import logger from "../../libs/pino";
import { prisma } from "../../libs/prisma"
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchUniqueEnumObjects = async ( fields: string[],startDate?:string, endDate?:string, flowId?: string | null ) => {
    try {
        const queryFilters = generateChartTimeFilter(startDate, endDate);

        const interactions: {dataObject: string | null}[] = await prisma.interaction.findMany({
            select: {
                dataObject: true,
            },
            where: {
                dataObject: {
                    not: null
                },
                startedTime: queryFilters,
                ...useOptionalFlowId(flowId),
            }
        });

        const fieldCounts: Record<string, Record<string, number>> = {};
        interactions.forEach(interaction => {
            if (!interaction.dataObject) return;
    
            const parsedData = JSON.parse(interaction.dataObject);


            fields.forEach(field => {
                const value = parsedData[field];
                if(!value) return;
                fieldCounts[field] = fieldCounts[field] ?? {}; 
                fieldCounts[field][value] = (fieldCounts[field][value] || 0) + 1;
            });

        });
        const labels = Object.keys(fieldCounts);
        const data = labels.map(field => {
            const values = Object.entries(fieldCounts[field]).map(([key, count]) => ({ key, count }));
            return {
                field,
                values,
            };
        });

        return {
            labels,
            data,   
        };

    } catch (error) {
        logger.error("Error fetching unique objects:", error);
        throw error;
    }
};