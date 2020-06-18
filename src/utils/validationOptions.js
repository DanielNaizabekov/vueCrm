// ==== auth page validation options ====
export const authValidations = {
  email: {
    path: 'auth.email',
    methods: ['email', 'required'],
    hints: {
      email: 'Must be valid e-mail',
      required: 'E-mail is required',
    },
  },
  password: {
    path: 'auth.password',
    methods: ['minLength', 'required'],
    hints: {
      minLength: 'Password must be at least 6 characters',
      required: 'Password is required',
    },
  },
  acceptPolicy: {
    path: 'auth.acceptPolicy',
    methods: ['accept'],
    hints: {
      accept: 'You cannot continue without agreement',
    },
  },
};
// ==== auth page validation options ====


// ==== reset modal validation options ====
export const resetModalValidations = {
  email: {
    path: 'email',
    methods: ['email', 'required'],
    hints: {
      email: 'Must be valid e-mail',
      required: 'E-mail is required',
    },
  },
};
// ==== reset modal validation options ====


// ==== register page validation options ====
export const registerValidations = {
  name: {
    path: 'name',
    methods: ['required'],
    hints: {
      required: 'Name is required',
    },
  },
  email: {
    path: 'email',
    methods: ['required', 'email'],
    hints: {
      email: 'Must be valid e-mail',
      required: 'E-mail is required',
    },
  },
  password: {
    path: 'password',
    methods: ['required', 'minLength'],
    hints: {
      minLength: 'Password must be at least 6 characters',
      required: 'Password is required',
    },
  },
  repeatPassword: {
    path: 'repeatPassword',
    methods: ['sameAsPassword'],
    hints: {
      sameAsPassword: 'Passwords must be identical',
    },
  },
  acceptPolicy: {
    path: 'acceptPolicy',
    methods: ['accept'],
    hints: {
      accept: 'You cannot continue without agreement',
    },
  },
};
// ==== register page validation options ====


// ==== reset password validation options ====
export const resetPasswordValidations = {
  password: {
    path: 'password',
    methods: ['required', 'minLength'],
    hints: {
      minLength: 'Password must be at least 6 characters',
      required: 'Password is required',
    },
  },
  repeatPassword: {
    path: 'repeatPassword',
    methods: ['sameAsPassword'],
    hints: {
      sameAsPassword: 'Passwords must be identical',
    },
  },
};
// ==== reset password validation options ====


// ==== profile page validation options ====
export const profileValidations = {
  country: {
    path: 'form.country',
    methods: ['isString'],
    hints: {
      isString: 'String required',
    },
  },
  bill: {
    path: 'form.bill',
    methods: ['numeric'],
    hints: {
      numeric: 'Number required',
    },
  },
};
// ==== profile page validation options ====


// ==== planning page validation options ====
export const planningValidations = {
  limit: {
    path: 'limit',
    methods: ['required', 'numeric'],
    hints: {
      required: 'Should not be empty',
      numeric: 'Number required',
    },
  },
};
// ==== planning page validation options ====