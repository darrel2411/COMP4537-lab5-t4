// This code was developed with assistance from OpenAI's ChatGPT

class DatabaseClient {
  constructor(messages) {
    this.apiBase = messages.api.baseUrl;
    this.msg = messages.responses;
  }

  insertPatients() {
    const insertQuery = `
      INSERT INTO patient (name, dateOfBirth)
      VALUES
        ('Sara Brown', '1901-01-01'),
        ('John Smith', '1941-01-01'),
        ('Jack Ma', '1961-01-30'),
        ('Elon Musk', '1999-01-01');
    `;

    this.sendPost(insertQuery, "insertResponse");
  }

  runQuery() {
    const query = document.getElementById("query").value.trim();

    if (query.toLowerCase().startsWith("select")) {
      this.sendGet(query, "queryResponse");
    } else if (query.toLowerCase().startsWith("insert")) {
      this.sendPost(query, "queryResponse");
    } else {
      alert("Only SELECT or INSERT queries are allowed!");
    }
  }

  async sendGet(query, elementId) {
    // TODO
  }

  async sendPost(query, elementId) {
    try {
      const response = await fetch(this.apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      this.displayResponse(elementId, data);
      console.log(this.msg.insertSuccess);
    } catch (err) {
      console.error(this.msg.insertError, err);
      alert(this.msg.insertError);
    }
  }

  displayResponse(elementId, data) {
    const element = document.getElementById(elementId);
    element.textContent = JSON.stringify(data, null, 2);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const client = new DatabaseClient(MESSAGES);

  document.title = MESSAGES.labels.title;
  document.querySelector("h1").textContent = MESSAGES.labels.title;
  document.getElementById("insertBtn").textContent = MESSAGES.labels.insertBtn;
  document.getElementById("queryHeader").textContent = MESSAGES.labels.queryHeader;
  document.getElementById("submitBtn").textContent = MESSAGES.labels.submitBtn;
  document.getElementById("query").placeholder = MESSAGES.labels.textareaPlaceholder;

  document.getElementById("insertBtn").addEventListener("click", () => client.insertPatients());
  document.getElementById("submitBtn").addEventListener("click", () => client.runQuery());
});
