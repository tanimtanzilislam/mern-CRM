const mongoose = require('mongoose');

const ROLES = ['admin', 'sales_manager', 'staff'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'staff' },
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  return { _id: this._id, name: this.name, email: this.email, role: this.role };
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
