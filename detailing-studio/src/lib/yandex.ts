import { StudioInfoCms, ServiceCms, LeadData } from "./types";
import * as XLSX from "xlsx";

// Default local fallback configuration matching the design references and client preferences
export const defaultStudioInfo: StudioInfoCms = {
  title: "PANDA detailing studio",
  tagline: "Защита и забота о вашем авто",
  description: "Премиальный уход и современные технологии, которые позволят наслаждаться вашим автомобилем, как в первый день после покупки. Мы продлеваем молодость вашего авто.",
  phone: "+7 (999) 123-45-67",
  phoneRaw: "+79991234567",
  address: "г. Москва, ул. Автомобильная, д. 45, стр. 2",
  instagramUrl: "https://instagram.com/panda.detail",
  telegramUrl: "https://t.me/panda_detail",
  stats: {
    years: "4 года",
    completed: "450+",
    cars: "100+",
    rating: "5.0 на Яндекс"
  }
};

export const defaultServices: ServiceCms[] = [
  {
    id: "polishing",
    name: "Детейлинг полировка",
    description: "Восстановление лакокрасочного покрытия, удаление до 95% царапин, голограмм и помутнений лака.",
    price: "от 15 000 ₽",
    duration: "1-2 дня"
  },
  {
    id: "ceramics",
    name: "Керамическая защита",
    description: "Нанесение премиальных нанокерамических составов. Глубокий зеркальный блеск, супергидрофоб и защита от реагентов.",
    price: "от 25 000 ₽",
    duration: "1 день"
  },
  {
    id: "ppf",
    name: "Антигравийная пленка (PPF)",
    description: "Оклейка кузова прочной полиуретановой пленкой. Абсолютная защита от сколов, царапин, притирок и пескоструя.",
    price: "от 65 000 ₽",
    duration: "2-3 дня"
  },
  {
    id: "dry-cleaning",
    name: "Детейлинг химчистка",
    description: "Полный разбор салона, гипоаллергенная чистка кожи, алькантары, текстиля, озонация и нанесение защитных кремов.",
    price: "от 12 000 ₽",
    duration: "1-2 дня"
  },
  {
    id: "glass",
    name: "Детейлинг стекол",
    description: "Полировка лобового и боковых стекол для удаления царапин и водного камня. Нанесение стойкого гидрофобного покрытия Антидождь.",
    price: "от 5 000 ₽",
    duration: "4-5 часов"
  },
  {
    id: "complex",
    name: "Комплексная защита",
    description: "Полный пакет: полировка кузова + керамика 2 слоя + защита лобового стекла + химчистка салона.",
    price: "от 45 000 ₽",
    duration: "3-4 дня"
  }
];

/**
 * Fetches CMS content from Yandex Sheets if configured, otherwise falls back to defaults.
 * For Russian Federal Law compliance, read/write routes are fully handled backend-side in Next.js Server Actions.
 */
export async function getCmsContent(): Promise<{ studioInfo: StudioInfoCms; services: ServiceCms[] }> {
  const yandexCmsUrl = process.env.YANDEX_CMS_SHEET_URL;
  const yandexToken = process.env.YANDEX_OAUTH_TOKEN;
  
  // Choose direct API link (avoids cache/CDN delays) or fallback to public link
  const requestUrl = yandexToken 
    ? `https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent("app:/detailing_cms.xlsx")}&t=${Date.now()}`
    : yandexCmsUrl ? `${yandexCmsUrl}${yandexCmsUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : null;

  if (!requestUrl) {
    return {
      studioInfo: defaultStudioInfo,
      services: defaultServices
    };
  }

  try {
    const headers: HeadersInit = {
      "Pragma": "no-cache",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    };
    if (yandexToken) {
      headers["Authorization"] = `OAuth ${yandexToken}`;
    }

    // 1. Fetch Yandex Disk JSON response which contains the temporary direct download link inside "href"
    const response = await fetch(requestUrl, { 
      cache: "no-store",
      headers
    });
    if (!response.ok) throw new Error("Failed to fetch Yandex Sheets CMS download info");
    
    const downloadInfo = await response.json();
    if (!downloadInfo || !downloadInfo.href) throw new Error("No download link found inside Yandex Disk API metadata");

    // 2. Fetch the actual XLSX binary stream using the direct download URL (and authenticate if using Token)
    const fileRes = await fetch(`${downloadInfo.href}&t=${Date.now()}`, { 
      cache: "no-store",
      headers: yandexToken ? { ...headers, Authorization: `OAuth ${yandexToken}` } : headers
    });
    if (!fileRes.ok) throw new Error("Failed downloading direct XLSX file stream from Yandex Disk");

    const arrayBuffer = await fileRes.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert sheet data to raw array of arrays matching CSV structure
    const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
    
    return parseCmsCsv(rows);
  } catch (error) {
    console.error("Yandex Sheets CMS connection failed, using local secure default fallback config:", error);
    return {
      studioInfo: defaultStudioInfo,
      services: defaultServices
    };
  }
}

/**
 * Submits lead to CRM (Yandex Sheets & Telegram Bot)
 */
export async function submitLeadToCrm(lead: LeadData): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Send to Telegram Bot first for real-time notification
    await sendTelegramNotification(lead);
    
    // 2. Append to Yandex CRM sheet
    await appendLeadToYandexSheets(lead);

    return { success: true, message: "Заявка успешно отправлена!" };
  } catch (error: any) {
    console.error("CRM Submission error:", error);
    return { success: false, message: error.message || "Ошибка отправки заявки" };
  }
}

/**
 * Sends a message notification to Telegram
 */
async function sendTelegramNotification(lead: LeadData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram notification skipped: Bot token or chat ID is missing in environment variables.");
    return;
  }

  const text = `🚗 *Новая заявка на детейлинг!*
  
👤 *Имя:* ${lead.name}
📞 *Телефон:* [${lead.phone}](tel:${lead.phone.replace(/[^+\d]/g, "")})
🛠 *Услуга:* ${lead.service}
📅 *Желаемая дата:* ${lead.date}
💬 *Сообщение:* ${lead.message || "—"}

⏳ _Заявка добавлена в CRM (Яндекс Таблицы)_`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API returned error: ${errorText}`);
  }
}

/**
 * Appends the new lead as a row in a Yandex Disk hosted Excel file or custom endpoint.
 * In Russia, data can be written to Yandex Disk using the Yandex Disk API:
 * Endpoint: POST https://cloud-api.yandex.net/v1/disk/resources/upload
 * We patch or append lines. To make it extremely reliable and simple without complex table manipulations,
 * we can post to a Yandex Cloud Serverless Function or Yandex Webhook, or directly write using Disk API.
 */
async function appendLeadToYandexSheets(lead: LeadData) {
  const yandexToken = process.env.YANDEX_OAUTH_TOKEN;
  const path = process.env.YANDEX_CRM_FILE_PATH || "app:/detailing_crm.xlsx";

  if (!yandexToken) {
    console.warn("Yandex CRM write skipped: YANDEX_OAUTH_TOKEN is not configured.");
    return;
  }

  try {
    // 1. Get file content from Yandex Disk (if it exists)
    const getUrl = `https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent(path)}`;
    const getRes = await fetch(getUrl, {
      headers: { Authorization: `OAuth ${yandexToken}` }
    });

    let leads: any[] = [];
    
    if (getRes.ok) {
      const downloadData = await getRes.json();
      const fileRes = await fetch(downloadData.href);
      if (fileRes.ok) {
        const arrayBuffer = await fileRes.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        leads = XLSX.utils.sheet_to_json(worksheet);
      }
    }

    const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    
    // Add new lead row mapping exact columns
    leads.push({
      "Дата": now,
      "Имя": lead.name,
      "Телефон": lead.phone,
      "Услуга": lead.service,
      "Дата Записи": lead.date,
      "Сообщение": lead.message || "",
      "Статус": "Новый"
    });

    // Re-create Sheet
    const newWorksheet = XLSX.utils.json_to_sheet(leads);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Заявки");
    
    // Write XLSX to binary buffer
    const xlsxBuffer = XLSX.write(newWorkbook, { type: "buffer", bookType: "xlsx" });

    // 2. Upload file back to Yandex Disk
    const uploadUrlResponse = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(path)}&overwrite=true`, {
      method: "GET",
      headers: { Authorization: `OAuth ${yandexToken}` }
    });

    if (!uploadUrlResponse.ok) {
      throw new Error(`Failed to get Yandex upload URL: ${await uploadUrlResponse.text()}`);
    }

    const { href: directUploadUrl } = await uploadUrlResponse.json();

    const uploadRes = await fetch(directUploadUrl, {
      method: "PUT",
      body: xlsxBuffer,
      headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed uploading updated XLSX to Yandex Disk: ${await uploadRes.text()}`);
    }
    console.log("Successfully appended lead to Yandex Disk XLSX CRM.");
  } catch (error) {
    console.error("Failed writing to Yandex Sheets CRM XLSX:", error);
  }
}

function parseCmsCsv(rows: any[][]): { studioInfo: StudioInfoCms; services: ServiceCms[] } {
  console.log("Parsing CMS rows, total rows found:", rows.length);
  const studioInfo = { ...defaultStudioInfo };
  const services: ServiceCms[] = [];

  try {
    for (const row of rows) {
      if (!row || row.length < 2) continue;
      const key = String(row[0] || "").trim().toLowerCase();
      const val = String(row[1] || "").trim();
      if (!key || !val) continue;
      
      console.log(`Parsed CMS row: ${key} -> ${val}`);
      
      if (key === "title") studioInfo.title = val;
      else if (key === "tagline") studioInfo.tagline = val;
      else if (key === "description") studioInfo.description = val;
      else if (key === "phone") studioInfo.phone = val;
      else if (key === "phone_raw") studioInfo.phoneRaw = val;
      else if (key === "address") studioInfo.address = val;
      else if (key === "instagram") studioInfo.instagramUrl = val;
      else if (key === "telegram") studioInfo.telegramUrl = val;
      else if (key === "stat_years") studioInfo.stats.years = val;
      else if (key === "stat_completed") studioInfo.stats.completed = val;
      else if (key === "stat_cars") studioInfo.stats.cars = val;
      else if (key === "stat_rating") studioInfo.stats.rating = val;
      
      // Parse service structure: "service:<id>" | name | description | price | duration
      if (key.startsWith("service:")) {
        const id = key.substring(8);
        services.push({
          id,
          name: val,
          description: row[2]?.trim() || "",
          price: row[3]?.trim() || "",
          duration: row[4]?.trim() || ""
        });
      }
    }
    
    return {
      studioInfo,
      services: services.length > 0 ? services : defaultServices
    };
  } catch (e) {
    console.error("CSV Parse logic error, using default fallback config:", e);
    return {
      studioInfo: defaultStudioInfo,
      services: defaultServices
    };
  }
}
