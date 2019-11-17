const mongoose     = require('mongoose'),
    emailValidator = require('email-validator'),
    Schema         = mongoose.Schema,
    bcrypt         = require('bcrypt'),
    saltRounds     = 12;

const UserSchema = new Schema({
    userName: {
        type     : String,
        required : [true, 'User Name is Required'],
        trim     : true,
        lowercase: true,
        index    : { unique: true },
        max      : 20,
        min      : [3, 'User Name Should Have at Least 4 Character']
    },
    email: {
        type     : String,
        required : [true, 'Email is Required'],
        trim     : true,
        lowercase: true,
        index    : { unique: true },
        validate : {
            validator: emailValidator.validate,
            message  : props => `${props.value} Is Not a Valid Email!`
        }
    },
    password: {
        type     : String,
        required : [true, 'Password is Required'],
        trim     : true,
        index    : { unique: true },
        max      : [20, 'Password Should Have at Most 20 Character'],
        min      : [8, 'Password Should Have at Least 4 Character']
    },
    avatar: {
        type: String
    }
}, {
    collection: 'meetup_users',
    timestamps: true,
});

UserSchema.pre('save', async function preSave(next) {
    const user = this;

    if(!user.isModified('password')) {
        return next();
    } else {
        try {
            const hashPassword = await bcrypt.hash(user.password, saltRounds);

            user.password = hashPassword;

            return next();
        } catch (error) {
            return next(error);
        }
    }
});

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
