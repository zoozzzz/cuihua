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
  const [guessHistory, setGuessHistory] = useState<{ value: number; result: string }[]>([]);

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
  }, []);

  const startGame = () => {
    const randomNum = generateNum(0, 100);
    console.log('生成的数字:', randomNum);
    setNum(randomNum);
    setGameStarted(true);
    setShowRule(false);
  };

  const handleInputChange = (e) => {
    const inputValue = e.detail.value;
    // 只允许数字输入，移除所有非数字字符
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    setCurrentValue(numericValue);
  };

  const confirmGuess = () => {
    // 检查是否为空或只包含空格
    if (!currentValue || currentValue.trim() === '') {
      setError('请输入数字！');
      setTimeout(() => setError(''), 2000);
      return;
    }

    const guess = parseInt(currentValue);

    // 检查是否为有效数字
    if (isNaN(guess) || guess.toString() !== currentValue) {
      setError('请输入有效的数字！');
      setTimeout(() => setError(''), 2000);
      return;
    }

    // 检查数字范围
    if (guess < range[0] || guess > range[1]) {
      setError(`请输入${range[0]}-${range[1]}之间的数字！`);
      setTimeout(() => setError(''), 2000);
      return;
    }

    if (guess === num) {
      setBingo(true);
      // 添加到历史记录
      setGuessHistory(prev => [...prev, { value: guess, result: '命中' }]);
      return;
    }

    // 更新范围
    let result = '';
    if (guess < num) {
      setRange([guess, range[1]]);
      result = '偏小';
    } else {
      setRange([range[0], guess]);
      result = '偏大';
    }

    // 添加到历史记录
    setGuessHistory(prev => [...prev, { value: guess, result }]);
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
    setGuessHistory([]);
  };

  return (
    <View className='num-boom-container'>
      {/* 浮动装饰元素 */}
      <View className='floating-shapes'>
        <View className='floating-shape'></View>
        <View className='floating-shape'></View>
        <View className='floating-shape'></View>
      </View>

      {/* 游戏规则弹窗 */}
      {showRule && (
        <View className='rule-modal'>
          <View className='rule-content'>
            <View className='rule-title'>🎮 游戏规则</View>
            <View className='rule-text'>
              <Text>系统会生成一个0-100之间的随机数字</Text>
              <Text>你需要在给定范围内猜测这个数字</Text>
              <Text>猜中了就要喝酒哦～</Text>
              <Text>每次猜测后会缩小范围</Text>
            </View>
            <Button className='rule-btn' onClick={() => setShowRule(false)}>
              开始游戏
            </Button>
          </View>
        </View>
      )}

      {/* 游戏主体内容 */}
      <View className='game-content'>
        {/* 游戏标题 */}
        <View className='game-header'>
          <Text className='game-title'>🎯 数字炸弹</Text>
        </View>

        {/* 游戏区域 */}
        <View className='game-area'>
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

          {/* 猜测历史记录 */}
          {gameStarted && !bingo && guessHistory.length > 0 && (
            <View className='guess-history'>
              <View className='history-title'>猜测记录</View>
              <View className='history-list'>
                {guessHistory.map((item, index) => (
                  <View key={index} className='history-item'>
                    <Text className='history-value'>{item.value}</Text>
                    <Text className={`history-result ${item.result === '偏小' ? 'small' : item.result === '偏大' ? 'large' : 'bingo'}`}>
                      {item.result}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 交互区域 */}
        <View className='interaction-area'>
          {/* 输入区域 */}
          {gameStarted && !bingo && (
            <View className='input-section'>
              <View className='input-wrapper'>
                <input
                  className='number-input'
                  type='number'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  value={currentValue}
                  placeholder='Lucky Number'
                  onInput={handleInputChange}
                  maxLength={3}
                />
              </View>
              <Button className='confirm-btn' onClick={confirmGuess}>
                <Text className='confirm-text'>🚀</Text>
                <Text className='confirm-text'>确定</Text>
              </Button>
            </View>
          )}

          {/* 开始游戏按钮 */}
          {!gameStarted && (
            <View className='start-section'>
              <Button className='start-btn' onClick={startGame}>
                <View className='start-btn-content'>
                  <Text className='start-text'>🎲 开始游戏</Text>
                </View>
              </Button>
            </View>
          )}
        </View>
      </View>

      {/* 错误提示 */}
      {error && (
        <View className='error-toast'>
          <Text className='error-text'>⚠️ {error}</Text>
        </View>
      )}

      {/* 中奖弹窗 */}
      {bingo && (
        <View className='win-modal'>
          <View className='win-content'>
            <View className='win-emoji'>🍻</View>
            <Text className='win-title'>🎉 恭喜中奖！</Text>
            <Text className='win-subtitle'>该喝酒了～</Text>
            <Text className='win-number'>🎯 中奖数字: {num}</Text>
            <Button className='reset-btn' onClick={resetGame}>
              🔄 再来一局
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default NumBoom;