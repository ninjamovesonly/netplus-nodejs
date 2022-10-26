const authenticate = (req, res, next) => {
    async function authenticateCheck() {
      const token = req.header("Authorization");
      try {
        const { data: auth } = await axios.post(
          config.auth.url + "/api/user-profile",
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
        } else {
          res.status(401).send({
            success: "false",
            message: "Unauthorized",
          });
        }
      } catch (error) {
        res.status(500).send({
          error,
          success: "false",
          message: "Unauthorized",
        });
      }
    }
    authenticateCheck();
};

module.exports = { authenticate }