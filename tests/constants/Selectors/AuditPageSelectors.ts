export enum AuditgridSelectors{
    auditSearchBox = "input[placeholder='Search']",

}

export enum AuditSearchSelectors{
    eventType_DD = "//div[@class=' css-1hwfws3']//div[text()='Event Type']",
    eventType_List = "[class=' css-11unzgr'] div",
    eventAction = "[class='select__value-container select__value-container--is-multi css-1hwfws3']",
    eventAction_List = "[class='select__menu-list select__menu-list--is-multi css-11unzgr'] div"
}

export enum AuditSearchEventTypes {
    audit = "Audit",
    auth = "Auth",
    booking = "Booking",
    cards = "Cards",
    group = "Group",
    identify = "Identify",
    setting = "Setting",
    user = "User"
  }

  export enum auditEventAction{
    view = "View",
    search = "Search",
    print ="Print",
    export= "Export",
  }

  export enum AuthEventAction {
    login = "Login",
    loginFail = "Login fail",
    logout = "Logout"
  }

  export enum CardEventAction {
    create = "Create",
    search = "Search",
    update = "Update",
    delete = "Delete",
    group = "Group"
  }

  export enum GroupEventAction {
    create = "Create",
    update = "Update",
    duplicate = "Duplicate",
    archive = "Archive",
    unarchive = "Unarchive"
  }

  export enum IdentifyEventAction {
    enroll = "Enroll",
    search = "Search"
  }

  export enum SettingEventAction {
    edit =  "Edit"
   
  }

  export enum UserEventAction {
    create = "Create",
    edit = "Edit",
    search = "Search",
    unarchive = "Unarchive",
    passwordChange = "Password Change",
    groupAssignment = "Group Assignment",
    locked = "Locked",
    unlocked = "Unlocked"
  }
  
  
 
  
  
  
