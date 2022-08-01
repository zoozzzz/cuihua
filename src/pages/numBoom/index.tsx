import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtModal, AtIcon, AtInputNumber, AtCurtain, AtToast, AtModalHeader, AtModalContent, AtModalAction} from 'taro-ui';
import { useEffect, useState } from 'react'
import drink from '../../assets/drink.jpeg';
import { generateNum } from './utils';
import './index.less'

const NumBoom = () => {
  const [num, setNum] = useState<number | string>(0);
  const [currentValue, setCurrentValue] = useState<number | string>(0);
  const [bingo, setBingo] = useState(false);
  const [range, setRange] = useState([0, 100]);
  const [error, setError] = useState('');
  const [visibleRule, setVisibleRule] = useState(true);

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
    if (currentValue < range[0] || currentValue > range[1]) {
      // 不在已猜中的范围
      setError('识唔识玩噶7头！过晒界啦！');
      return;
    }
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
    setError('');
  }

  return (
    <View className='wrapper'>

    <AtModal
      isOpened={visibleRule}
      title='游戏规则'
      cancelText='取消'
      confirmText='确认'
      // onClose={ () => setVisibleRule(false) }
      onCancel={ () => setVisibleRule(false) }
      onConfirm={ () => setVisibleRule(false) }
      content='我叫你饮个时你就饮得噶啦'
    />

      {/* 已经生成数字 && 没中 */}
      {!bingo && !!num && <View className='tips'>{`${range[0]} ~ ${range[1]}`}</View>}
      {
        !!num && <View className='inputWrapper'><AtInputNumber min={range[0]} max={range[1]} onChange={onChange} type='number' value={currentValue} /></View>
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

      <AtToast
        isOpened={!!error}
        text={error}
        icon='blocked'
      />

      {/* 中奖了 */}
      <AtCurtain
        isOpened={bingo}
        onClose={onClose}
      >
        <View style={{ position: 'relative' }}>
          <Text style={{ position: 'absolute', top: '50%', left: "50%", transform: "translate(-50%, -50%)" }}>饮啦7头</Text>
          <Image
            style='width:100%;height:250px'
            src={drink}
          />
        </View>
      </AtCurtain>
    </View>
  )
}
export default NumBoom;
