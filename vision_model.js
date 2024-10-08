import * as webllm from "./web_llm_lib.js";
//import * as webllm from "https://esm.run/@mlc-ai/web-llm";
import { imageURLToBase64 } from "./utils.js";

function setLabel(id, text) {
  const label = document.getElementById(id);
  if (label == null) {
    throw Error("Cannot find label " + id);
  }
  label.innerText = text;
}

const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const url_https_street = "https://www.ilankelman.org/stopsigns/australia.jpg";
const url_https_tree = "https://www.ilankelman.org/sunset.jpg";
const url_https_sea =
  "https://www.islandvulnerability.org/index/silhouette.jpg";

async function main() {
  // can feed request with either base64 or http url
  //const url_base64_street = await imageURLToBase64(proxyUrl + url_https_street);
  const url_base64_street = await imageURLToBase64('./pexels.jpg');
  const initProgressCallback = (report) => {
    setLabel("init-label", report.text);
  };
  const selectedModel = "Phi-3.5-vision-instruct-q4f16_1-MLC";
  const engine = await webllm.CreateMLCEngine(
    selectedModel,
    {
      initProgressCallback: initProgressCallback,
      logLevel: "INFO", // specify the log level
    },
    {
      context_window_size: 6144,
    },
  );

  // 1. Single image input (with choices)
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: "List the items in each image concisely." },
        {
          type: "image_url",
          image_url: {
            url: 'https://flatsiedatsie.github.io/web_llm_vision/pexels.jpg',
          },
        },
        {
          type: "image_url",
          image_url: {
            //url: proxyUrl + url_https_sea,
			url: 'https://flatsiedatsie.github.io/web_llm_vision/pexels2.jpg',
          },
        },
      ],
    },
  ];
  const request0 = {
    stream: false, // can be streaming, same behavior
    messages: messages,
  };
  const reply0 = await engine.chat.completions.create(request0);
  const replyMessage0 = await engine.getMessage();
  console.log("reply0: ", reply0);
  console.log("replyMessage0: ", replyMessage0);
  console.log("reply0.usage: ", reply0.usage);

  document.getElementById('reply1').textContent = replyMessage0;

  // 2. A follow up text-only question
  messages.push({ role: "assistant", content: replyMessage0 });
  messages.push({ role: "user", content: "What is special about each image?" });
  const request1 = {
    stream: false, // can be streaming, same behavior
    messages: messages,
  };
  const reply1 = await engine.chat.completions.create(request1);
  const replyMessage1 = await engine.getMessage();
  console.log("reply1: ", reply1);
  console.log("replyMessage1: ", replyMessage1);
  console.log("reply1.usage: ", reply1.usage);
  document.getElementById('reply2').textContent = replyMessage1;


  // 3. A follow up multi-image question
  messages.push({ role: "assistant", content: replyMessage1 });
  messages.push({
    role: "user",
    content: [
      { type: "text", text: "What about this image? Answer concisely." },
      {
        type: "image_url",
        //image_url: { url: proxyUrl + url_https_tree },
		image_url: { url: 'https://flatsiedatsie.github.io/web_llm_vision/pexels3.jpg' },
      },
    ],
  });
  const request2 = {
    stream: false, // can be streaming, same behavior
    messages: messages,
  };
  const reply2 = await engine.chat.completions.create(request2);
  const replyMessage2 = await engine.getMessage();
  console.log("reply2: ", reply2);
  console.log("replyMessage2: ", replyMessage2);
  console.log("reply2.usage: ", reply2.usage);
  document.getElementById('reply3').textContent = replyMessage2;
}

main();
