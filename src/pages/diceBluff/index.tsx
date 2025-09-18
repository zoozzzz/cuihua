import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { useState, useEffect, useCallback } from 'react';
import { rollDice, generateDicePositions, centerDicePositions, calculateDiceSize, DicePosition } from './utils';
import DiceImage from '../../components/DiceImage';
import './index.less';

const DiceBluff = () => {
  const [myDice, setMyDice] = useState<number[]>([]);
  const [dicePositions, setDicePositions] = useState<DicePosition[]>([]);
  const [diceSize, setDiceSize] = useState<number>(60);
  const [isShaking, setIsShaking] = useState(false);
  const [diceAnimation, setDiceAnimation] = useState(false);
  const [fixedMode, setFixedMode] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [diceCount, setDiceCount] = useState<number>(5); // 骰子个数，默认5个
  const [showDiceCountModal, setShowDiceCountModal] = useState(false); // 骰子个数选择弹窗
  
  // 容器尺寸状态
  const [containerWidth, setContainerWidth] = useState<number>(350);
  const [containerHeight, setContainerHeight] = useState<number>(450);
  
  // 计算容器尺寸
  const calculateContainerSize = useCallback(() => {
    try {
      // 获取系统信息
      Taro.getSystemInfo({
        success: (res) => {
          // 宽度继承父节点（减去左右padding）
          const width = res.windowWidth - 40; // 减去左右各20px的padding
          
                  // 高度动态计算：总高度 - 顶部padding - 底部按钮区域高度
                  const bottomAreaHeight = 120 + 40 + 90 + 40; // 摇骰按钮 + 间距 + 功能按钮 + 底部padding
                  const height = res.windowHeight - 40 - bottomAreaHeight; // 减去顶部padding和底部区域
          
          setContainerWidth(width);
          setContainerHeight(Math.max(height, 300)); // 最小高度300px
        },
        fail: () => {
          // 降级方案：使用默认尺寸
          setContainerWidth(350);
          setContainerHeight(450);
        }
      });
    } catch (error) {
      console.log('获取系统信息失败：', error);
      // 降级方案
      setContainerWidth(350);
      setContainerHeight(450);
    }
  }, []);
  
  // 生成新的骰子布局
  const generateNewLayout = useCallback((diceValues: number[]) => {
    const newSize = calculateDiceSize(containerWidth, containerHeight, diceValues.length);
    setDiceSize(newSize);
    
    const rawPositions = generateDicePositions(
      containerWidth,
      containerHeight,
      newSize,
      diceValues.length
    );
    
    const centeredPositions = centerDicePositions(
      rawPositions,
      containerWidth,
      containerHeight
    );
    
    setDicePositions(centeredPositions);
  }, [containerWidth, containerHeight]);
  
  useEffect(() => {
    try {
      Taro.showShareMenu({
        withShareTicket: true,
        showShareItems: ['wechatFriends', 'wechatMoment']
      }).catch(err => {
        console.log('分享菜单设置失败，可能是在开发环境：', err);
      });
    } catch (error) {
      console.log('分享菜单设置失败：', error);
    }
    
    // 计算容器尺寸
    calculateContainerSize();
  }, [calculateContainerSize]);
  
  // 当容器尺寸或骰子个数变化时，重新生成布局
  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0) {
      // 根据设置的个数初始化骰子
      const initialDice = rollDice(diceCount);
      setMyDice(initialDice);
      generateNewLayout(initialDice);
    }
  }, [containerWidth, containerHeight, diceCount, generateNewLayout]);

  // 摇骰子
  const shakeDice = () => {
    if (fixedMode) return; // 固定模式下不能摇骰
    
    setIsShaking(true);
    setDiceAnimation(true);
    
    // 添加震动反馈
    try {
      Taro.vibrateShort({
        type: 'heavy'
      });
    } catch (error) {
      console.log('震动功能不支持：', error);
    }
    
    // 播放摇骰子声效
    const playDiceSound = () => {
      try {
        const audioContext = Taro.createInnerAudioContext();
        
        // 尝试多种路径格式 - 小程序环境专用路径
        const audioSources = [
          '/assets/sounds/dice_roll.wav',
          'assets/sounds/dice_roll.wav',
          './assets/sounds/dice_roll.wav',
          '../../assets/sounds/dice_roll.wav'
        ];
        
        let currentSourceIndex = 0;
        
        const tryNextSource = () => {
          if (currentSourceIndex >= audioSources.length) {
            console.log('所有音频路径都尝试失败');
            audioContext.destroy();
            return;
          }
          
          audioContext.src = audioSources[currentSourceIndex];
          console.log('尝试音频路径：', audioSources[currentSourceIndex]);
          currentSourceIndex++;
        };
        
        audioContext.volume = 0.8; // 增加音量到80%
        audioContext.loop = false;
        
        audioContext.onCanplay(() => {
          console.log('音频可以播放，开始播放');
          audioContext.play();
        });
        
        audioContext.onPlay(() => {
          console.log('音频开始播放');
        });
        
        // 清理音频资源
        audioContext.onEnded(() => {
          console.log('音频播放结束');
          audioContext.destroy();
        });
        
        audioContext.onError((err) => {
          console.log('音频播放失败：', err, '当前路径：', audioContext.src);
          tryNextSource();
        });
        
        // 开始尝试第一个路径
        tryNextSource();
        
        // 设置超时清理，防止内存泄漏
        setTimeout(() => {
          try {
            audioContext.destroy();
          } catch (e) {
            // 忽略清理错误
          }
        }, 5000);
        
      } catch (error) {
        console.log('音频初始化失败：', error);
      }
    };
    
    playDiceSound();
    
    // 摇骰动画 - 缩短到1秒
    setTimeout(() => {
      const newDice = rollDice(diceCount); // 使用设置的骰子个数
      setMyDice(newDice);
      // 生成新的随机位置
      generateNewLayout(newDice);
      setIsShaking(false);
      
      // 骰子落定震动
      try {
        Taro.vibrateShort({
          type: 'medium'
        });
      } catch (error) {
        console.log('震动功能不支持：', error);
      }
      
      // 骰子落定效果
      setTimeout(() => {
        setDiceAnimation(false);
      }, 300);
    }, 1000);
  };

  // 切换固定点数模式
  const toggleFixedMode = () => {
    setFixedMode(!fixedMode);
  };

  // 切换防窥模式
  const togglePrivateMode = () => {
    setPrivateMode(!privateMode);
  };

  return (
    <View className='dice-bluff-new'>
      {/* 骰子显示区域 */}
      <View className='dice-area' style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}>
        {/* 摇骰动画 */}
        {isShaking && (
          <View className='shaking-dice-overlay'>
            {Array.from({ length: diceCount }, (_, index) => (
              <View 
                key={`shaking-${index}`} 
                className='shaking-dice'
                style={{
                  position: 'absolute',
                  left: `${Math.random() * (containerWidth - diceSize)}px`,
                  top: `${Math.random() * (containerHeight - diceSize)}px`,
                  width: `${diceSize}px`,
                  height: `${diceSize}px`,
                  animation: 'dice2DWildShake 0.12s infinite ease-in-out',
                  animationDelay: `${index * 0.02}s`
                }}
              >
                <DiceImage
                  value={Math.floor(Math.random() * 6) + 1}
                  size={diceSize <= 55 ? "normal" : "large"}
                  style="spinning"
                  isRolling={true}
                />
              </View>
            ))}
          </View>
        )}
        
        {/* 静态骰子显示 */}
        {!isShaking && dicePositions.length > 0 && (
          <View className='dice-grid'>
            {myDice.map((point, index) => {
              const position = dicePositions[index];
              if (!position) return null;
              
              return (
                <View 
                  key={index} 
                  className='dice-item'
                  style={{
                    position: 'absolute',
                    left: `${position.x - diceSize/2}px`,
                    top: `${position.y - diceSize/2}px`,
                    width: `${diceSize}px`,
                    height: `${diceSize}px`,
                    transform: `rotate(${position.rotation}deg)`,
                    transition: 'all 0.6s ease',
                    zIndex: 1
                  }}
                >
                  <DiceImage
                    value={point}
                    size={diceSize <= 55 ? "normal" : "large"}
                    style="isometric"
                    isRolling={diceAnimation}
                  />
                </View>
              );
            })}
          </View>
        )}
        
        {/* 防窥模式遮罩 */}
        {privateMode && !isShaking && (
          <View className='privacy-overlay' onClick={togglePrivateMode}>
            <View className='privacy-content'>
              <View className='privacy-icon'>🙈</View>
              <View className='privacy-title'>防窥模式</View>
              <View className='privacy-subtitle'>点击任意位置查看骰子</View>
              <View className='privacy-dots'>
                <View className='dot'></View>
                <View className='dot'></View>
                <View className='dot'></View>
              </View>
            </View>
          </View>
        )}
        
      </View>

      {/* 摇骰子按钮 */}
      <View className='shake-button-area'>
        <Button 
          className={`shake-button ${fixedMode ? 'disabled' : ''}`}
          onClick={shakeDice} 
          disabled={isShaking || fixedMode}
        >
          <View className='shake-button-content'>
            <Text className='dice-icon'>🎲</Text>
            <Text className='shake-text'>
              {isShaking ? '摇骰中...' : fixedMode ? '已固定' : '摇骰子'}
            </Text>
          </View>
        </Button>
      </View>

      {/* 功能按钮区域 */}
      <View className='function-buttons'>
        <Button 
          className={`function-btn dice-count-btn ${fixedMode ? 'disabled' : ''}`}
          onClick={() => !fixedMode && setShowDiceCountModal(true)}
        >
          <Text className='function-icon'>🎲</Text>
          <Text className='function-text'>{diceCount}个骰子</Text>
        </Button>
        
        <Button 
          className={`function-btn fixed-btn ${fixedMode ? 'active' : ''}`}
          onClick={toggleFixedMode}
        >
          <Text className='function-icon'>🔒</Text>
          <Text className='function-text'>固定点数</Text>
        </Button>
        
        <Button 
          className={`function-btn private-btn ${privateMode ? 'active' : ''}`}
          onClick={togglePrivateMode}
        >
          <Text className='function-icon'>🙈</Text>
          <Text className='function-text'>防窥模式</Text>
        </Button>
      </View>

      {/* 骰子个数选择弹窗 */}
      {showDiceCountModal && (
        <View className='dice-count-modal' onClick={() => setShowDiceCountModal(false)}>
          <View className='modal-content' onClick={(e) => e.stopPropagation()}>
            <View className='modal-header'>
              <Text className='modal-title'>选择骰子个数</Text>
              <Button className='modal-close' onClick={() => setShowDiceCountModal(false)}>
                ✕
              </Button>
            </View>
            <View className='count-options'>
              {[1, 2, 3, 4, 5, 6].map(count => (
                <Button
                  key={count}
                  className={`count-option ${diceCount === count ? 'active' : ''}`}
                  onClick={() => {
                    setDiceCount(count);
                    setShowDiceCountModal(false);
                  }}
                >
                  <Text className='count-number'>{count}</Text>
                  <Text className='count-label'>个骰子</Text>
                </Button>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DiceBluff;