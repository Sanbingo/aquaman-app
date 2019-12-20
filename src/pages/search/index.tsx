import Taro, { Component, Config } from '@tarojs/taro'
import { AtList, AtListItem, AtSearchBar, AtDivider } from 'taro-ui'
import { View } from '@tarojs/components'

const MAX_REQUEST_PAGES = 5;

export default class Search extends Component {
    config: Config = {
        navigationBarTitleText: '搜索',
        onReachBottomDistance: 350,
    }
    constructor () {
        super()
        this.state = {
            value: '',
            list: [],
            page: 1,
            per_page: 20,
            isEnd: false
        }
    }
    onChange (value) {
        this.setState({
            value: value
        })
    }
    onActionClick () {
        console.log('开始搜索')
        this.setState({
            page: 1,
            isEnd: false,
        }, () => {
            this.searching(true)
        })
        
    }
    onReachBottom() {
        if (this.state.page > MAX_REQUEST_PAGES) {
          // 最多只允许翻5页
          return
        } 
        this.searching()
      }
    searching(firstTime) {
        const { list, value, page, per_page, isEnd } = this.state
        if (!value || isEnd) {
            return
        }
        Taro.showToast({
            icon: 'none',
            title: 'loading...'
        })
        Taro.request({
            url: 'https://www.8hnews.com/wp-json/wp/v2/search',
            data: {
                search: value,
                page,
                per_page,
            }
        }).then(res => {
            Taro.hideToast()
            this.setState({
                list: firstTime ? res.data : [...list, ...res.data],
                page: page + 1,
                isEnd: !firstTime && res.data && res.data.length === 0
            })
        })
    }
    handleClick = id => () => {
        Taro.navigateTo({
            url: `/pages/article/index?id=${id}`
        })
    }
    render() {
        const { list, isEnd } = this.state
        return (
            <View>
                <AtSearchBar
                    fixed
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    onActionClick={this.onActionClick.bind(this)}
                />
                <AtList>
                    {list.map(item => <AtListItem key={item.id} title={item.title} onClick={this.handleClick(item.id)} />)}
                    {list.length === 0 ? '' : ''}
                    {isEnd && <AtDivider content='我们是有底线的！' fontColor='#ccc'/>}
                </AtList>
            </View>
            
        )
    }
}