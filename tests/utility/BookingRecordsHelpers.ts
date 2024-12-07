import { test, expect, Page } from "@playwright/test";
import {
  formStatuses,
  stringFormat,
  Timeouts,
} from "../constants/Commons/commons";
import {
  Biographics_form_fields,
  Biographics_SubjectName_fields,
  New_BookingRecord_Selectors,
  btns_Biographics_SubjectAppearance,
  Sex_Offender_Selectors,
  BiographicsFormSelectors,
  TypeOfDatePickers,
  datePicker_Selectors,
  monthNames,
  Biographics_Dropdown_fields,
  ActionButtonTypes,
  
} from "../constants/Selectors/NewBookingRecordsSelector";
import { clearAndFillTextBox } from "./helper";

import { Locator } from "puppeteer";
import { AdvancedSearchLocators } from "../constants/Selectors/RecordsPageSelectors";
import path from "path";
import { getFormStatus, waitForLoadSavedForm } from "./SavedBookingrecordsPageHelper";

export async function navigateToBookingTab(page: Page, tabName: string) {
  // Wait for the header of the Booking page to ensure the page has loaded
  await page.waitForSelector(New_BookingRecord_Selectors.BookingPage_FormHeader);
  await page.waitForSelector(New_BookingRecord_Selectors.TabList_CommandBar);
  await page.waitForTimeout(Timeouts.AnimationTimeout);
  // Check if the specified tab is visible
  const isTabVisible = await page
    .locator(
      stringFormat(New_BookingRecord_Selectors. Form_TabList, tabName)
    )
    .isVisible();
  // Throw an error if the tab is not visible
  if (!isTabVisible) {
    throw new Error(
      `Tab "${tabName}" is not visible after waiting for the Booking page to load.`
    );
  }
  // Click on the specified tab
  await page
    .locator(
      stringFormat(New_BookingRecord_Selectors. Form_TabList, tabName)
    )
    .click();
  await page.waitForSelector(New_BookingRecord_Selectors.TabList_CommandBar);

  console.log(`Successfully navigated to the "${tabName}" tab.`);
}

export async function createSexOffender_record(page: Page) {
  await page.waitForSelector(
    New_BookingRecord_Selectors. BookingPageRecordFormContainer
  );
  //await page.locator().fill
}

/**
 *
 * @param page Pagereference
 * @param DrowndownType DrownDown to be select
 * @param selectOption Drowndown option to be select
 * @returns
 */
export async function selectOptionsFromBiographicsDD(
  page: Page,
  DrowndownType: string,
  selectOption: string
) {
  //await waitForLoadSavedForm(page);
   const clearIndicatorLocator = page.locator(
    stringFormat(BiographicsFormSelectors.DropdownCloseIndicator, DrowndownType)
  );
  const isClearIndicatorVisible = await clearIndicatorLocator.isVisible();
  console.log(isClearIndicatorVisible)
  if(isClearIndicatorVisible){
    await clearIndicatorLocator.click();
  }
  try {
    // Click on the dropdown to open it
    await page
      .locator(
        stringFormat(Sex_Offender_Selectors.DD_Biographics, DrowndownType)
      )
      .click();

    // Wait for the dropdown options to load
    await page.waitForTimeout(Timeouts.AnimationTimeout);

    // Get the list of options in the dropdown
    const ddList = await page.$$(
      stringFormat(Sex_Offender_Selectors.DD_Biographics_List, DrowndownType)
    );
  
    // Find and click the desired option
    let optionFound = false; // Flag to track if the option is found
    for (const opt of ddList) {
      const txt = await opt.textContent();
      if (txt?.includes(selectOption)) {
        await opt.click(); // Click the matching option
        console.log(`Selected option from DD: ${DrowndownType} = ${txt}`);
        optionFound = true; // Set flag to true if the option is found
        break; // Exit the loop since the option is found
      }
    }

    if (!optionFound) {
      // If the option was not found, throw an error
      throw new Error(
        `Option "${selectOption}" not found in dropdown "${DrowndownType}".`
      );
    }
  } catch (error) {
    console.error(`Error selecting option from dropdown: ${error.message}`);
    throw error; // Re-throw the error to ensure it fails the test
  }
}

/**
 * Attempts to save the filled form and checks for mandatory field errors.
 *
 * @param page - The Page object representing the current browser context.
 * @throws
 */
export async function saveBiographicsForm(page: Page) {
  // Click the save button on the form
  await page
    .locator(
      stringFormat(Sex_Offender_Selectors.buttonLocator, ActionButtonTypes.Save)
    )
    .click();
  await page.waitForTimeout(Timeouts.AnimationTimeout);

  // Wait for the error icons to be visible (if any)
  const mandatoryErrorIcons = await page.$$(".css-70qvj9");

  // Check if any mandatory error icons are displayed
  if (mandatoryErrorIcons.length > 0) {
    console.error("Error icons are displayed. Mandatory fields are missing.");
    // Assert that the count of error icons should be 0
    expect(
      mandatoryErrorIcons.length,
      "Mandatory fields are missing. Fill the mandatory fields."
    ).toBeLessThanOrEqual(0);
  } else {
    console.log("Form saved successfully");
  }
  await page
    .locator(
      stringFormat(
        Sex_Offender_Selectors.buttonLocator,
        ActionButtonTypes.SaveAndSubmit
      )
    )
    .click();
  await page.waitForSelector(AdvancedSearchLocators.Advancedsearch_Dailog);
  await page
    .locator(
      stringFormat(
        Sex_Offender_Selectors.buttonLocator,
        ActionButtonTypes.SubmitAnyway
      )
    )
    .click();
  await page.waitForTimeout(Timeouts.DefaultLoopWaitTime);
  const formStatus = await getFormStatus(page);
  expect(formStatus).toEqual(formStatuses.complete);
}

/**
 * Sets the value of a specified biographic field on a form, validating the input as necessary.
 *
 * @param {Page} page - The Playwright page object representing the current page.
 * @param {any} fieldLogicName - The name of the biographic field to set (e.g., first name, height).
 * @param {string} fieldValue - The value to set for the specified field.
 *
 * @throws {Error} If the field value does not meet the validation criteria for the field.
 */
export async function setBiographicsfieldValueOnForm(
  page: Page,
  fieldLogicName: any,
  fieldValue: any
) {
  const biographicFields = [
    Biographics_form_fields.txt_box_FirstName,
    Biographics_form_fields.txt_box_LastName,
    Biographics_form_fields.txt_box_RelationshipToVictim,
    Biographics_form_fields.txt_box_ArrestAgency,
    Biographics_form_fields.txt_box_CourtName,
    Biographics_form_fields.txt_box_ADCNumber,
    Biographics_form_fields.txt_box_DeviceOperatorID,
    Biographics_form_fields.txt_box_FingerprintOperatorID,
    Biographics_form_fields.txt_box_Height,
    Biographics_form_fields.txt_box_Weight,
    Biographics_form_fields.txt_box_CourtRecordNumber,
    Biographics_form_fields.txt_box_Description,
    Biographics_form_fields.txt_box_Authority,
  ];

  if (biographicFields.includes(fieldLogicName)) {
    switch (fieldLogicName) {
      case Biographics_form_fields.txt_box_FirstName:
      case Biographics_form_fields.txt_box_LastName:
      case Biographics_form_fields.txt_box_RelationshipToVictim:
      case Biographics_form_fields.txt_box_ArrestAgency:
      case Biographics_form_fields.txt_box_CourtName:
      case Biographics_form_fields.txt_box_DeviceOperatorID:
      case Biographics_form_fields.txt_box_FingerprintOperatorID:
      case Biographics_form_fields.txt_box_Description:
      case Biographics_form_fields.txt_box_Authority:
        // Validate for alphabets only, min length 1, max length 26
        if (/^[A-Za-z]{2,26}$/.test(fieldValue)) {
          await clearAndFillTextBox(
            page,
            stringFormat(
              Sex_Offender_Selectors.txt_box_BiographicsFormField,
              fieldLogicName
            ),
            fieldValue
          );
        } else {
          throw new Error(
            `Invalid value for "${fieldLogicName}": must contain only letters and be 2-26 characters long. Received: "${fieldValue}`
          );
        }
        break;

      case Biographics_form_fields.txt_box_ADCNumber:
        // Validate for alphanumeric (letters or numbers), exactly 6 characters long
        if (/^[A-Za-z]{6}$/.test(fieldValue)) {
          await clearAndFillTextBox(
            page,
            stringFormat(
              Sex_Offender_Selectors.txt_box_BiographicsFormField,
              fieldLogicName
            ),
            fieldValue
          );
        } else {
          throw new Error(
            `Invalid ADC Number: must be alpha and exactly 6 characters long.`
          );
        }
        break;

      case Biographics_form_fields.txt_box_CourtRecordNumber:
        // Validate for numeric only
        if (/^\d+$/.test(fieldValue)) {
          await clearAndFillTextBox(
            page,
            stringFormat(
              Sex_Offender_Selectors.txt_box_BiographicsFormField,
              fieldLogicName
            ),
            fieldValue
          );
        } else {
          throw new Error(`Invalid Court Record Number: must be numeric only.`);
        }
        break;

      case Biographics_form_fields.txt_box_Height:
      case Biographics_form_fields.txt_box_Weight:
        // Validate for 3-digit numeric only

        if (/^\d{1,3}$/.test(fieldValue)) {
          // Check visibility of the height/weight field
          const isPlusButtonVisible = page
            .locator(btns_Biographics_SubjectAppearance.plusButton)
            .isVisible();
          if (await isPlusButtonVisible) {
            await page
              .locator(btns_Biographics_SubjectAppearance.plusButton)
              .click();
            await page.waitForTimeout(Timeouts.CommandbarButtonTimeout);
          } else {
            console.log("no plus button");
          }

          await clearAndFillTextBox(
            page,
            stringFormat(
              Sex_Offender_Selectors.txt_box_BiographicsFormField,
              fieldLogicName
            ),
            fieldValue
          );
        } else {
          throw new Error(
            `Invalid value for "${fieldLogicName}": must be a 3-digit number. Received: "${fieldValue}".`
          );
        }

        break;

      default:
        console.error(
          `Field "${fieldLogicName}" is not recognized. Please check the field name.`
        );
    }
  } else {
    console.error(
      `Field "${fieldLogicName}" is not recognized. Please check the field name.`
    );
  }
}

/**
 * Navigates to a specified date in a date picker and selects it.
 *
 * @param {Page} page - The page reference for interacting with the date picker.
 * @param {string} dateToBeSelect - The date to be selected in the format "yyyy-mm-dd".
 * @param {string} date_picker - The selector for the date picker input.
 *
 * @throws Will throw an error if the specified date cannot be selected.
 */
export async function setDateOnDatePicker(
  page: Page,
  dateToBeSelect: string,
  date_picker: string
) {
  const dateString = dateToBeSelect;

  const date = new Date(dateString);
  const Date1 = date.getUTCDate(); // Get the day in UTC
  const targetYear = date.getUTCFullYear(); // Get the year in UTC
  const targetMonth = date.toLocaleString("default", {
    month: "long",
    timeZone: "UTC",
  });

  const targetDay = Date1 + 1;
  const ToBeSelectDate = `${targetMonth} ${targetDay}, ${targetYear}`;

  // Clicking on the date picker to open it
  await page.click(stringFormat(datePicker_Selectors.date_picker, date_picker));

  // Get the current displayed month and year
  let displayedMonthYear = await page
    .locator(
      stringFormat(datePicker_Selectors.monthYearDisplayOnCalender, date_picker)
    )
    .innerText();

  let [currentMonth, currentYearString] = displayedMonthYear.split(" ");

  let currentYear = parseInt(currentYearString, 10); // Convert year to number

  // Function to change month and year
  const navigateToDate = async (month: string, year: number) => {
    while (currentMonth !== month || currentYear !== year) {
      if (
        currentYear < year ||
        (currentYear === year &&
          monthNames.indexOf(currentMonth) < monthNames.indexOf(month))
      ) {
        if (currentYear < year) {
          await page.click(
            stringFormat(datePicker_Selectors.nextYear_btn, date_picker)
          ); // Click next1 for year
        } else {
          await page.click(
            stringFormat(datePicker_Selectors.nextMonth_btn, date_picker)
          ); // Click next for month
        }
      } else {
        if (currentYear > year) {
          await page.click(
            stringFormat(datePicker_Selectors.previousYear_btn, date_picker)
          ); // Click prev1 for year
        } else {
          await page.click(
            stringFormat(datePicker_Selectors.previousMonth_btn, date_picker)
          ); // Click prev for month
        }
      }

      // Refreshing the displayed month/year
      displayedMonthYear = await page
        .locator(
          stringFormat(
            datePicker_Selectors.monthYearDisplayOnCalender,
            date_picker
          )
        )
        .innerText();
      [currentMonth, currentYearString] = displayedMonthYear.split(" ");
      currentYear = parseInt(currentYearString, 10); // Convert year to number again
    }
  };

  // Navigate to the target month and year
  await navigateToDate(targetMonth, targetYear);

  const calenderList = await page.$$(
    stringFormat(datePicker_Selectors.newcalenderDatesList, date_picker)
  );

  for (const element of calenderList) {
    // Get the aria-label attribute
    const ariaLabel = await element.getAttribute("aria-label");
    if (ariaLabel?.includes(ToBeSelectDate)) {
      await element.click();
    }
  }

  // Wait for the date picker to update
  await page.waitForTimeout(Timeouts.CommandbarButtonTimeout);

  // Verifying that the displayed date shows the selected date
  await page.waitForSelector(
    stringFormat(datePicker_Selectors.date_picker, date_picker)
  ); // Ensuring the element is present
  const selectedDateValue = await page
    .locator(stringFormat(datePicker_Selectors.date_picker, date_picker))
    .textContent();
 // console.log("Selected Date Value:", selectedDateValue); // Log the selected date value

  const dateValue = await page
    .locator(
      stringFormat(datePicker_Selectors.calendarSelectedDateField, date_picker)
    )
    .inputValue();
  // Split the date value into components
  const [year, month, day] = dateValue.split("-");

  // Assign to constants
 const selectedDate = day; // dd
 const selectedmonthNumeric = month; // mm
 const selectedYear = year; // yyyy

  // Converting numeric month to month name
  const selectedMonthIndex = parseInt(selectedmonthNumeric, 10) - 1; // Convert to zero-based index
  const selectedMonthName = new Date(0, selectedMonthIndex).toLocaleString(
    "default",
    { month: "long" }
  );

  // console.log("Selected Day:", selectedDate);
  // console.log("Selected Month:", selectedMonthName);
  // console.log("Selected Year:", selectedYear);

  // Verifying that the selected month, year, and day match
  expect(selectedMonthName).toBe(targetMonth);
  expect(selectedYear).toBe(targetYear.toString());
  expect(Number(selectedDate)).toBe(targetDay); // Validate the selected day

  const formattedSelectedDate = `${selectedMonthName} ${parseInt(
    selectedDate,
    10
  )}, ${selectedYear}`; // Convert selectedDate to number to remove leading zero
  console.log("Formatted Selected Date:", formattedSelectedDate);
}

/**
 * Selects a date in a specified date picker field with validation rules based on the type of date picker.
 *
 * @param page - The Playwright page object used to interact with the web page.
 * @param dateToBeSelect - The date to be selected, provided as a string (e.g., "YYYY-MM-DD").
 * @param date_picker - The type of date picker that specifies the rules for date selection.
 *
 * @throws {Error} - Throws an error if the selected date does not meet the validation criteria for the specific date picker.
 */
export async function BiographicsFormDateSelect(
  page: Page,
  date_picker: string,
  dateToBeSelect: string
) {
  const targetDate = new Date(dateToBeSelect); // Convert input date to a Date object
  console.log("BiographicsFormDateSelect" + targetDate);
  const today = new Date(); // Get today's date

  switch (date_picker) {
    case TypeOfDatePickers.DateOfBirth:
    case TypeOfDatePickers.crimJDOB:
      const minDOB = new Date(today.setFullYear(today.getFullYear() - 18)); // Calculate the minimum DOB for 18 years

      // Check if the target date is at least 18 years ago
      if (targetDate > minDOB) {
        throw new Error(
          "Date_Of_Birth : The entered date of birth must be at least 18 years ago."
        );
      }
      await setDateOnDatePicker(page, dateToBeSelect, date_picker);
      break;

    case TypeOfDatePickers.ConfinementReleaseDate:
      // Check if the target date is today or in the future
      if (targetDate < today) {
        throw new Error(
          "Confinement_Release_Date :-The entered date must be today or in the future."
        );
      }
      await setDateOnDatePicker(page, dateToBeSelect, date_picker);
      break;

    case TypeOfDatePickers.SentenceDate:
      // Check if the target date is today or in the past
      if (targetDate > today) {
        throw new Error(
          "Sentence_Date :-The entered sentence date must be today or in the past."
        );
      }
      await setDateOnDatePicker(page, dateToBeSelect, date_picker);
      break;

    case TypeOfDatePickers.ArrestDate:
    case TypeOfDatePickers.ConvictionDate:
    case TypeOfDatePickers.ChargesArrestDate:
    case TypeOfDatePickers.AdvanvcedSearchCalender:

      // These cases can take any date (past, present, future)
      await setDateOnDatePicker(page, dateToBeSelect, date_picker);
      break;

    default:
      throw new Error("Unsupported date picker type.");
  }
  console.log(`Setting date ${dateToBeSelect} for picker ${date_picker}`);
}
