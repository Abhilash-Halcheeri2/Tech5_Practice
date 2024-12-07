import { Page } from "@playwright/test";
import {
  Card_searchBar,
  CardsLocators,
} from "../constants/Selectors/CardsPageSelectors";
import { clearAndFillTextBox } from "./helper";
import {
  clickFormActionButton,
  selectDialogOption,
  waitforLoadDialog,
  waitForLoadGridData,
} from "./SavedBookingrecordsPageHelper";
import { ActionButtonTypes } from "../constants/Selectors/NewBookingRecordsSelector";
import { SavedBookingRecorsPage } from "../constants/Selectors/RecordsPageSelectors";
import { selectOptionsFromBiographicsDD } from "./BookingRecordsHelpers";
import { HomePageLocators } from "../constants/Selectors/HomePageSelectors";

export async function searchCards(page: Page) {
  await waitForLoadGridData(page);
  const search_bar: any = page.getByPlaceholder(Card_searchBar);
  await page.waitForSelector(search_bar);
  await clearAndFillTextBox(page, search_bar, "Hello");
}

export async function delteCardsfromGrid(page: Page) {
  await waitForLoadGridData(page);
  // await page.waitForSelector(SavedBookingRecorsPage.RecordsGrid);

  await clickFormActionButton(page, ActionButtonTypes.Delete_card);
  await waitforLoadDialog(page);
  await selectDialogOption(page, ActionButtonTypes.Yes_delete);
}

export async function uploadCard(
  page: Page,
  CardDisplayName: string,
  recordType: string,
  cardLocation: string,
  
) {
  
  await waitForLoadGridData(page);
  await page.waitForSelector(CardsLocators.uploadCards);

  const [filechooser] = await Promise.all([
    await page.waitForEvent("filechooser"),
    page.locator(CardsLocators.uploadCards).click(),
    await waitforLoadDialog(page),
  ]);

  filechooser.setFiles(cardLocation);
  //await page.locator(CardsLocators.uploadCards).click();

  await selectOptionsFromBiographicsDD(page, "select", recordType);
  await clearAndFillTextBox(page, CardsLocators.displayName, CardDisplayName);

  await page.locator(HomePageLocators.login_btn).click();
}
