export const resetPassword = async (form) => {
  const res = await fetch("http://localhost:3000/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  return res.json();
};

export const registerRequest = async (form) => {
  const res = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  return data;
};
export const loginRequest = async (form) => {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  return data;
};
export const sendOtpRequest = async (form) => {
  const res = await fetch("http://localhost:3000/auth/sendOtp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  return data;
};

export const resetPasswordRequest = async (form) => {
  const res = await fetch("http://localhost:3000/auth/resetpassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  return data;
};
