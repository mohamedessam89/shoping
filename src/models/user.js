const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  name: {type: String},
  email: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  isEmployee: {type: Boolean, default: false},
  isAffiliate: {type: Boolean, default: false},
  lastOrderDate: Date,
}, {timestamps: true});

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports=User;
