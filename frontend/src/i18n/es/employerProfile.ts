export default {
  title: "Panel del empleador",
  myVacancies: "Mis vacantes",
  createVacancy: "Crear vacante",

  vacancies: {
    loading: "Cargando vacantes...",
    empty: "No hay vacantes activas",
    locationFallback: "—",
  },

  modal: {
    title: "Crear vacante",
    cancel: "Cancelar",
    submit: "Crear",
    submitting: "Creando...",
  },

  errors: {
    createFailed: "No se pudo crear la vacante",
    loadFailed: "No se pudieron cargar las vacantes (HTTP {{status}})",
    employerIdMissing: "Falta el ID del empleador",
  },

  validation: {
    titleRequired: "El campo título es obligatorio",
    descriptionRequired: "El campo descripción es obligatorio",
    salaryFromNumber: "salary_from debe ser un número",
    salaryToNumber: "salary_to debe ser un número",
    salaryFromNegative: "salary_from no puede ser negativo",
    salaryToNegative: "salary_to no puede ser negativo",
    salaryFromGreaterThanTo: "salary_from no puede ser mayor que salary_to",
  },
};
