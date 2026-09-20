const SPREADSHEETS = [
  {
    name: "واحد مارکتینگ",
    id: "1m78GfscWFvGRv3M5BY_qgv_TPwvfuBKTL4qJUGDnxM0"
  },
  {
    name: "واحد مالی",
    id: "1J40BT8-I63sI0N1fNftZIRB3us65KSAycKEsUb6YUNg"
  },
  {
    name: "واحد حقوقی",
    id: "1XxqI9BSZvJcTgF8oBKhdHj2QFx01ZzBHyulcsmqrY2M"
  },
  {
    name: "واحد دفتر مدیر عامل",
    id: "1OKJFSeKkk0nLhNlst5GMQyOrRRWa886tBrRDwDuaUF4"
  },
  {
    name: "واحد منابع انسانی",
    id: "12BA6_PdFw7woDUJFinap1LFVhzxs4TxV4dRz2OAIybE"
  }
];

const UNIT_NAMES = [
  "مارکتینگ",
  "مالی",
  "حقوقی",
  "دفتر مدیر عامل",
  "منابع انسانی"
];

function doGet() {
  return jsonResponse({
    success: true,
    message: "SepehrReport API is online"
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const employeeName = String(data.employeeName || "").trim();
    const unitIndex = Number(data.unitIndex);
    const activities = data.activities || [];

    if (!employeeName) {
      throw new Error("نام و نام خانوادگی وارد نشده است.");
    }

    if (
      !Number.isInteger(unitIndex) ||
      unitIndex < 0 ||
      unitIndex >= SPREADSHEETS.length
    ) {
      throw new Error("واحد انتخاب‌شده معتبر نیست.");
    }

    if (!activities.length) {
      throw new Error("هیچ فعالیتی ثبت نشده است.");
    }

    const target = SPREADSHEETS[unitIndex];

    const ss = SpreadsheetApp.openById(target.id);

    // اولین Sheet داخل فایل
    const sheet = ss.getSheets()[0];

    const rows = activities.map(a => [
      new Date(),
      employeeName,
      UNIT_NAMES[unitIndex],
      a.description || "",
      a.status || "",
      Number(a.progress || 0),
      a.date || "",
      a.document || "",
      a.responsible || "",
      a.nextAction || "",
      a.notes || ""
    ]);

    sheet
      .getRange(
        sheet.getLastRow() + 1,
        1,
        rows.length,
        rows[0].length
      )
      .setValues(rows);

    return jsonResponse({
      success: true,
      message: "گزارش با موفقیت ثبت شد.",
      unit: target.name,
      activities: rows.length
    });

  } catch (error) {

    return jsonResponse({
      success: false,
      error: error.message
    });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
