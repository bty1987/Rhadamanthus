package com.fanglin.dingding.service;

import com.fanglin.core.interceptor.FLException;

/**
 * 钉钉消息服务接口
 */
public interface DingTalkMessageService {

	/**
	 * 发送消息
	 * @param receiveId 接收人ID
	 * @param senderName 发送人名称
	 * @param contents 消息内容
	 * @param aimid 目标ID
	 * @param company 公司ID
	 * @return 发送结果
	 * @throws FLException 异常
	 */
	public short sendMessage(String receiveId, String senderName, String contents, Long aimid, int company) throws FLException;

	/**
	 * 发送钉钉
	 * @param receiveId 接收人ID
	 * @param contents 消息内容
	 * @param company 公司ID
	 * @return 发送结果
	 * @throws FLException 异常
	 */
	public int sendDing(String receiveId, String contents, int company) throws FLException;

	/**
	 * 发送消息（使用accessToken）
	 * @param accessToken 访问令牌
	 * @param message 消息内容
	 * @return 发送结果
	 */
	public int sendMessage(String accessToken, String message);

	/**
	 * 发送链接消息
	 * @param accessToken 访问令牌
	 * @param title 标题
	 * @param content 内容
	 * @param jump 跳转配置key
	 * @param company 公司ID
	 * @param args 跳转URL参数
	 * @return 发送结果
	 */
	public int sendLink(String accessToken, String title, String content, String jump, Integer company, Object... args);

}
