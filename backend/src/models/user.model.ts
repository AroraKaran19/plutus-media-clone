import bcrypt from "bcryptjs";
import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface IUser extends Document<Types.ObjectId> {
  name: string;
  email: string;
  password: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Never returned by a query unless explicitly selected with "+password".
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

// Mongoose 9 dropped next() in pre hooks; an async function signals completion.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// Guards against OverwriteModelError when a warm serverless container re-evaluates the module.
export const User: Model<IUser> = (models.User as Model<IUser>) ?? model<IUser>("User", userSchema);
