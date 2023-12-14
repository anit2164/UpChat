export class NetworkInfo {
  static PROTOCOL = "http://";
  static UTSDOMAIN = "3.218.6.134:9082";
  static UPCHATDOMAIN = "3.218.6.134:9096";
  static VIEWHRDOMIN = "3.218.6.134:9093";
  static NETWORK = NetworkInfo.PROTOCOL + NetworkInfo.UTSDOMAIN;
  static UPCHATNETWORK = NetworkInfo.PROTOCOL + NetworkInfo.UPCHATDOMAIN;
  static VIEWHRNETWORK = NetworkInfo.PROTOCOL + NetworkInfo.VIEWHRDOMIN;
}

export class SubDomain {
  static USEROPERTIONAPI = "/UserOperationsAPI";
  static MEMBEROPERTIONAPI = "/User";
  static VIEWALLHR = "/ViewAllHR";
}

export class MethodType {
  static GET = "/get";
  static POST = "/post";
  static PUT = "/update";
  static DELETE = "/delete";
}

export class UserAPI {
  static LOGIN = "/AdminLogin";
  static LOGOUT = "/LogOut";
  static SENDMESSAGE = "/UpChatSaveHRNotes";
}

export class MemberAPI {
  static MEMBERLIST = "/List";
  static ADDMEMBER = "/UpdateUserHistory";
}

export class UserExist {
  static ISCURRENTUSEREXIST = "/IsCurrentUserMapWithAnyChannel";
}
