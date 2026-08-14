const yandexToken = "y0__wgBEKHC9Q0YzNxDIKrG4fkXMJqruYMIgo4WPVmXC1_I7J476mYvM3YzSis";
const XLSX = require("xlsx");

async function run() {
  console.log("Starting Yandex XLSX initialization script...");
  
  // 1. Initialize CRM XLSX
  const crmPath = "app:/detailing_crm.xlsx";
  const crmHeaders = [["Дата", "Имя", "Телефон", "Услуга", "Дата Записи", "Сообщение", "Статус"]];
  
  try {
    console.log("Creating/Overwriting CRM Excel at Yandex Disk path:", crmPath);
    
    // Create new Workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(crmHeaders);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Заявки");
    const xlsxBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Request Upload URL from Yandex
    const uploadUrlResponse = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(crmPath)}&overwrite=true`, {
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
      throw new Error(`Failed uploading XLSX to Yandex Disk: ${await uploadRes.text()}`);
    }
    console.log("Successfully initialized Excel CRM table on Yandex Disk.");
  } catch (error) {
    console.error("CRM Excel table initialization failed:", error);
  }

  // 2. Initialize CMS XLSX config
  const cmsPath = "app:/detailing_cms.xlsx";
  const cmsRows = [
    ["key", "val", "desc", "price", "duration"],
    ["title", "PANDA Detailing Studio", "", "", ""],
    ["tagline", "Защита и забота о вашем авто", "", "", ""],
    ["description", "Премиальный уход и современные технологии, которые позволят наслаждаться вашим автомобилем как в первый день после покупки.", "", "", ""],
    ["phone", "+7 (999) 123-45-67", "", "", ""],
    ["phone_raw", "+79991234567", "", "", ""],
    ["address", "г. Москва, ул. Автомобильная, д. 45, стр. 2", "", "", ""],
    ["stat_years", "4 года", "", "", ""],
    ["stat_completed", "450+", "", "", ""],
    ["stat_cars", "100+", "", "", ""],
    ["stat_rating", "5.0 на Яндекс", "", "", ""],
    ["service:polishing", "Детейлинг полировка", "Восстановление лакокрасочного покрытия кузова", "от 15 000 ₽", "1-2 дня"],
    ["service:ceramics", "Керамическая защита", "Нанесение премиальных нанокерамических составов", "от 25 000 ₽", "1 день"],
    ["service:ppf", "Антигравийная пленка (PPF)", "Оклейка кузова прочной полиуретановой пленкой", "от 65 000 ₽", "2-3 дня"],
    ["service:dry-cleaning", "Детейлинг химчистка", "Полный разбор салона и гипоаллергенная чистка", "от 12 000 ₽", "1-2 дня"],
    ["service:glass", "Детейлинг стекол", "Полировка лобового и боковых стекол для удаления царапин. Нанесение состава Антидождь.", "от 5 000 ₽", "4-5 часов"],
    ["service:complex", "Комплексная защита", "Полный защитный пакет (полировка + керамика + химчистка)", "от 45 000 ₽", "3-4 дня"]
  ];

  try {
    console.log("Creating/Overwriting CMS Excel config at Yandex Disk path:", cmsPath);
    
    // Create new Workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(cmsRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Контент");
    const xlsxBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const uploadUrlResponse = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(cmsPath)}&overwrite=true`, {
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
      throw new Error(`Failed uploading Excel CMS to Yandex Disk: ${await uploadRes.text()}`);
    }
    console.log("Successfully initialized Excel CMS table on Yandex Disk.");

    // 3. Publish CMS Excel file to get a public link
    console.log("Publishing CMS Excel file to get public link...");
    const publishRes = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/publish?path=${encodeURIComponent(cmsPath)}`, {
      method: "PUT",
      headers: { Authorization: `OAuth ${yandexToken}` }
    });

    if (publishRes.ok) {
      const metaRes = await fetch(`https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(cmsPath)}`, {
        headers: { Authorization: `OAuth ${yandexToken}` }
      });
      if (metaRes.ok) {
        const meta = await metaRes.json();
        console.log("CMS Excel Public URL Info:", meta.public_url);
        const downloadLink = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(meta.public_url)}`;
        console.log("Use this new XLSX URL for YANDEX_CMS_SHEET_URL:", downloadLink);
      }
    }
  } catch (error) {
    console.error("CMS Excel table initialization failed:", error);
  }
}

run();
