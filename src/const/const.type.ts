const TOKEN = "token_login";
const TOKEN_HEADER = "token_header";
const ROLE = {
  admin: 1,
  user: 2,
};
const MSG_GLOBAL = {
  success:{

  },
  error:{
    inValidToken: "Invalid token, you not allow to do this...!",
    invalidUserName: "Invalid Username...",
    notAllow: "Account permissions are not allowed...",
    invalidVoucher: "Invalid voucher...",
    invalidBookingId: "Invalid booking id...",
    notAAdmin: "This account is not admin..."
  }
}
export { TOKEN, TOKEN_HEADER, ROLE, MSG_GLOBAL };
