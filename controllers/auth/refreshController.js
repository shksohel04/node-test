import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const refreshController = {
  async refreshToken(req, res, next) {
    const refreshSchema = Joi.object().keys({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    let refreshToken;
    // database
    try {
      refreshToken = await RefreshToken.findOne({ token: req.body.refresh_token });
      if (!refreshToken) {
        return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
      }

      let user;
      try {
        const { _id } = JwtService.verify(refreshToken.token, REFRESH_SECRET);
        user = _id;
        if (!user) {
          return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
        }
      } catch (error) {
        return next(CustomErrorHandler.unAuthorized("No User Found"));
      }

      // [ ] generate jwt token
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      // [ ] generate refresh jwt token
      const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, "1y", REFRESH_SECRET);
      // database whitelist
      await RefreshToken.create({ token: refresh_token });

      // [ ] send response
      res.json({ access_token, refresh_token });
    } catch (error) {
      return next(new Error("Something went wrong" + error.message));
    }
  },
};

export default refreshController;
