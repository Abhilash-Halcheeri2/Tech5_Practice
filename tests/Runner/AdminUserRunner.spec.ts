import { test} from "@playwright/test";
import path from "path";
import {
  ControlType,
  generateRandomString,
  GridType,
  SubAreaNames,
  Timeouts,
} from "../constants/Commons/commons";
import {
  clearCache,
  loginToAccount,
   NavigateToSubArea,
} from "../utility/helper";
import { Orgisationdetails } from "../testSettings.json";
import {
  AdvancedSearch_SearchData,
  Click_AdvanceSearch_btn,
  ClickOnAdvancedSearchResult,
  deleteAndvalidateDeletedRecordInGrid,
  printSavedBookingForm,
  sealSavedBookingRecord,
  SearchRecordsAndValidateInGrid,
  searchSavedBookingRecords,
  selectAdvancedSearchFieldValue,
  selectAdvancedSearchOperator,
  testGridSorting,
  UnsealSavedBookingsealRecord,
  updateBiographicFormfield,
  ValidateAdvancedSearchResults,
  ValidatesavedBookingRecordsGridPageWithoutSearch,
  waitForLoadGridData,
} from "../utility/SavedBookingrecordsPageHelper";
import {
  AdvancedSearchfieldValuesDropdown_opt,
  AdvancedSearchOperatorsDropdown_opt,
  ApplicantCategory,
  SavedBookingRecorsPage,
} from "../constants/Selectors/RecordsPageSelectors";
import {
  BiographicsFormDateSelect,
  navigateToBookingTab,
  saveBiographicsForm,
  selectOptionsFromBiographicsDD,
  setBiographicsfieldValueOnForm,
} from "../utility/BookingRecordsHelpers";
import {
  Biographics_Dropdown_fields,
  Biographics_form_fields,
  faceTabLocators,
  TabLists,
  TypeOfDatePickers,
} from "../constants/Selectors/NewBookingRecordsSelector";
import {
  TransactionViewerAdvancedSearchFields,
  TransactionViewerTableHeader,
} from "../constants/Selectors/TransactionViewerSelectors";
import {
  openGridRecordsWithoutSearch,
  transactionViewerAdvancedSearch_Search,
  validateTransactionViewerAdvancedsearchRecord,
} from "../utility/TransactionViewerPageHelper";
import {
  DD_ArrestState_List,
  DD_Class_opt_List,
  DD_CourtofCommitment_List,
  DD_EyeColor_List,
  DD_GenderOfVictim_List,
  DD_HairColor_List,
  DD_ILSSReceiveSetInformation_List,
  DD_OffenderRegistrationLevel_List,
  DD_PlaceOfBirth_Opt_List,
  DD_PrimaryCharge_List,
  DD_Race_List,
  DD_RegistrantCounty_Opt_List,
  DD_SexualPredatorIndicator_List,
} from "../constants/Commons/NewBookingRecordsCommons";
import { uploadCard } from "../utility/Cards";
import { SearchAuditHistory } from "../utility/AuditPage";
import { AuditSearchEventTypes, AuthEventAction } from "../constants/Selectors/AuditPageSelectors";

test.describe.configure({ mode: "parallel" });
test.describe("Admin User TestCase Runner", () => {
  test.describe.configure({ timeout: 60000 });

  test.beforeEach(async ({ context, page }) => {
    await page.goto(Orgisationdetails.OrgUrl);
    await clearCache(context);
    await loginToAccount(
      page,
      Orgisationdetails.SuperAdmin_UserName,
      Orgisationdetails.SuperAdmin_UserPassword
    );
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("TC007:Login test with valid credantials", async () => {
    console.log("passed");
  });

  test("TC008:validate saved booking records without search", async ({
    page,
  }) => {
    await NavigateToSubArea(page, SubAreaNames.savedBookingRecords);
    await ValidatesavedBookingRecordsGridPageWithoutSearch(page);
    // console.log(generateRandomString(5));
  });

  test("TC009:Search and validate the saved booking record", async ({
    page,
  }) => {
    await NavigateToSubArea(page, SubAreaNames.savedBookingRecords);
    await SearchRecordsAndValidateInGrid(
      page,
      SavedBookingRecorsPage.RecordSearchBar,
      "adc"
    );
  });

  test("TC010:search and validate the advanced search result,DateOfBirth", async ({
    page,
  }) => {
    await NavigateToSubArea(page, SubAreaNames.savedBookingRecords);
    await Click_AdvanceSearch_btn(page);
    await selectAdvancedSearchFieldValue(
      page,
      AdvancedSearchfieldValuesDropdown_opt.dateOfBirth
    );
    await selectAdvancedSearchOperator(
      page,
      AdvancedSearchfieldValuesDropdown_opt.dateOfBirth,
      AdvancedSearchOperatorsDropdown_opt.Equal
    );
    await AdvancedSearch_SearchData(page, ControlType.DatePicker, "2000/02/10");
    await ClickOnAdvancedSearchResult(page);
    await ValidateAdvancedSearchResults(
      page,
      AdvancedSearchfieldValuesDropdown_opt.dateOfBirth,
      AdvancedSearchOperatorsDropdown_opt.Equal,
      "2023/02/10"
    );
  });

  test("TC011:savedBookingRecords: search and validate the advanced search result", async ({
    page,
  }) => {
    await NavigateToSubArea(page, SubAreaNames.savedBookingRecords);
    await Click_AdvanceSearch_btn(page);
    await selectAdvancedSearchFieldValue(
      page,
      AdvancedSearchfieldValuesDropdown_opt.first
    );
    await selectAdvancedSearchOperator(
      page,
      AdvancedSearchfieldValuesDropdown_opt.first,
      AdvancedSearchOperatorsDropdown_opt.Equal
    );
    await AdvancedSearch_SearchData(page, ControlType.TextBox, "ADC");
    await ClickOnAdvancedSearchResult(page);
    await ValidateAdvancedSearchResults(
      page,
      AdvancedSearchfieldValuesDropdown_opt.first,
      AdvancedSearchOperatorsDropdown_opt.Equal,
      "ADC"
    );
  });

  test("TC012:Create sex_offender record", async ({ page }) => {
    test.setTimeout(120000);
    await NavigateToSubArea(page, SubAreaNames.Sex_Offender);
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_FirstName,
      generateRandomString(5)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_LastName,
      generateRandomString(5)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_Height,
      "506"
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_Weight,
      "206"
    );

    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_Gender,
      DD_GenderOfVictim_List.female
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_Race,
      DD_Race_List.asian
    );

    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_EyeColor,
      DD_EyeColor_List.blue
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_HairColor,
      DD_HairColor_List.black
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_PlaceOfBirth,
      DD_PlaceOfBirth_Opt_List.afghanistan
    );
    await BiographicsFormDateSelect(
      page,
      TypeOfDatePickers.DateOfBirth,
      "2000/11/15"
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_RegistrantCounty,
      DD_RegistrantCounty_Opt_List.apache
    );
    await BiographicsFormDateSelect(
      page,
      TypeOfDatePickers.ConfinementReleaseDate,
      "2025/10/11"
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_OffenderRegistrationLevel,
      DD_OffenderRegistrationLevel_List.level1
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_SexualPredatorIndicator,
      DD_SexualPredatorIndicator_List.yes
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_RelationshipToVictim,
      generateRandomString(6)
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_GenderOfVictim,
      DD_GenderOfVictim_List.female
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_Class,
      DD_Class_opt_List.felony
    );
    await BiographicsFormDateSelect(
      page,
      TypeOfDatePickers.ArrestDate,
      "2020/05/15"
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_ArrestAgency,
      generateRandomString(6)
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_ArrestState,
      DD_ArrestState_List.alabama
    );
    await BiographicsFormDateSelect(
      page,
      TypeOfDatePickers.ConvictionDate,
      "2020/08/12"
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_CourtName,
      generateRandomString(5)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_ADCNumber,
      generateRandomString(6)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_DeviceOperatorID,
      generateRandomString(6)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_FingerprintOperatorID,
      generateRandomString(6)
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_ILSSReceiveSetInformation,
      DD_ILSSReceiveSetInformation_List.DISPO_FORM
    );
    await saveBiographicsForm(page);
  });

  test("TC0015:transaction Viewer AdvancedSearch Search", async ({ page }) => {
    await NavigateToSubArea(page, SubAreaNames.transactionViewer);
    await Click_AdvanceSearch_btn(page);
    await transactionViewerAdvancedSearch_Search(
      page,
      ControlType.TextBox,
      TransactionViewerAdvancedSearchFields.BookingNumber,
      "00890"
    );
    await ClickOnAdvancedSearchResult(page);
    await validateTransactionViewerAdvancedsearchRecord(
      page,
      TransactionViewerTableHeader.pCN,
      "00890"
    );
  });

  test("Test0016: Create ADC intake Record", async ({ page }) => {
    test.setTimeout(90000);
    await NavigateToSubArea(page, SubAreaNames.ADC_Intake);
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_FirstName,
      generateRandomString(5)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_LastName,
      generateRandomString(5)
    );

    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_Height,
      "506"
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_Weight,
      "206"
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_Gender,
      DD_GenderOfVictim_List.female
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_Race,
      DD_Race_List.asian
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_EyeColor,
      DD_EyeColor_List.blue
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_HairColor,
      DD_HairColor_List.black
    );

    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_PlaceOfBirth,
      DD_PlaceOfBirth_Opt_List.afghanistan
    );
    await BiographicsFormDateSelect(
      page,
      TypeOfDatePickers.DateOfBirth,
      "2000/11/15"
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_ADCNumber,
      generateRandomString(6)
    );
    await BiographicsFormDateSelect(
      page,
      TypeOfDatePickers.SentenceDate,
      "2000/10/10"
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_CourtOfCommitment,
      DD_CourtofCommitment_List.APACHE_COUNTY
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_CourtRecordNumber,
      "123456"
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_PrimaryCharge,
      DD_PrimaryCharge_List.RESTRICTED_DESIGNATION_VIOL
    );
    await BiographicsFormDateSelect(
      page,
      TypeOfDatePickers.ChargesArrestDate,
      "2020/05/15"
    );

    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_DeviceOperatorID,
      generateRandomString(6)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_FingerprintOperatorID,
      generateRandomString(6)
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_ILSSReceiveSetInformation,
      DD_ILSSReceiveSetInformation_List.DISPO_FORM
    );
    await saveBiographicsForm(page);
  });

  test("Test0017: Create Crim_JusticeApplicant Record", async ({ page }) => {
    test.setTimeout(90000);
    await NavigateToSubArea(page, SubAreaNames.Crim_JusticeApplicant);
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_FirstName,
      generateRandomString(5)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_LastName,
      generateRandomString(5)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_Height,
      "506"
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_Weight,
      "206"
    );

    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_Gender,
      DD_GenderOfVictim_List.female
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_Race,
      DD_Race_List.asian
    );

    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_EyeColor,
      DD_EyeColor_List.blue
    );
    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_HairColor,
      DD_HairColor_List.black
    );
    await BiographicsFormDateSelect(
      page,
      TypeOfDatePickers.crimJDOB,
      "2000/11/15"
    );

    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_Description,
      generateRandomString(6)
    );

    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_Authority,
      generateRandomString(6)
    );

    // await selectOptionsFromBiographicsDD(

    //   page,
    //   Biographics_Dropdown_fields.DD_EmploymentStatus,
    //   DD_EmploymentStatusz_List.RETIRED
    // );

    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_DeviceOperatorID,
      generateRandomString(6)
    );
    await setBiographicsfieldValueOnForm(
      page,
      Biographics_form_fields.txt_box_FingerprintOperatorID,
      generateRandomString(6)
    );

    await selectOptionsFromBiographicsDD(
      page,
      Biographics_Dropdown_fields.DD_ILSSReceiveSetInformation,
      DD_ILSSReceiveSetInformation_List.DISPO_FORM
    );
    await saveBiographicsForm(page);
  });

  test("TC001: ", async ({ page }) => {
    await NavigateToSubArea(page, SubAreaNames.transactionViewer);
    await openGridRecordsWithoutSearch(page,GridType.TransactionViewer, 2, 1);
  });

  test("TC_111:sorting @UI", async ({ page }) => {
   
    await NavigateToSubArea(page, SubAreaNames.savedBookingRecords);
    await searchSavedBookingRecords(
      page,
      SavedBookingRecorsPage.RecordSearchBar,
      "ADC"
    );
    await waitForLoadGridData(page);
    await testGridSorting(page, "First", false);
  });

  test("tc_0010:Delete record", async ({ page }) => {
    await NavigateToSubArea(page, SubAreaNames.transactionViewer);
    //await searchSavedBookingRecords(page,SavedBookingRecorsPage.RecordSearchBar,"ADC");
    await openGridRecordsWithoutSearch(page,GridType.TransactionViewer, 2, 3);
    await deleteAndvalidateDeletedRecordInGrid(page,GridType.TransactionViewer);
  });

  test("tc_00110:Delete record from saved booking records", async ({
    page,
  }) => {
    await NavigateToSubArea(page, SubAreaNames.savedBookingRecords);
    await searchSavedBookingRecords(
      page,
      SavedBookingRecorsPage.RecordSearchBar,
      "ADC"
    );
    await openGridRecordsWithoutSearch(page,GridType.SavedBookingRecords,2,4)
    await deleteAndvalidateDeletedRecordInGrid(page,GridType.SavedBookingRecords);
  });

  test("print", async ({ page }) => {
    await NavigateToSubArea(page, SubAreaNames.savedBookingRecords);
    await searchSavedBookingRecords(page,SavedBookingRecorsPage.RecordSearchBar,"ADC")
    await openGridRecordsWithoutSearch(page,GridType.SavedBookingRecords, 2, 3);
    await printSavedBookingForm(page);
  });
  test("Seal and unseal", async ({ page }) => {
    await NavigateToSubArea(page, SubAreaNames.savedBookingRecords);
    await searchSavedBookingRecords(page,SavedBookingRecorsPage.RecordSearchBar,"ADC")
    await openGridRecordsWithoutSearch(page,GridType.SavedBookingRecords, 2, 3);
    await sealSavedBookingRecord(page);
    await UnsealSavedBookingsealRecord(page);
  });

  test("edit biographic form field", async({page})=>{
    await NavigateToSubArea(page,SubAreaNames.savedBookingRecords);
    await searchSavedBookingRecords(page,SavedBookingRecorsPage.RecordSearchBar,"ADC")
    await openGridRecordsWithoutSearch(page,GridType.SavedBookingRecords, 2, 6);
    await updateBiographicFormfield(page,Biographics_Dropdown_fields.DD_ArrestState,ControlType.DropDown,DD_ArrestState_List.alaska)
    await saveBiographicsForm(page);


  })

 

    test("upload cards", async ({ page }) => {
      const card = "./tests/Attachments/aPassport1.jpg";
      await NavigateToSubArea(page, SubAreaNames.cards);
      await uploadCard(page,"Test",ApplicantCategory.ADC_INTAKE,card);
      
      // await page.pause();
      // await NavigateToSubArea(page, SubAreaNames.cards);
      // await page.waitForSelector(CardsLocators.uploadCards);
      // await page.locator(CardsLocators.uploadCards).click();
      // await waitforLoadDialog(page);
      // await page.locator("[id='displayName']").fill("Test");
      // const [filechooser] = await Promise.all([
      //     await page.waitForEvent("filechooser"),
      //     page.locator(CardsLocators.uploadCards).click(),
      //   ]);
      //   filechooser.setFiles(card);
       
      })
   

    test("upload face", async ({ page }) => {
      const Photo_front="./tests/Attachments/Image2.webp";
      await NavigateToSubArea(page, SubAreaNames.ADC_Intake);
      await navigateToBookingTab(page, TabLists.face);
      await page.locator(faceTabLocators.btn_takePhoto_Front).click();

      // Handle file chooser event
      const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        page.locator(faceTabLocators.btn_UploadPhoto).click(),
      ]);

      // Set the file to be uploaded
      fileChooser.setFiles(path.resolve(Photo_front));
      await page.waitForTimeout(6000);
      await page.locator(faceTabLocators.btn_CropManually).click();
      await page.waitForTimeout(Timeouts.CommandbarButtonTimeout);
      await page.locator(faceTabLocators.btn_SavePhoto).click();
      
    });

    test.only("Search audit History",async({page})=>{
      await NavigateToSubArea(page,SubAreaNames.audit);
      await SearchAuditHistory(page,AuditSearchEventTypes.auth,AuthEventAction.login);
     
    })

  })