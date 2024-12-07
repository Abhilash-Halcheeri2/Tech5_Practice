export const loginWithMSopt = "loginOIDC";
export const MS_Email = "email";
export const MS_Password = "password";

export enum LoginSelectors {
    MS_Login_textBox = "[type={0}]"
}

export enum HomePageLocators{
    LoginWithAppCredantials_btn = "[type='button']",
    MainFrame = "[id='root']",
    UserName_txt = "[name='username']",
    Password_txt = "[name='password']",
    login_btn = "[type='submit']",
    WelCome_Screen = "[class='chakra-heading css-o4imka']",
   
}

export enum itemsPage{
    SubAreaContainer = "[class='chakra-stack css-bsrrtc']",
    subArea = "[data-cy='{0}']",
}

export enum OfficerUserLocators{
    errorMessage_txt = "[class='css-nvfoq'] p",
}

