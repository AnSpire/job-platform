export default {
  title: "Employer dashboard",
  myVacancies: "My vacancies",
  createVacancy: "Create vacancy",

  profile: {
    role: "Role",
    firstName: "First name",
    lastName: "Last name",
    emptyValue: "Not specified",
    edit: "Edit",
    logout: "Log out",
    save: "Save",
    cancel: "Cancel",
    firstNamePlaceholder: "Enter first name",
    lastNamePlaceholder: "Enter last name",
  },

  company: {
    title: "Employer company",
    hardcodedBadge: "Demo",
    industry: "Industry",
    teamSize: "Team size",
    location: "Location",
    website: "Website",
    about: "About company",
  },

  vacancies: {
    loading: "Loading vacancies...",
    empty: "No active vacancies",
    locationFallback: "—",
    subtitle: "Manage postings and track open positions",
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
