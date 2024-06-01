const fs = require('fs');
const source = require('./source');

function getRandomInt(min, max) {
  min = Math.ceil(min); // 向上取整，确保 min 是整数
  max = Math.floor(max); // 向下取整，确保 max 是整数
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 提取有用信息
const result = [];

source.forEach((item) => {
  if (item.note_card) {
    result.push({
      user: {
        nick_name: item.note_card.user.nick_name,
        avatar: item.note_card.user.avatar,
      },
      title: item.note_card.display_title,
      user_id: getRandomInt(1, 100),
      content: '',
      imgs: item.note_card.image_list.map((Item) => ({
        height: Item.height,
        width: Item.width,
        size: 999,
        url: Item.info_list[0].url,
      })),
      favour_count: getRandomInt(1, 10000),
    });
  }
});

function writeMyFile(filePath, content) {
  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File written successfully');
  });
}

writeMyFile('./temp.json', JSON.stringify(result));
