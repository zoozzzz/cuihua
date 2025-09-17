/**
 * 生成指定范围内的随机数（不包含边界）
 * @param min 最小值
 * @param max 最大值  
 * @returns 随机整数
 */
export const generateNum = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min - 1) + min + 1);
}