const {default: mongoose} = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
