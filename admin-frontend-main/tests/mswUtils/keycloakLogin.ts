import { Page } from "@playwright/test";
import {defaultPageUrl } from "../utils/testsConstants";

export const keycloakLogin = async (page: Page) => {    
    await page.goto(defaultPageUrl); 
    await page.keyboard.press('Enter')
}