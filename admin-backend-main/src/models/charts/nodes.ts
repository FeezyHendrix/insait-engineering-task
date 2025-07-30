import constants from "../../constants";
import { prisma } from "../../libs/prisma";
import { generateChartTimeFilter, useOptionalFlowId } from "../../utils/charts";

export const fetchNodes = async (startDate: string | undefined, endDate: string | undefined, product: string | undefined, flowId?: string | null) => {
    const queryFilters = generateChartTimeFilter(startDate, endDate);
    const allConversationNodes: {nodes: string[]}[] = await prisma.interaction.findMany({
      where: {
        messageCount: {
        gt: 1
        },
        startedTime: queryFilters,
        nodes: {
          isEmpty: false
        },
        Product: {
          name: product
        },
        ...useOptionalFlowId(flowId),
      }
      });

      const nodeData: Record<string, { instances: number, wasLast: number}> = {};
      allConversationNodes.forEach((conversation) => {
        conversation.nodes.forEach((node) => {
          const existingNode = nodeData[node];
          const lastNodeAddition = node === conversation.nodes[conversation.nodes.length - 1] ? 1 : 0;
          if (!existingNode) {
            nodeData[node] = { instances: 1, wasLast: lastNodeAddition };
            return
          };
          existingNode.instances += 1;
          existingNode.wasLast += lastNodeAddition;
        });
      });
      const formattedData: {nodeName: string, instances: number, wasLast: number, wasLastPercentage: number}[] = Object.entries(nodeData)
        .filter(([_, data]) => data.wasLast)
        .map(([nodeName, data]) => ({
          nodeName,
          instances: data.instances,
          wasLast: data.wasLast,
          wasLastPercentage: Math.round((data.wasLast / data.instances) * 100)
        }))
        .sort((a, b) => b.wasLastPercentage - a.wasLastPercentage);
      return formattedData;
};
    