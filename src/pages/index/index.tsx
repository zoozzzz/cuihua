import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
import { AtGrid } from 'taro-ui'
import './index.less'

interface GameItem {
  image: string;
  value: string;
  path: string;
}

const Index = () => {

  const onSelectGame = (item: GameItem, index: number) => {
    item.path && Taro.navigateTo({url: item.path})
  }
  return (
    <View className='index'>
      <AtGrid
        onClick={onSelectGame}
        data={
        [
          {
            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
            value: '数字爆炸',
            path: '/pages/numBoom/index'
          },
          {
            image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
            value: '（敬请期待）',
            path: ''
          },
        ]
      } />
    </View>
  )
}
export default Index;
