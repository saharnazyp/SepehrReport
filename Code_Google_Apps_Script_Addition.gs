/* این تابع را به Code.gs فعلی اضافه کن. بقیه کد فعلی دست‌نخورده بماند. */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('اطلاعات ارسالی دریافت نشد.');
    }

    const data = JSON.parse(e.postData.contents);
    const result = submitReport(data);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
