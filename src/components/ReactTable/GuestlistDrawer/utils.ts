export const generateEmailBody = (body: string) => {
  let retStr = `<div>`;
  const bodyArr = body.split(/\r?\n/);
  bodyArr.forEach((el) => {
    if (el.length > 0) {
      retStr += `<div>`;
      retStr += el;
      retStr += `</div> \n`;
    } else {
      retStr += `<br />\n`;
    }
  });
  retStr += `</div>`;
  return retStr;
};