import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import './list.less'

export default class List extends Component {
    handleClick = () => {
        const { postId } = this.props;
        Taro.navigateTo({
            url: `/pages/article/index?id=${postId}`
          })
    }

    render() {
        const { multipleMode, multiplePics=[] } = this.props;
        // 多图模式
        if (multipleMode) {
            return (
                <View className="list-wrap" onClick={this.handleClick}>
                    <View className="list-wrap-item">
                        <View className="list-wrap__title">{this.props.title}</View>
                        <View className="list-wrap__images">
                            {multiplePics.map(item => <Image className="list-wrap__images-item" src={item} />)}
                        </View>
                    </View>
                </View>
            )
        }
        // 单图模式
        return (
            <View className="list-wrap" onClick={this.handleClick}>
                <View className="list-wrap__left">
                    <Image src={ this.props.thumb || 'http://b.hiphotos.baidu.com/image/pic/item/908fa0ec08fa513db777cf78376d55fbb3fbd9b3.jpg'} />
                </View>
                <View className="list-wrap__right">
                    <Text className="list-wrap__title">{ this.props.title || '【行业动态】东芝宣布推出6TB的HDD！'}</Text>
                    <Text className="list-wrap__timestamp">{ this.props.time || '2019-12-11 13:33:16'}</Text>
                </View>
            </View>
        )
    }
}