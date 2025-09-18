// 大话骰游戏工具函数

/**
 * 生成随机骰子点数 (1-6)
 * @param count 骰子数量
 * @returns 骰子点数数组
 */
export const rollDice = (count: number): number[] => {
  const dice: number[] = [];
  for (let i = 0; i < count; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1);
  }
  return dice;
};

/**
 * 统计骰子点数
 * @param dice 骰子数组
 * @returns 点数统计对象
 */
export const countDice = (dice: number[]): { [key: number]: number } => {
  const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  dice.forEach(point => {
    counts[point]++;
  });
  return counts;
};

/**
 * 验证玩家喊数是否有效
 * @param call 玩家喊的数 { point: 点数, count: 数量 }
 * @param lastCall 上一次喊数
 * @returns 是否有效
 */
export const isValidCall = (
  call: { point: number; count: number },
  lastCall?: { point: number; count: number }
): boolean => {
  // 第一次喊数
  if (!lastCall) {
    return call.count > 0 && call.point >= 1 && call.point <= 6;
  }
  
  // 数量必须更多，或者数量相同但点数更大
  return (
    call.count > lastCall.count ||
    (call.count === lastCall.count && call.point > lastCall.point)
  );
};

/**
 * 检查开骰结果
 * @param allDice 所有玩家的骰子
 * @param call 最后喊数
 * @returns 喊数是否正确
 */
export const checkCall = (
  allDice: number[][],
  call: { point: number; count: number }
): boolean => {
  const flatDice = allDice.flat();
  const actualCount = flatDice.filter(dice => dice === call.point || dice === 1).length; // 1是万能骰
  return actualCount >= call.count;
};

/**
 * 获取骰子表情符号
 * @param point 骰子点数
 * @returns 表情符号
 */
export const getDiceEmoji = (point: number): string => {
  const emojiMap: { [key: number]: string } = {
    1: '⚀',
    2: '⚁',
    3: '⚂',
    4: '⚃',
    5: '⚄',
    6: '⚅'
  };
  return emojiMap[point] || '❓';
};

/**
 * 骰子位置接口
 */
export interface DicePosition {
  x: number;
  y: number;
  rotation: number;
}

/**
 * 计算自适应骰子大小
 * @param containerWidth 容器宽度
 * @param containerHeight 容器高度
 * @param diceCount 骰子数量
 * @returns 骰子大小
 */
export const calculateDiceSize = (
  containerWidth: number,
  containerHeight: number,
  diceCount: number
): number => {
  // 基于容器大小计算合适的骰子尺寸
  const minDimension = Math.min(containerWidth, containerHeight);
  
  // 根据骰子数量调整基础大小
  let baseSize = minDimension / (Math.sqrt(diceCount) + 2);
  
  // 限制最小和最大尺寸
  const minSize = 50;
  const maxSize = 90;
  
  baseSize = Math.max(minSize, Math.min(maxSize, baseSize));
  
  return Math.floor(baseSize);
};

/**
 * 检查两个圆形区域是否重叠
 * @param pos1 位置1
 * @param pos2 位置2
 * @param radius1 半径1
 * @param radius2 半径2
 * @returns 是否重叠
 */
const isOverlapping = (
  pos1: { x: number; y: number },
  pos2: { x: number; y: number },
  radius1: number,
  radius2: number
): boolean => {
  const distance = Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
  );
  return distance < (radius1 + radius2);
};

/**
 * 生成不重叠的随机骰子位置
 * @param containerWidth 容器宽度
 * @param containerHeight 容器高度
 * @param diceSize 骰子大小
 * @param diceCount 骰子数量
 * @returns 骰子位置数组
 */
export const generateDicePositions = (
  containerWidth: number,
  containerHeight: number,
  diceSize: number,
  diceCount: number
): DicePosition[] => {
  const positions: DicePosition[] = [];
  const radius = diceSize / 2 + 10; // 骰子半径 + 安全间距
  const maxAttempts = 100; // 最大尝试次数
  
  // 计算可用区域（留出边距）
  const margin = radius + 5;
  const availableWidth = containerWidth - 2 * margin;
  const availableHeight = containerHeight - 2 * margin;
  
  for (let i = 0; i < diceCount; i++) {
    let attempts = 0;
    let validPosition = false;
    let newPosition: DicePosition;
    
    while (!validPosition && attempts < maxAttempts) {
      // 生成随机位置
      newPosition = {
        x: margin + Math.random() * availableWidth,
        y: margin + Math.random() * availableHeight,
        rotation: (Math.random() - 0.5) * 30 // -15° 到 +15° 的随机旋转
      };
      
      // 检查是否与已有位置重叠
      validPosition = true;
      for (const existingPos of positions) {
        if (isOverlapping(newPosition, existingPos, radius, radius)) {
          validPosition = false;
          break;
        }
      }
      
      attempts++;
    }
    
    // 如果无法找到不重叠的位置，使用网格布局作为后备方案
    if (!validPosition) {
      const cols = Math.ceil(Math.sqrt(diceCount));
      const row = Math.floor(i / cols);
      const col = i % cols;
      const spacing = Math.min(availableWidth / cols, availableHeight / Math.ceil(diceCount / cols));
      
      newPosition = {
        x: margin + col * spacing + spacing / 2,
        y: margin + row * spacing + spacing / 2,
        rotation: (Math.random() - 0.5) * 20
      };
    }
    
    positions.push(newPosition!);
  }
  
  return positions;
};

/**
 * 优化骰子位置，确保居中分布
 * @param positions 原始位置数组
 * @param containerWidth 容器宽度
 * @param containerHeight 容器高度
 * @returns 优化后的位置数组
 */
export const centerDicePositions = (
  positions: DicePosition[],
  containerWidth: number,
  containerHeight: number
): DicePosition[] => {
  if (positions.length === 0) return positions;
  
  // 计算所有骰子的中心点
  const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
  const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
  
  // 计算需要的偏移量来居中
  const targetX = containerWidth / 2;
  const targetY = containerHeight / 2;
  const offsetX = targetX - avgX;
  const offsetY = targetY - avgY;
  
  // 应用偏移量
  return positions.map(pos => ({
    x: pos.x + offsetX,
    y: pos.y + offsetY,
    rotation: pos.rotation
  }));
};