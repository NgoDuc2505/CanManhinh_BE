declare const TOKEN = "token_login";
declare const TOKEN_HEADER = "token_header";
declare const ROLE: {
    admin: number;
    user: number;
};
declare const MSG_GLOBAL: {
    success: {};
    error: {
        inValidToken: string;
        invalidUserName: string;
        notAllow: string;
        invalidVoucher: string;
    };
};
export { TOKEN, TOKEN_HEADER, ROLE, MSG_GLOBAL };
