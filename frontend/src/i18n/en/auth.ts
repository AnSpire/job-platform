export default {
  login: {
    title: "Sign in",
    email: "Email",
    password: "Password",
    emailPlaceholder: "example@mail.com",
    passwordPlaceholder: "••••••••",
    submit: "Sign in",
    firstTime: "First time on the site?",
    fallbackError: "Login failed",
  },
  register: {
    title: "Register",
    success: "Registration completed successfully!",
    submit: "Register",
    alreadyHaveAccount: "Already have an account?",
    fields: {
      firstName: "First name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      role: "Role",
      rolePlaceholder: "Select a role",
    },
    roles: {
      student: "Student",
      employer: "Employer",
    },
    validation: {
      nameRequired: "Enter first name",
      invalidEmail: "Invalid email",
      passwordTooShort: "Password must contain at least 6 characters",
      passwordsMismatch: "Passwords do not match",
      roleRequired: "Select a role",
    },
    errors: {
      fallback: "Registration failed",
      network: "Could not connect to the server.",
    },
  },
};
