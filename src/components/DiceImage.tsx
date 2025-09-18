import React from 'react';
import { View } from '@tarojs/components';
import './DiceImage.less';

interface DiceImageProps {
  value: number; // 1-6
  size?: 'small' | 'normal' | 'large' | number; // 支持数字大小
  style?: 'normal' | 'isometric' | 'spinning';
  isRolling?: boolean;
  className?: string;
}

const DiceImage: React.FC<DiceImageProps> = ({
  value = 1,
  size = 'normal',
  style = 'isometric',
  isRolling = false,
  className = ''
}) => {
  // 计算实际尺寸
  const actualSize = typeof size === 'number' ? size : 
    size === 'large' ? 70 : size === 'normal' ? 60 : 50;
  // 渲染骰子点数
  const renderDots = (faceValue: number) => {
    const dotPositions: { [key: number]: string[] } = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    const positions = dotPositions[faceValue] || [];
    
    // 点数位置映射 - 使用精确的像素定位确保规整
    // const dotRadius = faceValue === 1 ? (baseSize + 2) / 2 : baseSize / 2;
    const margin = actualSize * 0.2; // 边距为骰子大小的20%
    
    const positionStyles: { [key: string]: any } = {
      'top-left': { 
        top: `${margin}px`, 
        left: `${margin}px`,
        transform: `translate(-50%, -50%)`
      },
      'top-right': { 
        top: `${margin}px`, 
        right: `${margin}px`,
        transform: `translate(50%, -50%)`
      },
      'middle-left': { 
        top: '50%', 
        left: `${margin}px`,
        transform: `translate(-50%, -50%)`
      },
      'middle-right': { 
        top: '50%', 
        right: `${margin}px`,
        transform: `translate(50%, -50%)`
      },
      'center': { 
        top: '50%', 
        left: '50%',
        transform: `translate(-50%, -50%)`
      },
      'bottom-left': { 
        bottom: `${margin}px`, 
        left: `${margin}px`,
        transform: `translate(-50%, 50%)`
      },
      'bottom-right': { 
        bottom: `${margin}px`, 
        right: `${margin}px`,
        transform: `translate(50%, 50%)`
      }
    };
    
    // 1点和4点使用红色，其他使用黑色
    const isRedDot = faceValue === 1 || faceValue === 4;
    const dotColor = isRedDot 
      ? 'radial-gradient(circle, #c0392b, #e74c3c)' 
      : 'radial-gradient(circle, #1a252f, #2c3e50)';
    const borderColor = isRedDot 
      ? 'rgba(192, 57, 43, 0.5)' 
      : 'rgba(0, 0, 0, 0.3)';
    
    // 根据骰子大小调整点数大小
    const baseSize = actualSize >= 70 ? 14 : actualSize >= 60 ? 10 : 8;
    const dotSize = faceValue === 1 ? `${baseSize + 2}px` : `${baseSize}px`;
    const dotBorder = faceValue === 1 ? '2px' : '1px';
    
    return positions.map((pos, idx) => (
      <View 
        key={idx} 
        className={`dice-dot ${pos}`}
        style={{
          width: dotSize,
          height: dotSize,
          background: dotColor,
          borderRadius: '50%',
          position: 'absolute',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
          border: `${dotBorder} solid ${borderColor}`,
          ...positionStyles[pos]
        }}
      ></View>
    ));
  };

  const containerClass = [
    'simple-dice',
    typeof size === 'string' ? `dice-${size}` : 'dice-custom',
    `dice-${style}`,
    isRolling ? 'rolling' : '',
    className
  ].filter(Boolean).join(' ');

  if (style === 'spinning') {
    return (
      <View className={containerClass}>
        <View className="dice-cube spinning" style={{ width: `${actualSize}px`, height: `${actualSize}px` }}>
          <View className="dice-face dice-front" data-value={value} style={{ width: `${actualSize}px`, height: `${actualSize}px` }}>
            {renderDots(value)}
          </View>
        </View>
      </View>
    );
  }

  // 2D平面骰子
  return (
    <View className={containerClass}>
      <View 
        className="dice-simple"
        style={{
          position: 'relative',
          width: `${actualSize}px`,
          height: `${actualSize}px`,
          margin: '0 auto'
        }}
      >
        <View 
          className="dice-face main-face" 
          data-value={value}
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            border: '3px solid #c1c3bf',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: `${actualSize}px`,
            height: `${actualSize}px`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {renderDots(value)}
        </View>
      </View>
    </View>
  );
};

export default DiceImage;
