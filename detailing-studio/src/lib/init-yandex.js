const yandexToken = "y0__wgBEKHC9Q0YhdpDINHih_kXMJqruYMI_4Hus3XGOuVZLsZ_zWCaFPHLgME";

async function run() {
  console.log("Starting Yandex initialization script...");
  
  // 1. Initialize CRM CSV
  const crmPath = "app:/detailing_crm.csv";
  const crmContent = "Дата,Имя,Телефон,Услуга,Дата Записи,Сообщение,Статус\n";
  
  try {
    console.log("Creating/Overwriting CRM CSV at Yandex Disk path:", crmPath);
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
      body: Buffer.from(crmContent, "utf-8"),
      headers: { "Content-Type": "text/csv; charset=utf-8" }
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed uploading updated CSV to Yandex Disk: ${await uploadRes.text()}`);
    }
    console.log("Successfully initialized CRM table on Yandex Disk.");
  } catch (error) {
    console.error("CRM table initialization failed:", error);
  }

  // 2. Initialize CMS CSV config
  const cmsPath = "app:/detailing_cms.csv";
  const cmsContent = [
    "key,val,desc,price,duration",
    "title,PANDA Detailing Studio,,,",
    "tagline,Защита и забота о вашем авто,,,",
    "description,Премиальный уход и современные технологии, которые позволят наслаждаться вашим автомобилем как в первый день.,,,",
    "phone,+7 (999) 123-45-67,,,",
    "phone_raw,+79991234567,,,",
    "address,г. Москва, ул. Автомобильная, д. 45, стр. 2,,,",
    "stat_years,4 года,,,",
    "stat_completed,450+,,,",
    "stat_cars,100+,,,",
    "stat_rating,5.0 на Яндекс,,,",
    "service:polishing,Детейлинг полировка,Восстановление лакокрасочного покрытия кузова,от 15 000 ₽,1-2 дня",
    "service:ceramics,Керамическая защита,Нанесение премиальных нанокерамических составов,от 25 000 ₽,1 день",
    "service:ppf,Антигравийная пленка (PPF),Оклейка кузова прочной полиуретановой пленкой,от 65 000 ₽,2-3 дня",
    "service:dry-cleaning,Детейлинг химчистка,Полный разбор салона и гипоаллергенная чистка,от 12 000 ₽,1-2 дня",
    "service:complex,Комплексная защита,Полный защитный пакет (полировка + керамика + химчистка),от 45 000 ₽,3-4 дня"
  ].join("\n");

  try {
    console.log("Creating/Overwriting CMS CSV config at Yandex Disk path:", cmsPath);
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
      body: Buffer.from(cmsContent, "utf-8"),
      headers: { "Content-Type": "text/csv; charset=utf-8" }
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed uploading updated CSV to Yandex Disk: ${await uploadRes.text()}`);
    }
    console.log("Successfully initialized CMS table on Yandex Disk.");

    // 3. Make CMS file publicly shareable so the app can fetch it without OAuth expiration worries, 
    // or we can read it via Yandex Disk API dynamically. Let's publish it.
    console.log("Publishing CMS file to get a public link...");
    const publishRes = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/publish?path=${encodeURIComponent(cmsPath)}`, {
      method: "PUT",
      headers: { Authorization: `OAuth ${yandexToken}` }
    });

    if (publishRes.ok) {
      // Get resources details to extract public download link
      const metaRes = await fetch(`https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(cmsPath)}`, {
        headers: { Authorization: `OAuth ${yandexToken}` }
      });
      if (metaRes.ok) {
        const meta = await metaRes.json();
        console.log("CMS Public URL Info:", meta.public_url);
        // We can get the direct download link from the public key/URL:
        const downloadLink = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(meta.public_url)}`;
        console.log("Use this for YANDEX_CMS_SHEET_URL:", downloadLink);
      }
    }
  } catch (error) {
    console.error("CMS table initialization failed:", error);
  }
}

run();
