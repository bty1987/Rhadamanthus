var config = {
	versionCode: "1.5.004",
	system: 1,
	uploadTimeout: 30,
	quotationLimitDiscount: 8.8,
	timeout: 30,
	
	name: '方林信息平台',
	ename: 'Fanglin Information Platform',
	company: 2952158214, // 1918: 8541268764 , ehome: 2153458453
	companyName: '方林装饰',
	companyFullName: '辽宁方林装饰工程有限公司',
	companyAddr: '沈阳市铁西区兴华北街30号',
	
	prefix: '', // 使用在获取二维码路径
	iconImg: './images/icon_fanglin.png',
	backgroundImg: './images/bg_fanglin.jpg',
	shakingColor: '#197bb5', // 1918: #892f89 , ehome: #3d677c
	
	host: 'http://192.168.5.21/',
	server: 'http://192.168.5.21/',
    media: 'http://192.168.5.21/Demeter/',
    dmedia: 'http://static.dingtalk.com/media/',
    communion: 'http://192.168.5.23/',
};

$(function(){
	
	if(!location.hostname.startsWith('192.168')){
		config.host = 'http://61.161.185.22/';
		config.server = 'http://61.161.185.22/';
		config.media = 'http://61.161.185.22/';
		config.dmedia = 'http://static.dingtalk.com/media/';
		config.communion = 'http://61.161.185.22:30001/';
	}
	
});