const MESSAGES = {
  labels: {
    title: "Patient Database Client",
    insertBtn: "Insert Sample Patients",
    queryHeader: "Run SQL Query",
    submitBtn: "Submit Query",
    textareaPlaceholder: "Type SELECT or INSERT query here"
  },
  api: {
    // baseUrl: "http://localhost:8081/lab5/api/v1/sql/"
    baseUrl: "https://comp4537-lab5-t4.onrender.com/lab5/api/v1/sql/"
  },
  responses: {
    insertSuccess: "Insert request sent successfully.",
    insertError: "Error inserting patients.",
    getError: "Error get method"
  },
  alert: {
    queriesRestriction: "Only SELECT or INSERT queries are allowed!"
  }
};
