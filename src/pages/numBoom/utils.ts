/*
 * Description: 
 * Created: 2022-08-01 14:45:56
 * Author : Wing
 * Email : cairz@mogulinker.com
 * -----
 * Last Modified: 2022-08-01 14:45:56
 * Modified By: Wing
 * -----
 * Copyright (c) 2022 www.mogulinker.com
 */

// 生成 (n,m)，不包含n和m的正整数：
export const generateNum = (min, max) => {
  return parseInt(Math.random() * (max - min - 1) + min + 1);
}