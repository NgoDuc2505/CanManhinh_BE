import * as jwt from "jsonwebtoken";


const createToken = (payload: any) => {
  try {
    const token = jwt.sign(payload, process.env.PRIVATE_KEY, {
      expiresIn: "2 days",
    });
    return token;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const verifyToken = (token: string) => {
  try {
    const decode = jwt.verify(token, process.env.PRIVATE_KEY);
    return decode;
  } catch (e) {
    return null;
  }
};

export { createToken, verifyToken };
