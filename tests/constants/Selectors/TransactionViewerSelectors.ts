export const TransactionViewer_SearchBar= "eg. Booking Number";

export enum TransactionViewerTableHeader {
    trID = "Trans. Id",
    pCN = "PCN",
    subjectName = "Subject Name",
    adcNumber = "ADC#",
    printType = "Print Type",
    lastAction = "Last Action",
    workflowType = "Workflow Type",
    destination = "Destination",
    updatedBy = "Updated By",
    updatedDate = "Updated Date",
    actions = "Actions"
 }

 export enum TransactionViewerAdvancedSearchFields {
    TransactionId = 'transactionId',
    BookingNumber = 'bookingNumber',
    Type = 'type',
    Destination = 'destination',
  }

 export enum transactionViewerAdvancedSearch_Selectors{
    ransactionViewerAdvancedSearch_searchTextBox="[class='chakra-stack css-1xbaot1'] [name='{0}']",
    actionDropDown = "[class=' css-1hwfws3']",
    actionDropdownList = "[class=' css-11unzgr'] div",
 }

 export enum TransactionViewerActionDropdownValues {
    CreateTransaction = 'Create Transaction',
    SubmitTransaction = 'Submit Transaction',
    SubmitTransactionError = 'Submit Transaction Error',
    ResubmittedTransaction = 'Re-submitted Transaction',
    ResubmittedTransactionError = 'Re-submitted Transaction Error',
    ReceivedTransaction = 'Received Transaction',
    ReceivedTransactionError = 'Received Transaction Error',
    ProcessedTransaction = 'Processed Transaction',
    ProcessedTransactionError = 'Processed Transaction Error',
  }
 