const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const User = require("../models/user");
// const { resolve } = require("dns");

const { SALT_WORK_FACTOR, JWT_TOKEN_KEY } = process.env;

const hashPassword = (password, callback) => {
  if (!password)
    return callback(new createHttpError.BadRequest("Valeur manquante"));

  bcrypt.genSalt(SALT_WORK_FACTOR || 10, function (saltError, salt) {
    if (saltError) {
      callback(saltError);
    } else {
      try {
        bcrypt.hash(password, salt, callback);
      } catch (error) {
        callback(error);
      }
    }
  });
};

const hashAndUpdateAllPassword = async (fn) => {
  const session = await User.startSession();

  await session.withTransaction(async () => {
    const users = await User.find();

    users.forEach((row) => {
      hashPassword(row.password, async function (hashError, hash) {
        if (hashError) {
          // throw hashError;
          fn({ error: hashError });
        } else {
          // console.log({ id: row._id, hash });
          await User.updateOne({ _id: row._id }, { password: hash });
          // fn(new Error("error on hash process"));
        }
      });
    });
  });

  session.endSession();
};

const generateToken = ({ _id, email, profile }) => {
  return jwt.sign({ _id, email, profile }, JWT_TOKEN_KEY, {
    expiresIn: "2h",
  });
};

const login = ({ login, password }, next) => {
  if (!login || !password)
    return next(
      new createHttpError.BadRequest(
        "Erreur Login: Login ou mot de passe absent"
      )
    );

  User.findOne()
    .or([{ login: login }, { email: login }])
    .exec((error, user) => {
      if (error) return next(error);
      if (!user) return next(new Error("Erreur Login: Utilisateur non trouvé"));

      user.comparePassword(password, function (error, match) {
        if (error) return next(error);
        if (!match)
          return next(
            new Error("Erreur Login: Le login ou le mot de passe est erroné")
          );

        const token = generateToken(user);
        user.token = token;
        user.password = '😍';
        next(null, user);
      });
    });
};

const register = (userInfo, next) => {
  User.startSession()
    .then(async (session) => {
      const user = new User(userInfo);
      const savedUser = user;
      await session.withTransaction(async () => {
        await user.save((error, newuser) => {
          if (error) return next(error);
          savedUser = newuser;
        });
      });

      session.endSession();

      return Promise.resolve(savedUser);
    })
    .then((user) => {
      User.findOne({ login: user.login })
        .exec((err, user) => {
          if(err) return next(err);
          if (!user) return next(new Error("Oups! Une erreur est survenue"));

          const token = generateToken(user);
          user.token = token;
          user.password = '😍';
          next(null, user);
        });
    });
};

module.exports = {
  hashPassword,
  hashAndUpdateAllPassword,
  login,
  register,
};
