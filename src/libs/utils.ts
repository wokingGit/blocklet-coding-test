/** 获取首字母方法 */
const getFirstLetter = (word: string | number) => {
  let firstChar: string;

  if (typeof word === 'string') {
    firstChar = word.trim().charAt(0);
  } else {
    firstChar = word.toString().charAt(0);
  }
  return firstChar;
};

/** 首字母大写方法 */
function CapFirstLetter(value: string): string {
  if (!value) return ''; // 处理空字符串的情况
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export { getFirstLetter, CapFirstLetter };
