export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export enum Biographics_SubjectName_fields {
  first = "First",
  last = "Last",
}

export enum Biographics_Dropdown_fields {
  DD_PlaceOfBirth = "PlaceOfBirth",
  DD_RegistrantCounty = "RegistrantCounty",
  DD_GenderOfVictim = "GenderOfVictim",
  DD_OffenderRegistrationLevel = "OffenderRegistrationLevel",
  DD_SexualPredatorIndicator = "SexualPredatorIndicator",
  DD_ArrestState = "Convictions[0].ArrestState",
  DD_ILSSReceiveSetInformation = "ILSSReceiveSetInformation",
  DD_Class = "Convictions[0].Class",
  DD_Gender = "Appearance[0].Sex",
  DD_Race = "Appearance[0].Race",
  DD_EyeColor="Appearance[0].EyeColor",
  DD_HairColor="Appearance[0].HairColor",
  DD_CourtOfCommitment = "CourtOfCommitment",
  DD_PrimaryCharge ="Charges[0].ChargeCode",
  DD_EmploymentStatus= "EmploymentStatus",
}

export enum ActionButtonTypes {
  Save = "Save",
  SaveAndSubmit = "Save and Submit",
  CreateNewItem = "Add New",
  SubmitAnyway = "Submit Anyway",
  KeepEditing = "Keep Editing",
  Delete = "Delete",
  Edit = "Edit",
  Print = "Print",
  Seal = "Seal",
  Complete = "COMPLETE",
  EditMode ="Edit Mode",
  Unseal = "Unseal",
  Delete_card = "delete card",
  Yes_delete = "Yes, delete",
}

export enum btns_Biographics_SubjectAppearance {
  apply = "Apply",
  clear = "Clear",
  apply_and_create_next = "Apply and create next",
  plusButton = "//div[@class='css-k008qs']/following::div[8]//div[2]//button//span",
}

export enum BiographicsFormSelectors {
  DropdownCloseIndicator = " //*[contains(@class, '{0}__clear-indicator')]",
  mandatoryErrorIcons = ".css-70qvj9",
  recordPageActionButtonLocator = "//button[@aria-label='{0}']",
  editMode = "//div[@class='css-1c0yiwq']//p",
  buttons = "[type='button']",
  viewMode = "[aria-label='Return to View mode']",
  editForm = "[aria-label='Edit']",
  dailog = "[role='dialog']",
  dialogOpt_print = "//button[@type='submit'] [text()='Print']",
  formStatus= "[class='chakra-stack css-7dpwap'] p",
  dialogOption_btn = "//button[@type='button'] [text()='{0}']"
}

export enum Biographics_form_fields {
  txt_box_LastName = "SubjectName.Last",
  txt_box_FirstName = "SubjectName.First",
  txt_box_ADCNumber = "ADCNumber",
  txt_box_DeviceOperatorID = "DeviceOperatorID",
  txt_box_FingerprintOperatorID = "FingerprintOperatorID",
  txt_box_Height = "Appearance[0].Height",
  txt_box_Weight = "Appearance[0].Weight",
  txt_box_CourtName = "Convictions[0].CourtName", //1-20 max lenght
  txt_box_RelationshipToVictim = "SexOffender_RelationshipToVictim", //1-25 max lenght
  txt_box_ArrestAgency = "Convictions[0].ArrestAgency", //1-20 max lenght
  txt_box_CourtRecordNumber = "CourtRecordNumber",
  txt_box_Description = "ReasonFingerprinted.Description",
  txt_box_Authority = "ReasonFingerprinted.Authority",
  txt_box_PCN = "PCN",
}

export enum TypeOfDatePickers{
  DateOfBirth = "DateOfBirthList[0].DateOfBirthList",
  ConfinementReleaseDate = "ConfinementReleaseDate",
  ArrestDate = "Convictions[0].ArrestDate",
  ConvictionDate = "Convictions[0].ConvictionDate",
  SentenceDate = "SentenceDate",
  ChargesArrestDate = "Charges[0].ArrestDate",
  AdvanvcedSearchCalender = "Filters[0].Value",
  crimJDOB= "DateOfBirth",
}

export enum TabLists {
  Biographics = "Biographics",
  face = "Face",
  fullBody = "FullBody",
  smt = "SMT",
  fingerPrint = "Fingerprint",
  iris = "Iris",
}

export enum New_BookingRecord_Selectors {
  Form_TabList = "[role='tablist'] [data-cy='{0}']",
  BookingPage_FormHeader = "[class='chakra-stack css-10iuca1']",
  TabList_CommandBar = "[role='tablist']",
  BookingPageRecordFormContainer = "[class='css-1gpv6zz']",
  BookingRecord_FormSidePane = "[class='css-pv5yi0']"
 }

export enum Sex_Offender_Selectors {
  txt_box_BiographicsFormField = "[id='{0}']", 
  DD_Biographics_List= "//div[contains(@class,'{0}__option ')]",
  DD_Biographics = "[class='{0}__value-container css-1hwfws3']",
  btn_SubjectAppearance = "//button[text()='{0}']",
  buttonLocator = "//button[text()='{0}']",
  recordPageButtonLocator1 = "//p[text()='{0}']",
}

  export enum datePicker_Selectors {
    date_picker = "[class='react-date-picker__wrapper'] [aria-label='{0}-label']",
    monthYearDisplayOnCalender = "//label[@id='{0}-label']/following-sibling::div//div//button//span",
    nextYear_btn = "//label[@id='{0}-label']/following::button[7]",
    nextMonth_btn = "//label[@id='{0}-label']/following::button[6]",
    previousYear_btn = "//label[@id='{0}-label']/following::button[3]",
    previousMonth_btn = "//label[@id='{0}-label']/following::button[4]",
    calendarDays = "[//label[@id='{0}-label']/following::div[contains(@class, 'react-calendar__month-view__days')]]",
    calenderSelectedDate = "[//label[@id='{0}-label']/following::div[4]//input[@name='day']]",
    calenderSelectedMonth = "[//label[@id='{0}-label']/following::div[4]//input[@name='month']]",
    calenderSelectedYear = "[//label[@id='{0}-label']/following::div[4]//input[@name='year']]",
    calendarSelectedDateField = "[id='{0}']",
    newcalenderDatesList = "//label[@id='{0}-label']/following::div[contains(@class, 'react-calendar__month-view__days')]//button/abbr",
  }

  export enum faceTabLocators{
    btn_takePhoto_Front= "(//button[@aria-label='Take photo'])[2]",
    btn_UploadPhoto = "[data-cy='uploadPhoto']",
    btn_CropManually= "//p[text()='Crop manually']",
    btn_SavePhoto ="[class='chakra-modal__footer css-16iepwv'] [data-cy='savePhoto']"
  }




  
