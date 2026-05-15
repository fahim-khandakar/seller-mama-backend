import { ENUM_COUPON_STATUS } from "../../../enums/coupon";
import { Coupon } from "./coupon.model";
import cron from "node-cron";

cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  await Coupon.updateMany(
    {
      validUntil: { $lt: now },
      status: ENUM_COUPON_STATUS.ACTIVE,
    },
    {
      status: ENUM_COUPON_STATUS.EXPIRED,
    },
  );
});
