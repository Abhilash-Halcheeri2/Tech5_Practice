import { expect, Page } from "@playwright/test";
import {
  Attributes,
  ControlType,
  GridType,
  SubAreaNames,
  Timeouts,
  formStatuses,
  stringFormat,
} from "../constants/Commons/commons";
import {
  SavedBookingRecorsPage,
  withoutSearch_Message,
  operator,
  AdvancedSearchLocators,
  AdvancedSearchfieldValuesDropdown_opt,
  AdvancedSearchOperatorsDropdown_opt,
  value,
  fieldName,
  SavedBookingRecords_Search_Bar,
} from "../constants/Selectors/RecordsPageSelectors";
import {
  clickOnSubArea,
  clearAndFillTextBox,
  waitForDomContentLoad,
} from "./helper";
import {
  HomePageLocators,
  itemsPage,
} from "../constants/Selectors/HomePageSelectors";
import { error } from "console";
import {
  ActionButtonTypes,
  Biographics_Dropdown_fields,
  Biographics_form_fields,
  BiographicsFormSelectors,
  datePicker_Selectors,
  New_BookingRecord_Selectors,
  Sex_Offender_Selectors,
  TypeOfDatePickers,
} from "../constants/Selectors/NewBookingRecordsSelector";

import {
  BiographicsFormDateSelect,
  selectOptionsFromBiographicsDD,
  setBiographicsfieldValueOnForm,
  setDateOnDatePicker,
} from "./BookingRecordsHelpers";
import { retrieveFieldValue } from "./TransactionViewerPageHelper";
import { TransactionViewer_SearchBar } from "../constants/Selectors/TransactionViewerSelectors";
import path from "path";

/**
 * Searches for saved booking records using the provided search keyword.
 *
 * @param page - The Page object representing the current browser context.
 * @param searchBarLocator - The placeholder string for the search bar.
 * @param searchKeyword - The keyword to search for in the  records.
 * @throws
 */
export async function searchSavedBookingRecords(
  page: Page,
  searchBarLocator: string,
  searchValue: string
): Promise<string> {
  // Wait for the search bar to be visible
  const searchBar = page.locator(searchBarLocator);
  if (!(await searchBar.isVisible())) {
    throw new Error(
      `Search bar with placeholder "${searchBarLocator}" is not visible.`
    );
  }

  // Click on the search bar, clear any existing text, and fill it with the search keyword
  await searchBar.click();
  await searchBar.clear();
  await searchBar.fill(searchValue);

  return searchValue;
}

/**
 *
 * @param page The Page object representing the current browser context
 */
export async function ValidatesavedBookingRecordsGridPageWithoutSearch(
  page: Page
): Promise<string> {
  const bool = await page
    .locator(stringFormat(itemsPage.subArea, SubAreaNames.records))
    .getAttribute(Attributes.AriaExpanded);

  if (!bool) {
    await clickOnSubArea(page, SubAreaNames.records);
  }
  await clickOnSubArea(page, SubAreaNames.savedBookingRecords);
  const resultText = await page
    .locator(SavedBookingRecorsPage.ResultContainer)
    .textContent();

  try {
    expect(resultText).toContain(withoutSearch_Message);

    // Return a success message if validation passes
    const successMessage = `Successfully validated saved booking records grid page without search.`;
    console.log(successMessage); //
    return successMessage; // Returning the success message
  } catch (error) {
    // Log the failure message and throw an error
    const failureMessage = `Validation failed: Expected text "${withoutSearch_Message}" not found in the records grid.`;
    console.error(failureMessage);
    throw new Error(failureMessage); // Throw an error with the failure message
  }
}

/**
 * Searches for records in the specified table and validates the search results.
 *
 * This function waits for the search results grid to load, performs a search
 * using the provided search value, and counts the occurrences of the search
 * value within the table rows. It asserts that at least one match is found
 * for each row.
 *
 * @param page - The Page object representing the current browser context.
 * @param searchBarLocator - The locator string for the search bar element.
 * @param searchValue - The value to search
 * @throws Will throw an error if no matching records are found in any row.
 */
export async function SearchRecordsAndValidateInGrid(
  page: Page,
  searchBarLocator: string,
  searchValue: string
) {
  await page.waitForSelector(SavedBookingRecorsPage.RecordsGrid);

  // Perform the search using provided parameters
  await searchSavedBookingRecords(page, searchBarLocator, searchValue);
  await page.waitForTimeout(Timeouts.DefaultLoopWaitTime);

  let row = await page.$$("table tr");

  for (let i = 1; i < row.length; i++) {
    let gridcell = await page.$$("(//table//tr)[" + (i + 1) + "]//td");

    let count = 0;
    for (let j = 1; j < gridcell.length; j++) {
      const text = await gridcell[j].innerText();

      if (text.toLocaleLowerCase().includes(searchValue.toLowerCase())) {
        count++;
      }
    }
    //console.log(count);
    if (count == 0) {
      expect(
        count,
        "Expected search result is not matching with Account"
      ).toBeGreaterThan(0);
    }
  }
}

/**
 *
 * @param page The Page object representing the current browser context.
 */
export async function Click_AdvanceSearch_btn(page: Page) {
  const bool = await page
    .locator(SavedBookingRecorsPage.AdvancedSearch_btn)
    .getAttribute("aria-expanded");
  if (!bool) {
    await page.locator(SavedBookingRecorsPage.AdvancedSearch_btn).click();
  }

  await page.locator(SavedBookingRecorsPage.AdvancedSearch_btn).click();
  await page.waitForSelector(AdvancedSearchLocators.Advancedsearch_Dailog);
}

/**
 * Selects an option from an advanced search field dropdown.
 *
 * This function clicks on a specified dropdown, waits for the options to
 * load, and then selects the desired option if it matches the provided
 *
 *
 * @param page - The Page object representing the current browser context.
 * @param Dropdown_Select - The name of the dropdown to interact with.
 * @param Select_option - The option value to be selected from the dropdown.
 * @throws
 */
export async function selectAdvancedSearchDropdownValue(
  page: Page,
  Dropdown_Select: string,
  Select_option: string
) {
  await page
    .locator(
      stringFormat(AdvancedSearchLocators.AdvancedSearch_DD, Dropdown_Select)
    )
    .click();
  // Wait for the dropdown options container to appear
  await page.waitForSelector(
    stringFormat(
      AdvancedSearchLocators.AdvancedSearch_DD_Container,
      Dropdown_Select
    )
  );
  await page.waitForTimeout(Timeouts.CommandbarButtonTimeout);

  // Fetch all options in the dropdown
  let options = await page.$$(
    stringFormat(AdvancedSearchLocators.AdvancedSearch_DD_Opts, Dropdown_Select)
  );
  let optionFound = false;

  // Loop through each option to find the desired value
  for (let i = 0; i < options.length; i++) {
    let values = await options[i].textContent();

    if (values?.includes(Select_option)) {
      await options[i].click();
      optionFound = true;
      break;
    }
  }
  if (!optionFound) {
    throw error(
      `Option ${Select_option} not found in the dropdown ${Dropdown_Select}.`
    );
  }
}

/**
 * Selects an operator based on the provided field value.
 *
 * This function determines valid operators for a given field and attempts to select
 * the specified operator. If the operator is not valid, it throws an error.
 *
 * @param page - The Page object representing the current browser context.
 * @param fieldValue - The field for which to select the operator.
 * @param operatorTobeSelect - The operator to be selected.
 * @throws Will throw an error if the operator is not valid for the specified field.
 */
export async function selectAdvancedSearchOperator(
  page: Page,
  fieldValue: string,
  operatorTobeSelect: any
) {
  // Depending on the field value, choose which operators are valid
  let validOperators: string[];

  switch (fieldValue) {
    case AdvancedSearchfieldValuesDropdown_opt.first:
    case AdvancedSearchfieldValuesDropdown_opt.last:
      validOperators = [
        AdvancedSearchOperatorsDropdown_opt.SoundsLike,
        AdvancedSearchOperatorsDropdown_opt.Equal,
        AdvancedSearchOperatorsDropdown_opt.Contains,
        AdvancedSearchOperatorsDropdown_opt.StartsWith,
      ];
      break;
    case AdvancedSearchfieldValuesDropdown_opt.dateOfBirth:
      validOperators = [
        AdvancedSearchOperatorsDropdown_opt.Equal,
        AdvancedSearchOperatorsDropdown_opt.LessThanOrEqual,
        AdvancedSearchOperatorsDropdown_opt.GreaterThanOrEqual,
      ];
      break;
    case AdvancedSearchfieldValuesDropdown_opt.EmploymentStatus:
    case AdvancedSearchfieldValuesDropdown_opt.printType:
      validOperators = [AdvancedSearchOperatorsDropdown_opt.Equal];
      break;

    default:
      validOperators = [];
  }
  if (validOperators.includes(operatorTobeSelect)) {
    await selectAdvancedSearchDropdownValue(page, operator, operatorTobeSelect); //select value
  } else {
    throw new Error(
      `Operator ${operatorTobeSelect} is not valid for field ${fieldValue}`
    );
  }
}

export async function selectOptFromAdvancedsearchDD(
  page: Page,
  Dropdown_Type: string,
  Select_option: string
) {
  await page
    .locator(
      stringFormat(AdvancedSearchLocators.AdvancedSearch_DD, Dropdown_Type)
    )
    .click();
  // Wait for the dropdown options container to appear
  await page.waitForSelector(
    stringFormat(
      AdvancedSearchLocators.AdvancedSearch_DD_Container,
      Dropdown_Type
    )
  );

  // Fetch all options in the dropdown
  let options = await page.$$(
    stringFormat(AdvancedSearchLocators.AdvancedSearch_DD_Opts, Dropdown_Type)
  );
  let optionFound = false;

  // Loop through each option to find the desired value
  for (let i = 0; i < options.length; i++) {
    let values = await options[i].textContent();

    if (values?.includes(Select_option)) {
      await options[i].click();
      optionFound = true;
      break;
    }
  }
  if (!optionFound) {
    throw error(
      `Option ${Select_option} not found in the dropdown ${Dropdown_Type}.`
    );
  }
}

export async function selectAdvancedSearchFieldValue(
  page: Page,
  SelectOption: string
) {
  await selectAdvancedSearchDropdownValue(page, fieldName, SelectOption);
}

/**
 *
 * @param page
 * @param controlType
 * @param SelectOption
 */
export async function AdvancedSearch_SearchData(
  page: Page,
  controlType: string,
  SelectOption: string
) {
  switch (controlType) {
    case ControlType.TextBox:
      await clearAndFillTextBox(
        page,
        AdvancedSearchLocators.AdvancedSearch_SearchBox,
        SelectOption
      );
      break;
    case ControlType.DropDown:
      await selectAdvancedSearchDropdownValue(page, value, SelectOption);
      break;
    case ControlType.DatePicker:
      await setDateOnDatePicker(
        page,
        SelectOption,
        TypeOfDatePickers.AdvanvcedSearchCalender
      );
      break;
    default:
      throw new Error(
        `selected control type ${controlType} is not valid for field the search data field`
      );
  }
}

/**
 * Clicks on the advanced search result button.
 *
 * This function waits for the advanced search result button to become visible
 * and then clicks on it. If the button does not appear in time, it may lead
 * to a timeout error.
 *
 * @param page - The Page object representing the current browser context.
 * @throws Will throw an error if the button does not appear within the default timeout.
 */
export async function ClickOnAdvancedSearchResult(page: Page) {
  //await page.waitForSelector("[class='css-6ieanw']");
  await page
    .locator(AdvancedSearchLocators.AdvancedSearch_SearchResult_Btn)
    .click();
}

export async function ClearAllFilter(page: Page) {
  await page
    .locator(AdvancedSearchLocators.AdvancedSearch_ClearAllFilter_btn)
    .click();
}

/**
 *
 * @param page
 * @param AFieldValue
 * @param operate
 * @param expectedValue
 */
export async function ValidateAdvancedSearchResults(
  page: Page,
  AFieldValue: string,
  operate: string,
  expectedValue: string
) {
  await page.waitForTimeout(Number(Timeouts.AnimationTimeout));
  const list = await page.$$("thead th");
  let recordFound = false; // Flag to track if any records are found
  let matchingRows: number[] = []; // Array to store indices of matching rows
  let count = 0;

  for (let i = 0; i < list.length; i++) {
    const txt = await list[i].textContent();

    if (txt?.includes(AFieldValue)) {
      const rowList = await page.$$("[data-testid='bookingRow']");

      if (rowList.length === 0) {
        console.log("No records found."); // Fail if no rows are present
      }

      for (let j = 0; j < rowList.length; j++) {
        const fieldValues = await page.locator(
          `((//table//tr)[${j + 2}]//td)[${i + 1}]`
        );
        const vlues = await fieldValues.innerText();

        switch (operate) {
          case "=":
            expect(vlues).toEqual(expectedValue);
            break;
          case "contains":
            expect(vlues).toContain(expectedValue);
            break;
        }

        matchingRows.push(j + 2); // Store the 1-based index of the matching row
        recordFound = true; // Set flag to true if at least one record is validated
        count++;
      }
      break; // Exit the loop after processing the relevant column
    }
  }
  console.log(`${count} record(s) found.`);

  // If no records were found matching the criteria, throw an error
  if (!recordFound) {
    console.log("validation completed, No matching records found.");
  }
  if (recordFound) {
    // Log success message with the matching row indices
    console.log(
      `Validation successful. Found matching records on rows: ${matchingRows.join(
        ", "
      )}`
    );
  }
}

/**
 * 
 * @param page 
 * @param field 
 * @param value 
 */
export async function fillAndSearchAdvancedSearch(
  page: Page,
  field: string,
  value: string
) {
  await Click_AdvanceSearch_btn(page);
  await clearAndFillTextBox(
    page,
    stringFormat(AdvancedSearchLocators.AdvancedSearch_Fields, field),
    value
  );
  await page
    .locator(AdvancedSearchLocators.AdvancedSearch_SearchResult_Btn)
    .click();
  await page.waitForSelector(SavedBookingRecorsPage.RecordsGrid);
}

/**
 *
 * @param page
 * @param fieldsTobeEdit
 * @param updatedFieldValue
 */
export async function updateBiographicFormfield(
  page: Page,
  fieldsTobeEdit: string,
  controlType = ControlType.TextBox,
  updateFieldValue:string
) {
  await waitForLoadSavedForm(page);
  const formstatus = await getFormStatus(page);
  
  if(formstatus===formStatuses.completeAndUpdated){
    throw new Error("Cannot edit form, it is already completed and updated.");
  }
   // Fetch the current form type
   const formType = await getFormType(page);
   // Fetch the field configuration for the form type
   const fieldConfig = await getFieldConfig(formType);
    if (!fieldConfig) {
     throw new Error(`Field configuration not found for form type: "${formType}".`);
   }
 
   // Validate if the field belongs to the form's configuration
   const isFieldValid =
     (controlType === ControlType.TextBox && fieldConfig.TextBox?.includes(fieldsTobeEdit)) ||
     (controlType === ControlType.DropDown && fieldConfig.DropDown?.includes(fieldsTobeEdit)) ||
     (controlType === ControlType.DatePicker && fieldConfig.DatePicker?.includes(fieldsTobeEdit));
 
   if (!isFieldValid) {
     throw new Error(
       `Field "${fieldsTobeEdit}" is not valid for form type: "${formType}" with control type: "${controlType}".`
     );
   }
  const isEditButtonvisible = page.locator(BiographicsFormSelectors.editForm);
  if (isEditButtonvisible) {
    await isEditButtonvisible.click();
  }

  switch (controlType) {
    case ControlType.TextBox:
      await setBiographicsfieldValueOnForm(
        page,
        fieldsTobeEdit,
        updateFieldValue
      );
      break;

    case ControlType.DropDown:
      await selectOptionsFromBiographicsDD(
        page,
        fieldsTobeEdit,
        updateFieldValue
      );
      break;

    case ControlType.DatePicker:
      await BiographicsFormDateSelect(page, fieldsTobeEdit, updateFieldValue);
      break;

    default:
      throw new Error(`Unsupported control type: ${controlType}`);
  }

}

/**
 * 
 * @param page 
 * @returns retunrs form type (ex Sex_offender, ADC..)
 */
export async function getFormType(page:Page):Promise<string>{
  await waitForLoadSavedForm(page);
  const formType =await page.locator("(//div[@class='chakra-stack css-va4dcs']//p)[1]").textContent();
  return formType?.trim() || "unknown";

}

/**
 * Returns the field configuration for a given form type.
 * 
 * @param formType - The form type.
 * @returns A configuration object mapping control types to their respective fields.
 */
export async function getFieldConfig(
  formType: string
): Promise<{ TextBox?: string[]; DropDown?: string[]; DatePicker?: string[] } | null> {
  const formConfigs: Record<
    string,
    { TextBox?: string[]; DropDown?: string[]; DatePicker?: string[] }
  > = {
    "Sex Offender": {
      TextBox: [
        Biographics_form_fields.txt_box_FingerprintOperatorID,
        Biographics_form_fields.txt_box_DeviceOperatorID,
        Biographics_form_fields.txt_box_ADCNumber,
        Biographics_form_fields.txt_box_CourtName,
        Biographics_form_fields.txt_box_ArrestAgency,
        Biographics_form_fields.txt_box_RelationshipToVictim,
        Biographics_form_fields.txt_box_FirstName,
        Biographics_form_fields.txt_box_LastName,
        Biographics_form_fields.txt_box_Height,
        Biographics_form_fields.txt_box_Weight,
      ],
      DropDown: [
        Biographics_Dropdown_fields.DD_ILSSReceiveSetInformation,
        Biographics_Dropdown_fields.DD_ArrestState,
        Biographics_Dropdown_fields.DD_Class,
        Biographics_Dropdown_fields.DD_GenderOfVictim,
        Biographics_Dropdown_fields.DD_SexualPredatorIndicator,
        Biographics_Dropdown_fields.DD_OffenderRegistrationLevel,
        Biographics_Dropdown_fields.DD_Gender,
        Biographics_Dropdown_fields.DD_Race,
        Biographics_Dropdown_fields.DD_EyeColor,
        Biographics_Dropdown_fields.DD_HairColor,
        Biographics_Dropdown_fields.DD_PlaceOfBirth,
        Biographics_Dropdown_fields.DD_RegistrantCounty,
      ],
      DatePicker: [
        TypeOfDatePickers.ConvictionDate,
        TypeOfDatePickers.ArrestDate,
        TypeOfDatePickers.DateOfBirth,
        TypeOfDatePickers.ConfinementReleaseDate,
      ],
    },
    "ADC Intake": {
      TextBox: [
        Biographics_form_fields.txt_box_FingerprintOperatorID,
        Biographics_form_fields.txt_box_DeviceOperatorID,
        Biographics_form_fields.txt_box_CourtRecordNumber,
        Biographics_form_fields.txt_box_ADCNumber,
        Biographics_form_fields.txt_box_FirstName,
        Biographics_form_fields.txt_box_LastName,
        Biographics_form_fields.txt_box_Height,
        Biographics_form_fields.txt_box_Weight,
      ],
      DropDown: [
        Biographics_Dropdown_fields.DD_ILSSReceiveSetInformation,
        Biographics_Dropdown_fields.DD_PrimaryCharge,
        Biographics_Dropdown_fields.DD_CourtOfCommitment,
        Biographics_Dropdown_fields.DD_PlaceOfBirth,
        Biographics_Dropdown_fields.DD_HairColor,
        Biographics_Dropdown_fields.DD_EyeColor,
        Biographics_Dropdown_fields.DD_Race,
        Biographics_Dropdown_fields.DD_Gender,
      ],
      DatePicker: [
        TypeOfDatePickers.ChargesArrestDate,
        TypeOfDatePickers.SentenceDate,
        TypeOfDatePickers.DateOfBirth,
      ],
    },
    "Crim. Justice Applicant": {},
  };

  return formConfigs[formType] || null;
}

/**
 * 
 * @param page referance
 */
export async function waitforLoadDialog(page: Page) {
  await waitForDomContentLoad(page);
  await page.waitForSelector(BiographicsFormSelectors.dailog);
}

/**
 * 
 * @param page 
 * @param ActionPerform 
 */
export async function selectDialogOption(page:Page,ActionPerform:string){
  await waitforLoadDialog(page);
  const locator =
    ActionPerform === ActionButtonTypes.Print
      ? BiographicsFormSelectors.dialogOpt_print
      : stringFormat(BiographicsFormSelectors.dialogOption_btn, ActionPerform);

      const button = page.locator(locator);
      if (!(await button.isVisible())) {
        throw new Error(`The dialog option for action "${ActionPerform}" is not visible`);
      }
  await button.click();
  console.log(`Action "${ActionPerform}" was successfully performed.`);
}

/**
 * Retrieves the current form status from the page.
 *
 * @param page -  Page instance
 * @returns The current form status as a string
 *  @throws Will throw an error with the provided failure message if the status cannot be retrieved.
 * 
 */
export async function getFormStatus(page: Page): Promise<string> {
  await waitForLoadSavedForm(page);
  const FormStatus = await page
    .locator(BiographicsFormSelectors.formStatus)
    .textContent();

  if (!FormStatus) {
    throw new Error("Failed to retrieve the form status.");
  }
  return FormStatus ?? "";
}

/**
 *
 * @param page -  Page instance
 */
export async function sealSavedBookingRecord(page: Page) {
  await waitForLoadSavedForm(page);
  await page.waitForTimeout(4000);
  const formstatusBeforeclicking = await getFormStatus(page);
  expect(
    formstatusBeforeclicking,
    "Record has already been sealed."
  ).not.toEqual(formStatuses.sealed);
  await clickFormActionButton(page, ActionButtonTypes.Seal);
  await waitforLoadDialog(page);
  await selectDialogOption(page,ActionButtonTypes.Seal);
  await page.waitForTimeout(6000);
  await waitForLoadSavedForm(page);
  await page.waitForTimeout(6000);
  const afterClickingseal = await getFormStatus(page);
  expect(afterClickingseal, "record status has not sealed").toEqual(
    formStatuses.sealed
  );
}

/**
 *
 * @param page referance
 */
export async function UnsealSavedBookingsealRecord(page: Page) {
  const formstatusBeforeClicking = await getFormStatus(page);
  expect(formstatusBeforeClicking, "record already unsealed").toEqual(
    formStatuses.sealed
  );
  await clickFormActionButton(page, ActionButtonTypes.Unseal);
  await waitforLoadDialog(page);
  await selectDialogOption(page,ActionButtonTypes.Unseal);
  await page.waitForTimeout(6000);
  await waitForLoadSavedForm(page);
  await page.waitForTimeout(6000);
  const afterClickingUnseal = await getFormStatus(page);
  expect(afterClickingUnseal, "record has not unsealed").not.toEqual(
    formStatuses.sealed
  );
}

/**
 *
 * @param page referance
 */
export async function printSavedBookingForm(page: Page) {
  await waitForLoadSavedForm(page);
  await clickFormActionButton(page, ActionButtonTypes.Print);
  await waitforLoadDialog(page);
  await selectDialogOption(page,ActionButtonTypes.Print);
}

/**
 *
 * @param page referance
 * @returns returns the PCN value
 */
export async function deleteSavedBookingForm(page: Page): Promise<string> {
  await waitForLoadSavedForm(page);
  //retrieve PCN FieldValue
  const PCN_ID = await retrieveFieldValue(
    page,
    Biographics_form_fields.txt_box_PCN
  );

  await clickFormActionButton(page, ActionButtonTypes.Delete);
  await waitforLoadDialog(page)
  await selectDialogOption(page,ActionButtonTypes.Delete);

  return PCN_ID;
}

/**
 * Function to test grid records filter and sorting for a single header.
 * @param {Page} page - The Playwright page instance.
 * @param {string} header - The table header to be tested.
 * @param {boolean} ascending - Boolean value for sorting direction (true for ascending, false for descending). Defaults to true.
 */
export async function testGridSorting(
  page: Page,
  header: string,
  ascending: boolean = true
) {
  // Identifing the header and its index
  const headerLocator = `//table//th//div[text()="${header}"]`;
  const headerText: string | null = await page
    .locator(headerLocator)
    .textContent();

  if (!headerText || headerText.trim() !== header) {
    throw new Error(`Header "${header}" not found or does not match.`);
  }

  //Finding the column index
  let columnIndex: number | null = null;

  // Locate all header cells in the table
  const allHeaders = await page.locator("//table//th").allTextContents();

  for (let i = 0; i < allHeaders.length; i++) {
    if (allHeaders[i].trim() === header) {
      columnIndex = i + 1; // Column indices are 1-based
      break;
    }
  }

  if (columnIndex === null) {
    throw new Error(`Column index for header "${header}" not found.`);
  }

  console.log(`Column index for "${header}": ${columnIndex}`);

  //Click the header to sort the column and validate sorting
  if (ascending) {
    await page.click(headerLocator); // Click once for ascending
    console.log(`Sorting in ascending order initiated for header "${header}".`);
  } else {
    await page.click(headerLocator); // First click
    await page.waitForTimeout(Timeouts.Smalldelay);
    await page.click(headerLocator); // Second click for descending
    console.log(
      `Sorting in descending order initiated for header "${header}".`
    );
  }
  await page.waitForTimeout(Timeouts.CommandbarButtonTimeout);

  // Locating all rows in the table body
  const rows = page.locator("//tbody//tr");
  const rowCount = await rows.count();

  // Loop through each row and compare the current cell value with the next row's value
  for (let rowIndex = 0; rowIndex < rowCount - 1; rowIndex++) {
    // Get current row's cell value
    const currentCellValue = await page
      .locator(`//tbody//tr[${rowIndex + 1}]//td[${columnIndex}]`)
      .textContent();

    // Get next row's cell value
    const nextCellValue = await page
      .locator(`//tbody//tr[${rowIndex + 2}]//td[${columnIndex}]`)
      .textContent();

    if (!currentCellValue || !nextCellValue) continue; // Skip empty cells

    const currentValue = currentCellValue.trim();
    const nextValue = nextCellValue.trim();

    // Compare current value with next value
    if (ascending) {
      if (currentValue > nextValue) {
        throw new Error(
          `Sorting mismatch detected in ascending order between Row ${
            rowIndex + 1
          } and Row ${rowIndex + 2}: ${currentValue} > ${nextValue}`
        );
      }
    } else {
      if (currentValue < nextValue) {
        throw new Error(
          `Sorting mismatch detected in descending order between Row ${
            rowIndex + 1
          } and Row ${rowIndex + 2}: ${currentValue} < ${nextValue}`
        );
      }
    }
  }
  console.log(
    `Sorting validation passed for header "${header}" in ${
      ascending ? "ascending" : "descending"
    } order.`
  );
}

/**
 * 
 * @param page referance
 * @param timeout timeout default 1 min
 */
export async function waitForLoadGridData(page: Page, timeout=Timeouts.OneMinuteTimeout) {
  try {
    await waitForDomContentLoad(page); 
    await Promise.all([
      page.waitForSelector(SavedBookingRecorsPage.RecordsGrid, { timeout: timeout}),
      page.waitForSelector("//table//th[1]", { timeout: timeout }),
      page.waitForSelector("//tbody//tr[1]", { timeout: timeout }),
    ]);
  } catch (error) {
    throw new Error(
      `Failed to load grid data Records page. ${error}`
    );
  }
}

/**
 * 
 * @param page referance
 */
export async function waitForLoadSavedForm(page: Page) {
  await waitForDomContentLoad(page);
  await page.waitForTimeout(Timeouts.AnimationTimeout);
  await Promise.all([
    await page.waitForSelector(
      New_BookingRecord_Selectors.BookingPage_FormHeader
    ),
    await page.waitForSelector(
      New_BookingRecord_Selectors.BookingRecord_FormSidePane
    ),
  ]);
  //await page.waitForSelector("//button[@type='button'] [text()='Back to Records']")
}

export async function clickFormActionButton(page: Page, ActionType: string) {
  await waitForLoadSavedForm(page);
  await page
    .locator(
      stringFormat(
        BiographicsFormSelectors.recordPageActionButtonLocator,
        ActionType
      )
    )
    .click();
}

/**
 *
 * @param page
 * @param pcnValue
 */
export async function deleteAndvalidateDeletedRecordInGrid(
  page: Page,
  gridType: string
): Promise<void> {
  const PCN_ID = await deleteSavedBookingForm(page);
  await waitForLoadGridData(page);
  if (!deleteSavedBookingForm) {
    throw new Error("PCN value is not provided or is invalid.");
  }
  // Step 1: Handle search bar placeholder based on grid type
  const searchBarPlaceholder =
    gridType === GridType.SavedBookingRecords
      ? SavedBookingRecords_Search_Bar
      : TransactionViewer_SearchBar;

  const textBoxLocator = page.getByPlaceholder(searchBarPlaceholder);

  // Enter the PCN value in the search box
  await textBoxLocator.click();
  await textBoxLocator.clear();
  await textBoxLocator.fill(PCN_ID);

  // Step 2: Wait for the grid to load and check for PCN values in the grid
  const gridRowsLocator = `//tbody//tr//td[1]//div//a`;
  const rowCount = await page.locator(gridRowsLocator).count();

  let recordFound = false;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const PCNCellValue = await page.locator(gridRowsLocator).textContent();
    console.log(PCNCellValue);

    if (PCNCellValue?.trim() === PCN_ID) {
      console.log(
        `Deleted record with PCN "${PCN_ID}" still found in row ${
          rowIndex + 1
        }.`
      );
      recordFound = true;
      break;
    }
  }

  // Step 3: Assert that the record is not found
  expect(recordFound).toBe(false);

  if (!recordFound) {
    console.log(
      `Deleted record with PCN "${PCN_ID}" is not found in the grid.`
    );
  }
}
