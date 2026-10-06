const xlsx = require('xlsx');
const fs = require('fs');

const files = [
  '../BANK EXPENCES SEP26.xlsx',
  '../BILL ON HOLD.xlsx',
  '../CASH EXPENCE SEP26.xlsx',
  '../FOOD PURCHASE SEP26.xlsx',
  '../ONLINE PAYMENT SEP26.xlsx',
  '../SALARY SHEET TAKTAK SEP26.xlsx',
  '../takatak report last month.xlsx'
];

files.forEach(file => {
  console.log(`\n--- Reading ${file} ---`);
  try {
    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log(data.slice(0, 5));
  } catch (err) {
    console.log('Error reading file:', err.message);
  }
});
