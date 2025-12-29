/**
 * @File Name		: WeChatMessageService.java
 * @Package   	: com.fanglin.wechat.service
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信消息服务接口
 */

package com.fanglin.wechat.service;

/**
 * 微信消息服务接口 用于发送微信模板消息（支付通知、服务进度通知等）
 */
public interface WeChatMessageService {

	/**
	 * 发送服务进度通知消息（不含路径）
	 * 
	 * @param unionId 微信用户 UnionID
	 * @param name 业务名称
	 * @param orderId 订单ID
	 * @param content 消息内容
	 * @return 处理结果码
	 */
	public int sendServiceSchedule(String unionId, String name, String orderId, String content);

	/**
	 * 发送服务进度通知消息（含路径）
	 * 
	 * @param unionId 微信用户 UnionID
	 * @param name 业务名称
	 * @param orderId 订单ID
	 * @param content 消息内容
	 * @param path 跳转路径（URL 或小程序路径）
	 * @return 处理结果码
	 */
	public int sendServiceSchedule(String unionId, String name, String orderId, String content, String path);

	/**
	 * 发送支付通知消息（直接调用微信 API）
	 * 
	 * @param unionId 微信用户 UnionID
	 * @param name 业务名称
	 * @param orderId 订单ID
	 * @param money 金额字符串
	 * @param comment 备注信息
	 * @return 处理结果码
	 */
	public int sendPayment(String unionId, String name, String orderId, String money, String comment);

	/**
	 * 发送通知消息（直接调用微信 API）
	 * 
	 * @param unionId 微信用户 UnionID
	 * @param name 联系人姓名
	 * @param phone 联系电话
	 * @param content 通知内容
	 * @param url 跳转 URL（可选）
	 * @param miniprogram 小程序路径（可选）
	 * @return 处理结果码
	 */
	public int sendNotice(String unionId, String name, String phone, String content, String url, String miniprogram);

}
