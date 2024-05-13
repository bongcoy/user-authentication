const {default: mongoose} = require("mongoose");

const permissionSchema = new mongoose.Schema({
  permission_name: {
    type: String,
    required: true,
  },
  is_default: {
    type: Boolean,
    default: false, // Default value is false
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
