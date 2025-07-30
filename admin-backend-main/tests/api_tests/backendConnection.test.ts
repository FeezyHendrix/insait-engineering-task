import axios from "axios";
import { describe, expect, test } from '@jest/globals';
import { testConstants } from "../constants";
import constants from '../../src/constants';
import dotenv from "dotenv"
import { generateCompanyConfig } from "../utils/companyConfig";
import { KeyCloakRequestBody } from "../utils/types";
dotenv.config()

describe("dummy test for when there's seeding, since each suite must have at least 1 test", () => {
  test("dummy test", () => {
    expect(1).toBe(1)
  })
})

describe("fetch valid dashboard variables", () => {
    test(
      "GET /analytics/dashboard",
      async () => {
        const response = await axios.get(`http://${constants.BACKEND_URL}/analytics/admin`);
        expect(response.status).toBe(200);
        expect(typeof response.data).toBe("object");
        expect(Object.keys(response.data)).toEqual(Object.keys(testConstants.DASHBOARD_VARIABLE_TYPES))
        for (const variable of Object.keys(response.data)) {
          if (variable !== "earliestInteractionTimestamp") {
            const typedVariable = variable as keyof typeof testConstants.DASHBOARD_VARIABLE_TYPES;
            expect(typeof response.data[typedVariable]).toBe(testConstants.DASHBOARD_VARIABLE_TYPES[typedVariable])
          }
        }
      },
      Number(testConstants.JEST_TIMEOUT_MSECONDS)
    )
  });
  
  describe("fetch valid advancedAnalytics variables", () => {
    test(
      "GET /analytics/advancedAnalytics",
      async () => {
        const response = await axios.get(`http://${constants.BACKEND_URL}/analytics/advancedAnalytics`);
        expect(response.status).toBe(200);
        expect(typeof response.data).toBe("object");
        expect(Object.keys(response.data)).toEqual(Object.keys(testConstants.ADVANCED_ANALYTICS_VARIABLE_TYPES))
        for (const variable of Object.keys(response.data)) {
          if (variable !== "earliestInteractionTimestamp") {
            const typedVariable = variable as keyof typeof testConstants.ADVANCED_ANALYTICS_VARIABLE_TYPES;
            expect(typeof response.data[typedVariable]).toBe(testConstants.ADVANCED_ANALYTICS_VARIABLE_TYPES[typedVariable])
          }
        }
      },
      Number(testConstants.JEST_TIMEOUT_MSECONDS)
    )
  });
  