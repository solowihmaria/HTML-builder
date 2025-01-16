const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, items) => {
  if (err) {
    console.error(`Ошибка чтения папки: ${err.message}`);
    return;
  }

  console.log('Информация о файлах в директории:');

  items.forEach((item) => {
    if (item.isFile()) {
      const filePath = path.join(folderPath, item.name);

      fs.stat(filePath, (err, fileStats) => {
        if (err) {
          console.error(`Ошибка получения информации о файле: ${err.message}`);
          return;
        }

        const fileName = path.parse(item.name).name;
        const fileExtension = path.extname(item.name).slice(1);
        const fileSize = (fileStats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      });
    }
  });
});
