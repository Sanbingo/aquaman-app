import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import WxParse from './components/wxParse/wxParse'

export default class Article extends Component {
    config: Config = {
        navigationBarTitleText: '文章详情'
      }
    constructor () {
        super(...arguments)
        this.state = {
          title: '',
          time: '',
          author: '',
          content: ''
        }
      }
    componentWillMount () {
    this.$preloadData
        .then(res => {
        // 图片预处理
        const content = res && res.data && res.data.content.rendered;
        const article = res && res.data && res.data.content.rendered
        WxParse.wxParse('article', 'html', article, this.$scope, 5)
        this.setState({
            title: res && res.data && res.data.title.rendered,
            time: res && res.data && res.data.modified,
            content: content,
        })
        this.isFetching = false
        Taro.hideLoading()
        })
    }

    componentWillPreload (params) {
        return this.fetchData(params.id)
    }

    fetchData (id) {
        this.isFetching = true
        Taro.showLoading()
        return Taro.request({
            url: `https://www.8hnews.com/wp-json/wp/v2/posts/${id}`, 
          })
    }
    render() {
        return (
            <View className='at-article'>
                <View className='at-article__h1'>
                    {this.state.title || '这是一级标题这是一级标题'}
                </View>
                <View className='at-article__info'>
                    {this.state.time || '2017-05-07'}
                </View>
                <View className='at-article__content'>
                    <View className='at-article__section'>
                        <View className='at-article__p'>
                            <import src='./components/wxParse/wxParse.wxml' />
                            <template is='wxParse' data='{{wxParseData:article.nodes}}'/>   
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}