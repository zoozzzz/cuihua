import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { generateNum } from './utils';
import './index.less';

const NumBoom = () => {
  const [num, setNum] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState<string>('');
  const [bingo, setBingo] = useState(false);
  const [range, setRange] = useState([0, 100]);
  const [error, setError] = useState('');
  const [showRule, setShowRule] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    Taro.showShareMenu({ withShareTicket: true });
  }, []);

  const startGame = () => {
    const randomNum = generateNum(0, 100);
    console.log('生成的数字:', randomNum);
    setNum(randomNum);
    setGameStarted(true);
    setShowRule(false);
  };

  const handleInputChange = (e) => {
    setCurrentValue(e.detail.value);
  };

  const confirmGuess = () => {
    const guess = parseInt(currentValue);
    
    if (isNaN(guess)) {
      setError('请输入有效数字！');
      setTimeout(() => setError(''), 2000);
      return;
    }

    if (guess < range[0] || guess > range[1]) {
      setError('超出范围啦！请在指定范围内输入');
      setTimeout(() => setError(''), 2000);
      return;
    }

    if (guess === num) {
      setBingo(true);
      return;
    }

    // 更新范围
    if (guess < num) {
      setRange([guess, range[1]]);
    } else {
      setRange([range[0], guess]);
    }
    
    setCurrentValue('');
  };

  const resetGame = () => {
    setBingo(false);
    setNum(0);
    setCurrentValue('');
    setRange([0, 100]);
    setError('');
    setGameStarted(false);
    setShowRule(true);
  };

  return (
    <View className='num-boom-container'>
      {/* 游戏规则弹窗 */}
      {showRule && (
        <View className='rule-modal'>
          <View className='rule-content'>
            <View className='rule-title'>🎮 游戏规则</View>
            <View className='rule-text'>
              <Text>1. 系统会生成一个0-100之间的随机数字</Text>
              <Text>2. 你需要在给定范围内猜测这个数字</Text>
              <Text>3. 猜中了就要喝酒哦～</Text>
              <Text>4. 每次猜测后会缩小范围</Text>
            </View>
            <Button className='rule-btn' onClick={() => setShowRule(false)}>
              我知道了
            </Button>
          </View>
        </View>
      )}

      {/* 游戏主界面 */}
      <View className='game-header'>
        <Text className='game-title'>🎯 数字炸弹</Text>
        <Text className='game-subtitle'>酒桌必备神器</Text>
      </View>

      {/* 范围显示 */}
      {gameStarted && !bingo && (
        <View className='range-display'>
          <View className='range-item'>
            <Text className='range-number'>{range[0]}</Text>
          </View>
          <Text className='range-separator'>~</Text>
          <View className='range-item'>
            <Text className='range-number'>{range[1]}</Text>
          </View>
        </View>
      )}

      {/* 输入区域 */}
      {gameStarted && !bingo && (
        <View className='input-section'>
          <View className='input-wrapper'>
            <input
              className='number-input'
              type='number'
              value={currentValue}
              placeholder={`请输入${range[0]}-${range[1]}之间的数字`}
              onInput={handleInputChange}
            />
          </View>
          <Button className='confirm-btn' onClick={confirmGuess}>
            确定
          </Button>
        </View>
      )}

      {/* 开始游戏按钮 */}
      {!gameStarted && (
        <View className='start-section'>
          <Button className='start-btn' onClick={startGame}>
            <Text className='start-text'>开始游戏</Text>
            <Text className='start-subtext'>生成随机数字</Text>
          </Button>
        </View>
      )}

      {/* 错误提示 */}
      {error && (
        <View className='error-toast'>
          <Text className='error-text'>{error}</Text>
        </View>
      )}

      {/* 中奖弹窗 */}
      {bingo && (
        <View className='win-modal'>
          <View className='win-content'>
            <View className='win-emoji'>🍻</View>
            <Text className='win-title'>恭喜中奖！</Text>
            <Text className='win-subtitle'>该喝酒了～</Text>
            <Text className='win-number'>中奖数字: {num}</Text>
            <Button className='reset-btn' onClick={resetGame}>
              再来一局
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default NumBoom;