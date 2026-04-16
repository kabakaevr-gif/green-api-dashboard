"use strict";

const API_BASE = "https://api.green-api.com";

const elements = {
  idInstance: document.getElementById("idInstance"),
  apiTokenInstance: document.getElementById("apiTokenInstance"),
  phone: document.getElementById("phone"),
  message: document.getElementById("message"),
  fileUrl: document.getElementById("fileUrl"),
  response: document.getElementById("apiResponse"),
  statusBadge: document.getElementById("statusBadge"),
  fillDemoBtn: document.getElementById("fillDemoBtn"),
  getSettingsBtn: document.getElementById("getSettingsBtn"),
  getStateInstanceBtn: document.getElementById("getStateInstanceBtn"),
  sendMessageBtn: document.getElementById("sendMessageBtn"),
  sendFileByUrlBtn: document.getElementById("sendFileByUrlBtn")
};

const methodButtons = [
  elements.getSettingsBtn,
  elements.getStateInstanceBtn,
  elements.sendMessageBtn,
  elements.sendFileByUrlBtn
];

function setStatus(type, text) {
  elements.statusBadge.className = `status status-${type}`;
  elements.statusBadge.textContent = text;
}

function formatJson(data) {
  return JSON.stringify(data, null, 2);
}

function renderResponse(data) {
  elements.response.value = formatJson(data);
}

function sanitizePhone(phone) {
  return phone.replace(/\D/g, "");
}

function toChatId(phone) {
  return `${sanitizePhone(phone)}@c.us`;
}

function buildUrl(method, idInstance, apiTokenInstance) {
  return `${API_BASE}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}

function getBaseCredentials() {
  const idInstance = elements.idInstance.value.trim();
  const apiTokenInstance = elements.apiTokenInstance.value.trim();

  if (!idInstance || !apiTokenInstance) {
    throw new Error("Заполните idInstance и apiTokenInstance.");
  }

  return { idInstance, apiTokenInstance };
}

function setButtonsDisabled(disabled) {
  methodButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

async function callGreenApi(method, options = {}) {
  const { idInstance, apiTokenInstance } = getBaseCredentials();
  const url = buildUrl(method, idInstance, apiTokenInstance);
  const fetchOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  setButtonsDisabled(true);
  setStatus("loading", "Запрос...");

  try {
    const response = await fetch(url, fetchOptions);
    const rawText = await response.text();

    let parsedData;
    try {
      parsedData = rawText ? JSON.parse(rawText) : {};
    } catch {
      parsedData = { raw: rawText || "Пустой ответ" };
    }

    const output = {
      success: response.ok,
      status: response.status,
      method,
      url,
      data: parsedData
    };

    renderResponse(output);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: запрос завершился с ошибкой.`);
    }

    setStatus("success", "Успешно");
  } catch (error) {
    setStatus("error", "Ошибка");
    renderResponse({
      success: false,
      method,
      message: error.message || "Неизвестная ошибка"
    });
  } finally {
    setButtonsDisabled(false);
  }
}

function requireValue(value, errorMessage) {
  if (!value || !value.trim()) {
    throw new Error(errorMessage);
  }
}

function handleGetSettings() {
  callGreenApi("getSettings");
}

function handleGetStateInstance() {
  callGreenApi("getStateInstance");
}

function handleSendMessage() {
  try {
    const phone = elements.phone.value.trim();
    const message = elements.message.value.trim();

    requireValue(phone, "Заполните номер телефона в поле phone.");
    requireValue(message, "Заполните текст сообщения в поле message.");

    callGreenApi("sendMessage", {
      method: "POST",
      body: {
        chatId: toChatId(phone),
        message
      }
    });
  } catch (error) {
    setStatus("error", "Ошибка");
    renderResponse({ success: false, message: error.message });
  }
}

function getFileNameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const fileName = pathname.split("/").pop();
    return fileName || "file";
  } catch {
    return "file";
  }
}

function handleSendFileByUrl() {
  try {
    const phone = elements.phone.value.trim();
    const fileUrl = elements.fileUrl.value.trim();
    const caption = elements.message.value.trim();

    requireValue(phone, "Заполните номер телефона в поле phone.");
    requireValue(fileUrl, "Заполните ссылку на файл в поле fileUrl.");

    callGreenApi("sendFileByUrl", {
      method: "POST",
      body: {
        chatId: toChatId(phone),
        urlFile: fileUrl,
        fileName: getFileNameFromUrl(fileUrl),
        caption: caption || "Файл отправлен из mini-dashboard"
      }
    });
  } catch (error) {
    setStatus("error", "Ошибка");
    renderResponse({ success: false, message: error.message });
  }
}

function fillDemoData() {
  elements.idInstance.value = "1101000000";
  elements.apiTokenInstance.value = "your_api_token_instance_here";
  elements.phone.value = "79991234567";
  elements.message.value = "Привет! Тест отправки из GREEN API dashboard.";
  elements.fileUrl.value = "https://example-files.online-convert.com/document/txt/example.txt";

  setStatus("idle", "Тестовые данные заполнены");
}

function init() {
  elements.getSettingsBtn.addEventListener("click", handleGetSettings);
  elements.getStateInstanceBtn.addEventListener("click", handleGetStateInstance);
  elements.sendMessageBtn.addEventListener("click", handleSendMessage);
  elements.sendFileByUrlBtn.addEventListener("click", handleSendFileByUrl);
  elements.fillDemoBtn.addEventListener("click", fillDemoData);

  renderResponse({
    info: "Введите параметры и вызовите нужный метод GREEN API.",
    methods: ["getSettings", "getStateInstance", "sendMessage", "sendFileByUrl"]
  });
}

init();
