const mongoose = require("mongoose");
const validatorLib = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: [true, "Email already exists"],
    trim: true,
    lowercase: true,
    validate: {
      validator: validatorLib.isEmail,
      message: "Invalid Email",
    },
  },
  photo: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [8, "Password must be atleast 8 chars"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "passwords dont match",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpiry: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", function (next) {
  // Only update passwordChangedAt if the password is being modified and its not new
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  // Set passwordChangedAt to the current date and time
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

//query only active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.verifyPassword = async (
  candidatePassword,
  hashedPassword
) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

userSchema.methods.isPasswordChangedAfterToken = function (tokenChangeTime) {
  if (!this.passwordChangedAt)
    //password has never been changed before
    return false;

  const passwordChangedAt = this.passwordChangedAt.getTime() / 1000;
  if (Number(passwordChangedAt) > Number(tokenChangeTime)) return true;
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(36).toString("hex"); //generate a long token
  //encrypt it (to store in DB)

  //store hashed token in DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpiry = Date.now() + 10 * 60 * 1000; //10mins from now
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
