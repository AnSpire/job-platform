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
    liveBadge: "Live",
    industry: "Industry",
    location: "Location",
    website: "Website",
    about: "About company",
    loading: "Loading company details...",
    employerMissing: "No employer_id found for the current user.",
    notAssigned: "No company is assigned to this employer yet.",
    fetchError: "Failed to load company info (HTTP {{status}})",
    noData: "Not specified",
    websiteUnavailable: "Website not specified",
    locationUnavailable: "Location not specified",
    descriptionUnavailable: "No description yet",
    logoAlt: "{{name}} company logo",
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

  vacancyForm: {
    fields: {
      title: "Title",
      description: "Description",
      requirements: "Requirements",
      responsibilities: "Responsibilities",
      salaryFrom: "Salary from",
      salaryTo: "Salary to",
      currency: "Currency",
      location: "Location",
      employmentType: "Employment type",
    },
    placeholders: {
      currency: "EUR, USD...",
    },
    employment: {
      notSelected: "(not selected)",
    },
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
