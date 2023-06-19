import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import Joi from "joi";
import bcrypt from "bcrypt";
import { REFRESH_SECRET } from "../../config";

const loginController = {
  async login(req, res, next) {
    // validate the user
    const loginSchema = Joi.object().keys({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "in"] },
        })
        .required(),

      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
        "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),
    });
    let success = false;
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const user = await User.findOne({ email: req.body.email });

      // if user does not exist
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // match password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials("wrong password! please try again"));
      }

      // JWT Token
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      // [ ] generate refresh jwt token
      const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, "1y", REFRESH_SECRET);
      // database whitelist
      await RefreshToken.create({ token: refresh_token });

      success = true;
      res.json({ success, access_token, refresh_token });
    } catch (err) {
      return next(err);
    }
  },
};

export default loginController;
