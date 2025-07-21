export default function insertLineBreak(title: string, maxLength = 10): string {
  if (title.length <= maxLength) return title;

  const words = title.split(' ');
  let line = '';
  let result = '';

  words.forEach(word => {
    if ((line + word).length > maxLength) {
      result += `${line.trim()}\n`;
      line = '';
    }
    line += `${word} `;
  });

  result += line.trim();
  return result;
}
