import { UserModel } from "../../models/userModels";

export const updateVerificationStatus = async (
  email: string,
  isVerified: boolean
) => {
  const result = await UserModel.updateOne(
    { email }, // Filter condition
    { $set: { isVerified } } // Update operation
  );
  return result;
};
