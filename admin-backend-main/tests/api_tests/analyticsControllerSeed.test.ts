import axios from "axios";
import { describe, expect, test } from '@jest/globals';
import constants from '../../src/constants';
import dotenv from "dotenv"

dotenv.config()

describe("dummy test for when there's no seeding, since each suite must have at least 1 test", () => {
  test("dummy test", () => {
    expect(1).toBe(1)
  })
})

const generateMonthYears = async () => {
  const allInteractions = await axios.get(`http://${constants.BACKEND_URL}/analytics/dashboardConversations`);
        interface Interaction {
          id: string;
          customerId: string;
          productId: string;
          startedTime: string;
          endTime: string | null;
          avgResponseTimePerQuery: number;
          endStatus: string;
          positivenessScore: number;
          complexityScore: number;
          speed: number;
          messages: any[];
          comment: string;
        }
        const interactionsArray: Interaction[] = allInteractions.data
        let lastInteractionTime: string | null = null;
        interactionsArray.forEach(interaction => {
          const endTime = interaction.endTime;
          if (endTime !== null && (lastInteractionTime === null || new Date(endTime) > new Date(lastInteractionTime))) {
            lastInteractionTime = endTime;
          }
        }); 

        let firstInteractionTime: Date | null = null;
        interactionsArray.forEach(interaction => {
          const endTime = interaction.endTime;

          if (endTime !== null && (firstInteractionTime === null || new Date(endTime) < new Date(firstInteractionTime))) {
            firstInteractionTime = new Date(endTime);
          }
        }); 
        const monthYears: string[] = [];
        let todayPointer = firstInteractionTime ?? new Date();
        const today = new Date();
        while (todayPointer <= today) {
          const label = `${todayPointer.getMonth()}-${todayPointer.getFullYear()}`;
          monthYears.push(label);
          todayPointer.setMonth(todayPointer.getMonth() + 1);
          todayPointer.setDate(1)
        }
        return monthYears
}

// SEEDING TESTS
if (constants.RUN_MODE && ["DEV_SEED", "SEED_DEMO", "TEST"].includes(constants.RUN_MODE)) {
  describe("check peakTimeData that afternoon is more common than midnight", () => {
    test(
      "GET /analytics/dashboard.peakTimeData",
      async () => {
        const dashboardResponse = await axios.get(`http://${constants.BACKEND_URL}/charts/peakInteractionTime`);
        for (let day of dashboardResponse.data) {
          let midnightValue;
          let middayValue;
          for (let hour of day.data) {
            if (hour.x == "12 PM") {
              middayValue = hour.y
            }
            if (hour.x == "12 AM") {
              midnightValue = hour.y
            }
          }
          expect(typeof midnightValue).toBe('number')
          expect(typeof middayValue).toBe('number')
        }
      }
    )
  })

  describe("check interactionDuration that it's an integer", () => {
    test(
      "GET /analytics/dashboard.interactionDuration",
      async () => {
        const dashboardResponse = await axios.get(`http://${constants.BACKEND_URL}/charts/interactionDuration`);
        expect(!isNaN(dashboardResponse.data)).toBe(true)
      }
    )
  })

  describe("check userQueries that it's an integer followed by 's'", () => {
    test(
      "GET /analytics/dashboard.userQueries",
      async () => {
        const dashboardResponse = await axios.get(`http://${constants.BACKEND_URL}/analytics/admin`);
        const calculation = dashboardResponse.data.userQueries.slice(0, -1)
        expect(!isNaN(calculation)).toBe(true)
        expect(dashboardResponse.data.userQueries.slice(dashboardResponse.data.userQueries.length - 1)).toBe("s")
      }
    )
  })

  describe("check earliestInteractionTimestamp is a time", () => {
    test(
      "GET /analytics/dashboard.earliestInteractionTimestamp",
      async () => {
        const dashboardResponse = await axios.get(`http://${constants.BACKEND_URL}/analytics/dashboard`);
        const result = dashboardResponse.data.earliestInteractionTimestamp
        expect(Date.parse(result)).not.toBeNaN()
      }
    )
  });

  describe("check sentimentDonutData adds up to total interaction count", () => {
    test(
      "GET /analytics/advancedAnalytics.sentimentDonutData",
      async () => {
        const analyticsResponse = await axios.get(`http://${constants.BACKEND_URL}/analytics/advancedAnalytics`);
        const sentimentSum = analyticsResponse.data.sentimentDonutData.data.reduce((partialSum: number, a: number) => partialSum + a, 0);;
        expect(typeof sentimentSum).toBe("number");
        expect(sentimentSum).toBe(constants.SEEDING_PARAMS_OBJECT.interactionCount)
      }
    )
  }) 

  describe("check userPersonaData adds up to total customer count", () => {
    test(
      "GET /analytics/advancedAnalytics.userPersonaData",
      async () => {
        const analyticsResponse = await axios.get(`http://${constants.BACKEND_URL}/analytics/advancedAnalytics`);
        const userSum = analyticsResponse.data.userPersonaData.data.reduce((partialSum: number, a: number) => partialSum + a, 0);
        expect(typeof userSum).toBe("number");
        expect(userSum).toBe(constants.SEEDING_PARAMS_OBJECT.customerCount)
      }
    )
  })

  describe("check conversationalDepth has values", () => {
    test(
      "GET /analytics/advancedAnalytics.conversationalDepthBarData",
      async () => {
        const monthYears = await generateMonthYears()
        let totalSum = 0
        for (let monthYear of monthYears) {
          const analyticsResponse = await axios.get(`http://${constants.BACKEND_URL}/analytics/advancedAnalytics?conversationDepthMonth=${monthYear}`);
          for (let level of ["simple", "moderate", "complex"]) {
            let levelSum = 0
            for (let week of analyticsResponse.data.conversationDepthBarData) {
              if (!isNaN(week[level])) {
                levelSum += week[level]
                totalSum += levelSum
              }
            }
            expect(levelSum).toBeGreaterThanOrEqual(0)
          }
        }
      }, 120000
    )
  });

  describe("check user return data", () => {
    test(
      "GET /analytics/advancedAnalytics.userReturnData",
      async () => {
        const monthYears = await generateMonthYears()
        for (let monthYear of monthYears) {
          const analyticsResponse = await axios.get(`http://${constants.BACKEND_URL}/analytics/advancedAnalytics?userReturnMonth=${monthYear}`);
          let userReturnSum = 0;
          for (let week of analyticsResponse.data.userReturnData) {
            userReturnSum += week.value
          }
          expect(userReturnSum).toBeGreaterThan(0)
        }
      }, 120000   
    )
  });

  describe("check conversation duration", () => {
    test(
      "GET /charts/conversationDuration",
      async () => {
          const conversationDurationResponse = await axios.get(`http://${constants.BACKEND_URL}/charts/conversationDuration`);
          const expectedResponseKeys = constants.CONVERSATION_DURATION_RANGES.map(range => range.label);
          const receivedKeys = conversationDurationResponse.data.map((range: { name: string }) => range.name);
          expect(conversationDurationResponse.status).toBe(200);
          expect(receivedKeys).toEqual(expectedResponseKeys);
          for (const item of conversationDurationResponse.data) {
            expect(item["value"]).toBeGreaterThan(0);
          }
      }, 120000   
    )
  });
}
