export enum Timeouts {
  Smalldelay = 1000,
  DefaultLoopWaitTime = 5000, // 5 seconds
  CommandbarButtonTimeout = 2000, // 2 seconds
  LoadTimeout = 20000, // 20 seconds
  OneMinuteTimeout = 60000, // 1 minute
  PageLoadTimeout = 30000, // 30 seconds
  ElementVisibilityTimeout = 15000, // 15 seconds for element visibility checks
  ApiCallTimeout = 25000, // 25 seconds for API call responses
  ConnectionTimeout = 10000, // 10 seconds for connection-related waits
  AnimationTimeout = 3000, // 3 seconds for animations to complete
}
export enum HomePage {
  UserMenu = "userMenu",
}

export const stringFormat = (str: string, ...args: any[]) =>
  str.replace(/{(\d+)}/g, (match, index) => args[index].toString() || "");

//SubArea Names
export enum SubAreaNames {
  ADC_Intake = "ADCIntake",
  newRecord = "NewRecord",
  records = "Records",
  audit = "Audit",
  cards = "Cards",
  Crim_JusticeApplicant = "Crim.JusticeApplicant",
  settings = "Settings",
  savedBookingRecords = "SavedBookingRecords",
  transactionViewer = "TransactionViewer",
  New_Booking_Record = "NewBookingRecord",
  Sex_Offender = "SexOffender",
}

export enum ControlType {
  TextBox = "TextBox",
  RadioButton = "RadioButton",
  CheckBox = "CheckBox",
  DropDown = "DropDown",
  DatePicker = "DatePicker",
  FileUpload = "FileUpload",
  Button = "Button",
  Switch = "Switch",
}

export enum Attributes {
  AriaExpanded = "aria-expanded",
  DataToggle = "data-toggle",
  Role = "role",
  TabIndex = "tabindex",
  Class = "class",
  Id = "id",
  Name = "name",
  Placeholder = "placeholder",
  Value = "value",
  Required = "required",
  Disabled = "disabled",
}

export enum GridType{
  SavedBookingRecords="SavedBookingRecords",
  TransactionViewer="TransactionViewer"
}

/**
 * Generates a random alphabetic string of the specified length.
 *
 * @param length - The length of the random string to generate. Must be a positive integer.
 * @returns A random alphabetic string of the specified length.
 */
export function generateRandomString(length: number): string {
  if (length <= 0) {
    throw new Error("Length must be a positive integer.");
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

/**
 * Generates a random number with the specified number of digits.
 * 
 * @param length The number of digits the random number should have.
 * @returns A random number with the specified length.
 */
export function getRandomNumberByLength(length: number): number {
  if (length <= 0) {
    throw new Error("Length must be greater than 0.");
  }

  const min = Math.pow(10, length - 1); // The minimum value for the specified length
  const max = Math.pow(10, length) - 1; // The maximum value for the specified length

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export enum BooleanStates {
  TRUE = "true",
  FALSE = "false",
}

export enum formStatuses {
  complete = "COMPLETE",
  completeAndUpdated = "COMPLETE:UPDATED",
  workInProgress = "WORK IN PROGRESS",
  sealed = "Sealed",
}
/**
 * Load state conditions
 */
export const enum LoadState {
  domcontentloaded = "domcontentloaded",
  Load = "load",
  NetworkIdle = "networkidle"

}