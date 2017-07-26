var subpages = ['index.html','my_task_start.html','force_distribution_groupSend.html','user.html'];// 修改对应图标连接的地址，记住需要对应
var subpage_style = {
    top: '0px',
    bottom: '50px',
    scrollIndicator: "none" ,// 当你的界面的内容足够多的时候，会出现滚动条，这个是隐藏滚动条
};
             
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function(){
    //获得当前页面
    var self = plus.webview.currentWebview();
    //循环创建子页面
    for(var i=0;i<subpages.length;i++){
        var sub = plus.webview.create(subpages[i],subpages[i],subpage_style);
        var sub = plus.webview.create(
            'index1.html', // 默认显示页面
            'index1.html',{
    top: '50px',
    bottom: '50px',
    scrollIndicator: "none" ,// 当你的界面的内容足够多的时候，会出现滚动条，这个是隐藏滚动条
});
        if(i>0){
            sub.hide();
        }
        self.append(sub);
    }
});
             
             
//当前激活选项卡
var activeTab = subpages[0];
             
//选项卡点击事件
mui('.mui-bar-tab').on('tap', 'a', function(e) {
    var targetTab = this.getAttribute('href');
    if (targetTab == activeTab) {
            return;
    }
    //显示目标选项卡
    plus.webview.show(targetTab);
    //隐藏当前;
    plus.webview.hide(activeTab);
    //更改当前活跃的选项卡
    activeTab = targetTab;
});
             
//自定义事件，模拟点击“首页选项卡”
document.addEventListener('gohome',function () {
    var defaultTab = document.getElementById("defaultTab");
    //模拟首页点击
    mui.trigger(defaultTab,'tap');
    //切换选项卡高亮
    var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
    if(defaultTab!==current){
        current.classList.remove('mui-active');
        defaultTab.classList.add('mui-active');
    }
});