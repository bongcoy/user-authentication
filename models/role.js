const {default: mongoose} = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
  },
  value: {
    type: Number, // 0 -> user, 1 -> admin, 2 -> sub-admin, 3 -> editor
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
