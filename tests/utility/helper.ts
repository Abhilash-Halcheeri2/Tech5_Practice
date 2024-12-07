import { test, expect, Page, BrowserContext } from "@playwright/test";
import {
  HomePageLocators,
  itemsPage,
  LoginSelectors,
  loginWithMSopt,
  MS_Email,
  MS_Password,
} from "../constants/Selectors/HomePageSelectors";
import {
  Attributes,
  BooleanStates,
  HomePage,
  LoadState,
  SubAreaNames,
  Timeouts,
  stringFormat,
} from "../constants/Commons/commons";
import { SavedBookingRecorsPage } from "../constants/Selectors/RecordsPageSelectors";

import { New_BookingRecord_Selectors } from "../constants/Selectors/NewBookingRecordsSelector";
import { Locator } from "puppeteer";
import {
  loginFailedMessage,
  loginSuccessMessage,
  subAreaLoadErrorMessage,
  subAreaLoadSuccessMessage,
  subAreaNavigateSuccessMessage,
} from "../constants/Commons/constants";
import { waitForLoadGridData } from "./SavedBookingrecordsPageHelper";

/**
 * Clears the specified text box and fills it with the provided keyword.
 *
 * @param page - The Page object representing the current browser context.
 * @param textBoxSelector - The selector for the text box to be cleared and filled.
 * @param fillKeyword - The keyword to fill into the text box.
 * @throws
 */
export async function clearAndFillTextBox(
  page: Page,
  textBoxSelector: any,
  fillKeyword: any
) {
  // Wait for the text box to be visible
  const textBoxLocator = page.locator(textBoxSelector);
  await textBoxLocator.waitFor({ state: "visible" });

  // Click the text box to focus
  await textBoxLocator.click();

  // Clear the existing text in the text box
  await textBoxLocator.fill(""); // Using fill with an empty string to clear

  // Fill the text box with the specified keyword
  await textBoxLocator.fill(fillKeyword);

  // Optional: Check if the value was filled correctly
  const currentValue = await textBoxLocator.inputValue();
  if (currentValue !== fillKeyword) {
    throw new Error(
      `Failed to fill the text box with "${fillKeyword}". Current value: "${currentValue}"`
    );
  }
}

/**
 * Logs into the user account using the provided credentials.
 *
 * @param page - The Page object representing the current browser context.
 * @param userName - The username of the account.
 * @param userPassword - The password of the account.
 * @returns A success message if the login is successful.
 * @throws Will throw an error if the login process fails at any point.
 */
export async function loginToAccount(
  page: Page,
  userName: string,
  userPassword: string
): Promise<string> {
  // Wait for the main frame to load
  await page.waitForSelector(HomePageLocators.MainFrame);

  // Check if the login with App credential button is expanded; if not, click to open
  const isLoginButtonExpanded = await page
    .locator(HomePageLocators.LoginWithAppCredantials_btn)
    .getAttribute(Attributes.AriaExpanded);

  if (isLoginButtonExpanded !== BooleanStates.TRUE) {
    await page.locator(HomePageLocators.LoginWithAppCredantials_btn).click();
  }

  // Wait for the username field to be visible
  await page.waitForSelector(HomePageLocators.UserName_txt);

  // Clear and fill the username field
  await clearAndFillTextBox(page, HomePageLocators.UserName_txt, userName);

  // Clear and fill the password field
  await clearAndFillTextBox(page, HomePageLocators.Password_txt, userPassword);

  // Click the login button to submit the credentials
  await page.locator(HomePageLocators.login_btn).click();

  // Optional: Add a wait or check to verify successful login
  const isLoginSuccessful = await page
    .waitForSelector(HomePageLocators.WelCome_Screen, { timeout: 5000 })
    .catch(() => false);

  if (!isLoginSuccessful) {
    throw new Error(loginFailedMessage);
  }

  console.log(loginSuccessMessage);

  // Return success message
  return loginSuccessMessage;
}

/**
 * Waits for the user menu and sub-area container to load on the page.
 *
 * @param page - The Page object representing the current browser context.
 * @returns A success message indicating that the sub-area container has loaded.
 * @throws Will throw an error if the selectors do not become visible within the timeout.
 */
export async function waitForSubareaContainer(page: Page): Promise<string> {
  try {
    // Wait for the user menu to be visible
    await page.waitForSelector(
      stringFormat(itemsPage.subArea, HomePage.UserMenu),
      {
        timeout: Timeouts.DefaultLoopWaitTime,
      }
    );

    await page.waitForSelector(itemsPage.SubAreaContainer),
      {
        timeout: Timeouts.DefaultLoopWaitTime,
      };

    return subAreaLoadSuccessMessage; // Returns the success message
  } catch (error) {
    console.error(subAreaLoadErrorMessage, error);
    throw new Error(subAreaLoadErrorMessage);
  }
}

/**
 * Clicks on a specified sub-area after ensuring the container is loaded.
 *
 * @param page - The Page object representing the current browser context.
 * @param subAreaName - The name of the sub-area to click on.
 * @returns A success message indicating that the sub-area was clicked.
 * @throws Will throw an error if the specified sub-area cannot be found or clicked.
 */
export async function clickOnSubArea(
  page: Page,
  subAreaName: string
): Promise<string> {
  // Ensure the sub-area container is loaded before interacting
  await waitForSubareaContainer(page);

  const subAreaLocator = page.locator(
    stringFormat(itemsPage.subArea, subAreaName)
  );

  try {
    // Click on the specified sub-area
    await subAreaLocator.click();
    await page.waitForTimeout(Timeouts.AnimationTimeout);

    const successMessage = `Sub-area "${subAreaName}" clicked successfully.`;
    return successMessage; // Return the success message
  } catch (error) {
    console.error(`Error while clicking on sub-area "${subAreaName}":`, error);
    throw new Error(`Sub-area "${subAreaName}" could not be clicked.`);
  }
}

/**
 * Navigates to a specified sub-area within the application.
 *
 * @param page - The Page object representing the current browser context.
 * @param subAreaName - The name of the sub-area to navigate to.
 * @throws Will throw an error if the sub-area is unknown or if navigation fails.
 */

export async function NavigateToSubArea(
  page: Page,
  subAreaName: string
): Promise<string> {
  // Ensure the sub-area container is loaded before proceeding
  await waitForSubareaContainer(page);
  try {
    switch (subAreaName) {
      case SubAreaNames.cards:
      case SubAreaNames.audit:
      case SubAreaNames.settings:
        await waitForSubareaContainer(page);
        await clickOnSubArea(page, subAreaName);
        break;
        
      case SubAreaNames.savedBookingRecords:
      case SubAreaNames.transactionViewer:
        await clickOnSubArea(page, SubAreaNames.records);
        await page.waitForTimeout(Timeouts.AnimationTimeout);
        await clickOnSubArea(page, subAreaName);
        await page.waitForTimeout(Timeouts.AnimationTimeout);
        await page.waitForSelector(SavedBookingRecorsPage.RecordsGrid);
        break;

      case SubAreaNames.ADC_Intake:
      case SubAreaNames.Crim_JusticeApplicant:
      case SubAreaNames.Sex_Offender:
        const newRecordExpanded = await page
          .locator(stringFormat(itemsPage.subArea, SubAreaNames.newRecord))
          .getAttribute(Attributes.AriaExpanded);
        console.log(newRecordExpanded);
        if (newRecordExpanded) {
          await clickOnSubArea(page, SubAreaNames.newRecord);
        }
        const newBookingRecordExpanded = await page
          .locator(
            stringFormat(itemsPage.subArea, SubAreaNames.New_Booking_Record)
          )
          .getAttribute(Attributes.AriaExpanded);
        if (newBookingRecordExpanded) {
          await clickOnSubArea(page, SubAreaNames.New_Booking_Record);
        }

        await clickOnSubArea(page, subAreaName);
        await page.waitForSelector(
          New_BookingRecord_Selectors.BookingPage_FormHeader
        );
        await page.waitForTimeout(Timeouts.CommandbarButtonTimeout);
        break;

      default:
        throw new Error(`Unknown subarea: ${subAreaName}`);
    }
    console.log(`${subAreaNavigateSuccessMessage}${subAreaName}`);
    return subAreaNavigateSuccessMessage;
  } catch (error) {
    console.error(`Error navigating to "${subAreaName}" _sub-area `, error);
    throw new Error(`Failed to navigate to ${subAreaName} subarea`);
  }
}

/**
 * Logs into the application using Microsoft credentials.
 *
 * @param {Page} page - The Playwright Page object used to interact with the browser.
 * @throws Will throw an error if login steps fail or elements are not visible.
 */
export async function loginWithMSCredentials(
  page: Page,
  Email: string,
  Password: string
) {
  // Wait for the login with Microsoft credentials option to be visible
  await page.waitForSelector(stringFormat(itemsPage.subArea, loginWithMSopt), {
    timeout: Timeouts.CommandbarButtonTimeout,
  });

  const isMSCredentialsOptVisible = await page
    .locator(stringFormat(itemsPage.subArea, loginWithMSopt))
    .isVisible();

  if (isMSCredentialsOptVisible) {
    // Click the Microsoft login option
    await page
      .locator(stringFormat(itemsPage.subArea, loginWithMSopt))
      .click({ timeout: Timeouts.CommandbarButtonTimeout });
  } else {
    console.error("Microsoft credentials login option is not visible.");
    throw new Error("Microsoft login option is not visible.");
  }

  // Fill in the email address field with the provided Microsoft email
  await clearAndFillTextBox(
    page,
    stringFormat(LoginSelectors.MS_Login_textBox, MS_Email),
    Email
  );

  // Click on the login button to submit the email
  await page.locator(HomePageLocators.login_btn).click();

  // Fill in the password field with the provided Microsoft password
  await clearAndFillTextBox(
    page,
    stringFormat(LoginSelectors.MS_Login_textBox, MS_Password),
    Password
  );

  // Click the login button to submit the password
  await page.locator(HomePageLocators.login_btn).click();

  await page.waitForLoadState("domcontentloaded");

  // Check if the "Stay signed in?" prompt appears
  const isStaySignInVisible = await page.locator("#lightbox").isVisible();

  if (isStaySignInVisible) {
    // Click "No" on the "Stay signed in?" prompt to skip it
    await page.locator("#idBtn_Back").click();
    await page.waitForSelector(
      stringFormat(itemsPage.subArea, HomePage.UserMenu),
      {
        timeout: Timeouts.DefaultLoopWaitTime,
      }
    );
  } else {
    console.log(
      "Stay signed in prompt is not visible. Proceeding without action."
    );
  }

  await page.waitForSelector(
    stringFormat(itemsPage.subArea, HomePage.UserMenu),
    {
      // timeout: Timeouts.DefaultLoopWaitTime,
    }
  );

  const isLoginSuccessful = await page
    .waitForSelector(HomePageLocators.WelCome_Screen, { timeout: 5000 })
    .catch(() => false);

  if (!isLoginSuccessful) {
    throw new Error(loginFailedMessage);
  }

  console.log(loginSuccessMessage);

  // Return success message
  return loginSuccessMessage;
}

/**
 * Clears the cache for the provided browser context.
 * @param context - The Playwright BrowserContext instance.
 */
export async function clearCache(context: BrowserContext) {
  try {
    // Clear all cookies
    await context.clearCookies();

    // Clear localStorage and sessionStorage for all pages in the context
    const pages = context.pages();
    for (const page of pages) {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    }

    console.log("Cache cleared successfully.");
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}

/**
 * 
 * @param page page reference
 * @param loadTimeout Page load timeout. Default - 10 sec
 */
export async function waitForDomContentLoad(page:Page,loadTimeout:number=Timeouts.ConnectionTimeout):Promise<void>{
  await page.waitForLoadState(LoadState.domcontentloaded,{timeout:loadTimeout});
}
