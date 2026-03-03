export default {
  login: {
    title: "Iniciar sesión",
    email: "Email",
    password: "Contraseña",
    emailPlaceholder: "example@mail.com",
    passwordPlaceholder: "••••••••",
    submit: "Entrar",
    firstTime: "¿Primera vez en el sitio?",
    fallbackError: "Error de inicio de sesión",
  },
  register: {
    title: "Registro",
    success: "¡Registro completado con éxito!",
    submit: "Registrarse",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    fields: {
      firstName: "Nombre",
      email: "Email",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      role: "Rol",
      rolePlaceholder: "Selecciona un rol",
    },
    roles: {
      student: "Estudiante",
      employer: "Empleador",
    },
    validation: {
      nameRequired: "Introduce el nombre",
      invalidEmail: "Email no válido",
      passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
      passwordsMismatch: "Las contraseñas no coinciden",
      roleRequired: "Selecciona un rol",
    },
    errors: {
      fallback: "Error de registro",
      network: "No se pudo conectar al servidor.",
    },
  },
};
