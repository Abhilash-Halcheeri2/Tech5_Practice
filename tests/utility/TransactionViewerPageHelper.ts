import { test, expect, Page } from "@playwright/test";
import { clearAndFillTextBox, NavigateToSubArea } from "./helper";
import {
  ControlType,
  GridType,
  stringFormat,
  SubAreaNames,
  Timeouts,
} from "../constants/Commons/commons";
import {
  TransactionViewer_SearchBar,
  transactionViewerAdvancedSearch_Selectors,
} from "../constants/Selectors/TransactionViewerSelectors";
import {
  AdvancedSearchLocators,
  SavedBookingRecorsPage,
} from "../constants/Selectors/RecordsPageSelectors";
import {
  selectOptFromAdvancedsearchDD,
  waitForLoadGridData,
  waitForLoadSavedForm,
} from "./SavedBookingrecordsPageHelper";
import { error } from "console";
import { dropdown_successMessage } from "../constants/Commons/constants";
import { HomePageLocators } from "../constants/Selectors/HomePageSelectors";
import {
  ActionButtonTypes,
  Sex_Offender_Selectors,
} from "../constants/Selectors/NewBookingRecordsSelector";
import { Locator } from "puppeteer";

/**
 * Searches for a transaction record using the provided booking number.
 *
 * This function navigates to the transaction viewer sub-area, clears the search
 * bar, fills it with the specified booking number, and waits for the records grid
 * to appear.
 *
 * @param page - The Page object representing the current browser context.
 * @param BookingNumber - The booking number to search for in the transaction viewer.
 * @throws Will throw an error if navigation or search actions fail.
 */
export async function SearchTransactionRecord(
  page: Page,
  BookingNumber: string
) {
  // Navigate to the transaction viewer sub-area
  await NavigateToSubArea(page, SubAreaNames.transactionViewer);

  // Clear the search bar and fill it with the booking number
  await clearAndFillTextBox(
    page,
    page.getByPlaceholder(TransactionViewer_SearchBar),
    BookingNumber
  );

  // Wait for the records grid to become visible
  await page.waitForSelector(SavedBookingRecorsPage.RecordsGrid);
}

/**
 * Searches for transaction records by booking number and validates the results.
 *
 * This function performs a search for transaction records using the specified
 * booking number, then checks if the booking number appears in the results.
 * If no records are found, it asserts that at least one matching record should exist.
 *
 * @param page - The Page object representing the current browser context.
 * @param BookingNumber - The booking number to search for in the transaction records.
 * @throws
 */
export async function SearchAndValidateTransactionRecords(
  page: Page,
  BookingNumber: string
) {
  // Perform the search for the specified booking number
  await SearchTransactionRecord(page, BookingNumber);

  let xyz = await page.$$("table tr");

  for (let i = 1; i < xyz.length; i++) {
    let list = await page.$$("(//table//tr)[" + (i + 1) + "]//td");

    let count = 0;
    for (let j = 1; j < list.length; j++) {
      const text = await list[j].innerText();

      if (text.includes(BookingNumber)) {
        //console.log(text);
        count++;
      }
    }
    console.log(count);
    if (count == 0) {
      // console.log(count)
      expect(
        count,
        "Expected search result is not matching with searched account"
      ).toBeGreaterThan(0);
    }
  }
}

export async function transactionViewerActionDropDownvalueSelect(
  page: Page,
  Select_option: string
) {
  await page.waitForSelector(AdvancedSearchLocators.Advancedsearch_Dailog);

  await page
    .locator(transactionViewerAdvancedSearch_Selectors.actionDropDown)
    .click();
  // Wait for the dropdown options container to appear
  await page.waitForSelector(
    transactionViewerAdvancedSearch_Selectors.actionDropdownList
  );

  // Fetch all options in the dropdown
  let options = await page.$$(
    transactionViewerAdvancedSearch_Selectors.actionDropdownList
  );
  let optionFound = false;

  // Loop through each option to find the desired value
  for (let i = 0; i < options.length; i++) {
    let values = await options[i].textContent();
    console.log(values);

    if (values?.includes(Select_option)) {
      await options[i].click();
      console.log(dropdown_successMessage, `Selected option: ${Select_option}`);
      optionFound = true;
      break;
    }
  }
  if (!optionFound) {
    throw error(`Option ${Select_option} not found in the Action dropdown.`);
  }
}

export async function transactionViewerAdvancedSearch_Search(
  page: Page,
  controlType: string,
  searchField: string,
  fieldValue: string
) {
  await page.waitForSelector(AdvancedSearchLocators.Advancedsearch_Dailog);
  switch (controlType) {
    case ControlType.TextBox:
      await clearAndFillTextBox(
        page,
        stringFormat(
          transactionViewerAdvancedSearch_Selectors.ransactionViewerAdvancedSearch_searchTextBox,
          searchField
        ),
        fieldValue
      );
      break;

    case ControlType.DropDown:
      await transactionViewerActionDropDownvalueSelect(page, fieldValue);
  }
}

export async function validateTransactionViewerAdvancedsearchRecord(
  page: Page,
  tableHeader: string,
  searchedValue: string
) {
  await page.waitForTimeout(Timeouts.AnimationTimeout);
  await page.waitForSelector("[role='table']");

  const tableHeads = await page.$$("//table//th");
  // let columnIndex = -1;
  let count = 0;
  // Find the index of the specified column
  for (let i = 0; i < tableHeads.length; i++) {
    const headerText = await tableHeads[i].textContent();
    // console.log(headerText);
    if (headerText?.includes(tableHeader)) {
      console.log("coloum Header: " + headerText);
      // columnIndex = i;

      const rows = await page.$$("//table//tbody//tr");

      for (let j = 0; j < rows.length; j++) {
        const lists = page.locator(
          "(//table//tr[" + (j + 1) + "])/td[" + (i + 1) + "]"
        );
        const txt = await lists.textContent();
        // console.log(txt);
        if (txt?.includes(searchedValue)) {
          count++;
          console.log(`Record found in Column: ${i + 1}, Row: ${j + 1}`); // Log the column and row numbers
        }
      }
      break;
    }
  }
  if (count == 0) {
    console.log("no record");
  }
  console.log(`${count} record(s) found.`);
}

/**
 * Open grid records without search.
 * @param page
 * @param gridType
 * @param columnNum
 * @param rowNum
 */
export async function openGridRecordsWithoutSearch(
  page: Page,
  gridType: string,
  columnNum: number,
  rowNum: number
) {
  await waitForLoadGridData(page);
  if (rowNum <= 0 || columnNum <= 1) {
    throw new Error(
      "Row number must be greater than 0 and column number must be greater than 1."
    );
  }

  // Adjust column number if gridType is SavedBooking
  const adjustedColumnNum = gridType === GridType.SavedBookingRecords ? 1 : columnNum;

  const cellXPath = `//table//tr[${rowNum}]//td[${adjustedColumnNum}]`;
  const cellLocator = page.locator(cellXPath);

  // Wait for the cell to be visible
  await cellLocator.waitFor({ state: "visible" });

  if (gridType === GridType.SavedBookingRecords) {
    // Click directly on the cell for SavedBooking
    await cellLocator.click();
  } else {
    // Use recordLinkLocator for other grid types
    const recordLinkLocator = cellLocator.locator("a");

    // Wait for the link to be visible
    await recordLinkLocator.waitFor({ state: "visible" });

    // Click on the link
    await recordLinkLocator.click();
  }

  // Wait for the form to load
  await waitForLoadSavedForm(page);
}

/**
 *
 * @param page
 * @param FieldTobeEdit
 * @param controlType
 */
export async function editFormValues(
  page: Page,
  FieldTobeEdit: string,
  controlType: string
) {
  await page.waitForSelector(
    stringFormat(
      Sex_Offender_Selectors.recordPageButtonLocator1,
      ActionButtonTypes.Complete
    )
  );
  await page.waitForSelector(
    stringFormat(
      Sex_Offender_Selectors.recordPageButtonLocator1,
      ActionButtonTypes.EditMode
    )
  );

  switch (controlType) {
    case ControlType.TextBox:
      await page
        .locator(
          stringFormat(
            Sex_Offender_Selectors.txt_box_BiographicsFormField,
            FieldTobeEdit
          )
        )
        .inputValue();
  }
}

export async function retrieveFieldValue(
  page: Page,
  formField: string
): Promise<string> {
  // Ensure the field locator is correctly formatted
  const fieldLocator = stringFormat(
    Sex_Offender_Selectors.txt_box_BiographicsFormField,
    formField
  );

  // Wait for the field to be visible
  await page.locator(fieldLocator).waitFor({ state: "visible" });
   // Get the value attribute of the field
  const fieldValue = await page.locator(fieldLocator).getAttribute("value");

  if (!fieldValue) {
    throw new Error(
      `Field '${formField}' is empty or the value could not be retrieved.`
    );
  }

  console.log(`Retrieved value for field '${formField}': ${fieldValue}`);
  return fieldValue.trim(); // Return trimmed value to avoid leading/trailing spaces
}
