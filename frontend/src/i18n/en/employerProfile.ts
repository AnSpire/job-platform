export default {
  title: "Employer dashboard",
  myVacancies: "My vacancies",
  createVacancy: "Create vacancy",

  vacancies: {
    loading: "Loading vacancies...",
    empty: "No active vacancies",
    locationFallback: "—",
  },

  modal: {
    title: "Create vacancy",
    cancel: "Cancel",
    submit: "Create",
    submitting: "Creating...",
  },

  errors: {
    createFailed: "Failed to create vacancy",
    loadFailed: "Failed to load vacancies (HTTP {{status}})",
    employerIdMissing: "Employer ID is missing",
  },

  validation: {
    titleRequired: "The title field is required",
    descriptionRequired: "The description field is required",
    salaryFromNumber: "salary_from must be a number",
    salaryToNumber: "salary_to must be a number",
    salaryFromNegative: "salary_from cannot be negative",
    salaryToNegative: "salary_to cannot be negative",
    salaryFromGreaterThanTo: "salary_from cannot be greater than salary_to",
  },
};
