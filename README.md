# multiread-my first javascript project

The project “multiread” bases on Wechat Miniprogram platform and Tencent Cloud. It is a reading app for Chinese students who want to improve their reading skills in English, German and French. It is built up by three pages: the main page (index), the reading page and the user page.

The project aim is to practice Javascript and learn basic knowledge of server-less APP.  

## Install

Wechat develop tool and Tencent Cloud & Wechat account. Without Wechat account, it is impossible to test:(

## Usage

The main page shows lists of reading articles and includes search function as well as notice on the top. 

If the user clicks one article, it will turn to the reading page. You can play or stop the audio all the time. The article is demonstrated bilingually. The translation can be hidden. Interesting articles and new words can be marked in the reading list. After reading, the program will records the reading time and words. Attention, only the data from users giving permission of authorization can be recorded.

In the user page, you can find the marked articles, new words lists (which can be downloaded as Excel to the cellphone.), reading data, reading calendar and contact form. You also can delete your data and cancel the authorization in this page.

![multiread](https://github.com/Huiming-Liu/wx_multiread/blob/main/multiread.gif)


### Problem

The WX miniprogram depends heavily on wechat environment. The current project has two issues:

1. The reading charts can only be showed in android, not in IOS and Windows. The reason may be that the Wechat IOS & Windows version do not support canvas element.
2. The project can only be tested in debug modus. Data from Tencent Cloud cannot be showed in public version. So far the reason is unknown.

## Contributing

Thanks for a lot of online-bloggers from whom I learned basic knowledge about WX miniprogram framework. The components calendar, tag cloud and video are respectively programmed by gating (https://github.com/GATING), 爱上大树的小猪 and yilingsj（315800015@qq.com）

## License

Apache License 2.0 
