const URL = "http://localhost:3000/api/chat";
const USER_NAME = "Eli";

const messages = [{ role: "system", content: "Pretend you are Elon Musk." }];

async function sendChat() {
  const prompt = document.querySelector("#prompt");

  // trigger loading state
  const submitButton = document.querySelector("button");
  submitButton.disabled = true;
  submitButton.innerText = "Loading...";
  prompt.disabled = true;

  const userMessage = { role: "user", content: prompt.value };
  messages.push(userMessage);

  // push user message to the ul
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  const b = document.createElement("b");
  b.innerText = `${USER_NAME}: ${prompt.value}`;
  li.appendChild(b);
  ul.appendChild(li);

  // reset field
  document.querySelector("#prompt").value = "";

  try {
    const respData = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });

    if (respData.status !== 200) throw new Error("Something went wrong");

    const message = await respData.json();
    messages.push(message);

    // push message to the UL
    ul.appendChild(document.createElement("li")).innerText = message.content;
  } catch (error) {
    alert("Woops, something went wrong, please try again later.");
    console.error("Something went wrong: ", error);
  } finally {
    document.querySelector("input").focus();
    submitButton.disabled = false;
    prompt.disabled = false;
    submitButton.innerText = "Send";
  }
}
