import axios from "axios";
import { expect } from "chai";

axios.defaults.baseURL = "http://localhost:8080";

describe("Endpoint Integration Tests", () => {
  it("Create a user account and verify its existence using a GET request", async () => {
    // POST request to create a new user
    const userCreationResponse = await axios.post("/v1/user", {
      first_name: "user",last_name: "user",username: "user@gmail.com",password: "user01",
    });
    expect(userCreationResponse.status).to.equal(201);
    const userId = userCreationResponse.data.id;
    // Authenticate the user
    const authHeader = `Basic ${Buffer.from("user@gmail.com:user01").toString("base64")}`;
    // Send a GET request to verify the existence of the user account
    const getUserResponse = await axios.get("/v1/user/self", {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(getUserResponse.status).to.equal(200);
    expect(getUserResponse.data.id).to.equal(userId);
  }).timedOut(5000);

  it("Update an existing account and validate the changes with GET", async () => {
    // Authenticate
    const authHeader = `Basic ${Buffer.from("user@gmail.com:user01").toString("base64")}`;
    // Send a PUT request
    const updateUserResponse = await axios.put("/v1/user/self", {
      first_name: 'usernew',last_name: 'usernew',password: 'user01'
    }, {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(updateUserResponse.status).to.equal(204);
    // Send a GET request
    const getUserResponse = await axios.get("/v1/user/self", {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(getUserResponse.status).to.equal(200);
    expect(getUserResponse.data.first_name).to.equal("usernew");
  });
});
