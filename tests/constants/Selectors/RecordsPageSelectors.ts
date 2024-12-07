export const SavedBookingRecords_Search_Bar =
  "e.g. PCN #, ADC #, First, or Last Name";
  
export const fieldName = "FieldName";
export const operator = "Operator";
export const value = "Value";

export const withoutSearch_Message =
  "No data to displayTry a basic or advanced search with 3 or more characters";

export enum AdvancedSearch_Form_Fields {
  transactionId = "transactionId",
  bookingNumber = "bookingNumber",
  type = "type",
  destination = "destination",
}

export enum AdvancedSearchfieldValuesDropdown_opt {
  Adc="ADC#",
  first = "First",
  last = "Last",
  dateOfBirth = "Date of Birth",
  EmploymentStatus = "Employment Status",
  printType = "Print Type",
}

export enum AdvancedSearchOperatorsDropdown_opt {
  StartsWith = "starts with",
  Equal = "=",
  SoundsLike = "sounds like",
  GreaterThanOrEqual = ">=",
  LessThanOrEqual = "<=",
  GreaterThan = ">",
  LessThan = "<",
  Contains = "contains",
}

export enum AdvancedSearch_EmployementStatusType {
  APPLICANT = "APPLICANT",
  RETIRED = "RETIRED",
  EMPLOYEE = "EMPLOYEE",
  CONTRACTOR = "CONTRACTOR",
  VOLUNTEER = "VOLUNTEER",
  PROGRAM_ASSOCIATE = "PROGRAM ASSOCIATE",
}

export enum ApplicantCategory {
  ADC_INTAKE = "ADC INTAKE",
  CRIMINAL_JUSTICE_APPLICANT = "CRIM. JUSTICE APPLICANT",
  SEX_OFFENDER = "SEX OFFENDER",
}

export enum SavedBookingRecorsPage {
  ResultContainer = "[class='chakra-text css-1hrump0']",
  Search_ResultContainer = "[class='chakra-text css-1hrump0'] br",
  RecordsGrid = "[class='css-16c93gi']",
  Searched_records = "[data-testid='bookingRow']",
  xyz = "[data-testid='bookingRow'] td [data-testid='bookingNum']",
  RecordSearchBar = "[class='chakra-input css-f97toq']",
  AdvancedSearch_btn = "//button[text()='Advanced Search']",
}

export enum AdvancedSearchLocators {
  AdvancedSearch_DD_Opts = "[class='Filters[0].{0}__menu-list css-11unzgr'] div", //list
  AdvancedSearch_DD = "[class^='Filters[0].'][class*='{0}__value-container']",
  AdvancedSearch_DD_Container = "[class='Filters[0].{0}__menu-list css-11unzgr']",
  AdvancedSearch_SearchBox = "[id='Filters[0].Value']",
  AdvancedSearch_SearchResult_Btn = "//button[text()='Search Results']",
  AdvancedSearch_ClearAllFilter_btn = "[class='chakra-button css-s6su7r']",
  Advancedsearch_Dailog = "[role='dialog']",
  AdvancedSearch_Fields = "[name='{0}']",
}
