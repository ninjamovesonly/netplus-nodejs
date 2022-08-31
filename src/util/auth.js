const axios = require("axios");

async function ds() {
  const token = req.header("Authorization");

  try {
    const { data: auth } = await axios.post(
      "https://developer.isce.app/v1/auth/api/user-profile",
      {},
      {
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      }
    );
    if (auth.success === "true") {
      req.isce_auth = auth?.data?.user;
      next();
    }
  } catch (error) {
    res.json({
      success: "false",
      message: "Unauthorized",
    });
  }
}
