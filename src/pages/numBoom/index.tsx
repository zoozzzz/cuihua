import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtInput, AtInputNumber, AtCurtain } from 'taro-ui';
import { useEffect, useState } from 'react'
import drink from '../../assets/drink.jpeg';
import { generateNum } from './utils';
import './index.less'

const NumBoom = () => {
  const [num, setNum] = useState<number | string>(0);
  const [currentValue, setCurrentValue] = useState<number | string>(0);
  const [bingo, setBingo] = useState(false);
  const [range, setRange] = useState([0, 100]);
  useEffect(() => {

  }, []);

  const onClick = () => {
    const randomNum = generateNum(0, 100);
    console.log(randomNum);
    setNum(randomNum);
  }
  const onChange = value => {
    setCurrentValue(value);
  }
  const onConfirm = () => {
    if (num === currentValue) {
      // 中了
      setBingo(true);
      return;
    }

    // 没中，继续
    if (currentValue < num) {
      setRange([+currentValue, range[1]]);
    } else {
      setRange([range[0], +currentValue]);
    }
  }

  const onClose = () => {
    setBingo(false);
    setNum(0);
    setCurrentValue(0);
    setRange([0, 100]);
  }

  return (
    <View className='wrapper'>

      {/* 已经生成数字 && 没中 */}
      {!bingo && !!num && <View className='tips'>{`${range[0]} ~ ${range[1]}`}</View>}
      {
        !!num && <View className='inputWrapper'><AtInputNumber onChange={onChange} type='number' value={currentValue} /></View>
      }
      {
        num ? (
          <AtButton className='btn' type='primary' onClick={onConfirm}>
            <View style={{ fontSize: 24 }}>确定</View>
          </AtButton>
        ) : (
          <AtButton className='btn' type='primary' onClick={onClick}>
            <View style={{ fontSize: 24 }}>生成随机数字</View>
            <View>(0,100)</View>
          </AtButton>
        )
      }

      {/* 中奖了 */}
      <AtCurtain
        isOpened={bingo}
        onClose={onClose}
      >
        <Image
          style='width:100%;height:250px'
          src={drink}
        />
      </AtCurtain>
    </View>
  )
}
export default NumBoom;
