const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { SALT_WORK_FACTOR } = process.env;

const UserSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le prénom ne peut pas être vide"],
  },
  prenom: {
    type: String,
    required: [true, "Le nom ne peut pas être vide"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "L'adresse mail est déjà pris"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "L'adresse mail n'est pas valide",
    ],
  },
  date_naissance: {
    type: Date,
    required: [true, "La date de naissance ne peut pas être vide"],
  },
  login: {
    type: String,
    unique: true,
    required: [true, "Le login ne peut pas être vide"],
  },
  password: {
    type: String,
    required: true,
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Le mot de passe doit au moins avoir 8 lettres et contenir: une lettre en majuscule, un chiffre, un charactère spécial",
    ],
  },
  date_inscription: {
    type: Date,
    default: new Date(),
  }
});

UserSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(SALT_WORK_FACTOR || 10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, match) {
    if (error) {
      return callback(error);
    } else {
      callback(null, match);
    }
  });
};

module.exports = mongoose.model("User", UserSchema, "user");
