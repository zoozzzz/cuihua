import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useEffect } from 'react';
import './index.less';

interface GameItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  available: boolean;
}

const Index = () => {
  useEffect(() => {
    Taro.showShareMenu({ withShareTicket: true });
  }, []);

  const gameList: GameItem[] = [
    {
      id: 'numBoom',
      title: '🎯 数字炸弹',
      description: '猜数字喝酒游戏，酒桌必备',
      icon: '💣',
      path: '/pages/numBoom/index',
      available: true
    },
    {
      id: 'truthOrDare',
      title: '🎭 真心话大冒险',
      description: '经典聚会游戏（敬请期待）',
      icon: '🎪',
      path: '',
      available: false
    },
    {
      id: 'whoIsUndercover',
      title: '🕵️ 谁是卧底',
      description: '推理类聚会游戏（敬请期待）',
      icon: '🔍',
      path: '',
      available: false
    },
    {
      id: 'drawGuess',
      title: '🎨 你画我猜',
      description: '绘画猜词游戏（敬请期待）',
      icon: '🖼️',
      path: '',
      available: false
    }
  ];

  const navigateToGame = (game: GameItem) => {
    if (game.available && game.path) {
      Taro.navigateTo({ url: game.path });
    } else {
      Taro.showToast({
        title: '敬请期待',
        icon: 'none',
        duration: 2000
      });
    }
  };

  return (
    <View className='index-container'>
      {/* 头部 */}
      <View className='header'>
        <View className='header-bg'></View>
        <View className='header-content'>
          <Text className='app-title'>🍻 翠花游戏</Text>
          <Text className='app-subtitle'>酒桌游戏合集</Text>
        </View>
      </View>

      {/* 游戏列表 */}
      <View className='game-list'>
        <View className='section-title'>
          <Text>🎮 选择游戏</Text>
        </View>
        <View className='game-grid'>
          {gameList.map((game) => (
            <View
              key={game.id}
              className={`game-card ${!game.available ? 'disabled' : ''}`}
              onClick={() => navigateToGame(game)}
            >
              <View className='game-icon'>
                <Text>{game.icon}</Text>
              </View>
              <View className='game-info'>
                <Text className='game-title'>{game.title}</Text>
                <Text className='game-desc'>{game.description}</Text>
              </View>
              {!game.available && (
                <View className='coming-soon'>
                  <Text>敬请期待</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 底部信息 */}
      <View className='footer'>
        <Text className='footer-text'>让聚会更有趣 🎉</Text>
      </View>
    </View>
  );
};

export default Index;
