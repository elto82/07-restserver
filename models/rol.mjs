import { Schema, model } from "mongoose";

const RoleShema = Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
});

export default model("Role", RoleShema);
