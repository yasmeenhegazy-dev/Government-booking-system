export const generateCodeOtp = (length = 6, expiresInMinutes = 5) => {
  let digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    let randomNum = Math.floor(Math.random() * digits.length);
    otp += digits[randomNum];
  }

  const otpExpire = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return {
    otp,
    otpExpire
  };
};


