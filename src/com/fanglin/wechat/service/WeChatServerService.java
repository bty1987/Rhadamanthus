/**
 * @File Name		: WeChatServerService.java
 * @Package   	: com.fanglin.wechat.service
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信服务器配置服务接口
 */

package com.fanglin.wechat.service;

/**
 * 微信服务器配置服务
 * 用于管理微信相关服务器地址配置
 */
public interface WeChatServerService {

	/**
	 * 获取 communion 服务器地址
	 * @param communion 服务器标识（如 "test" 表示测试服务器）
	 * @return 服务器地址
	 */
	public String communion(String communion);

}
