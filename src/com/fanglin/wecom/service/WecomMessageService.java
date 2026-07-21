/**
 * @File Name		: WecomMessageService.java
 * @Package   	: com.fanglin.wecom.service
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信消息推送服务接口
 */

package com.fanglin.wecom.service;

/**
 * 企业微信消息推送服务
 * <p>
 * 两条推送通道:
 * <ul>
 *   <li>应用消息 (message/send): 通过自建应用 agentid 推送给指定员工</li>
 *   <li>群机器人 (webhook/send): 通过群机器人 webhook key 推送给业务群</li>
 * </ul>
 * </p>
 * <p>
 * 接收人 receiveId 约定为 ERP 员工号 (UserPO.getUserId), 企业微信通讯录 userid 必须与之相同。
 * </p>
 */
public interface WecomMessageService {

	/**
	 * 发送应用消息 - 文本卡片(含跳转)
	 * @param receiveId 接收人员工号(对应企业微信 userid)
	 * @param title 卡片标题
	 * @param description 卡片描述
	 * @param jumpUrl 点击跳转 URL, 为空则不跳转
	 * @param company 公司(明文 int)
	 * @return 0=成功, 非 0=企业微信 errcode, -1=token/配置缺失
	 */
	public int sendTextCard(String receiveId, String title, String description, String jumpUrl, int company);

	/**
	 * 发送应用消息 - 纯文本
	 * @param receiveId 接收人员工号
	 * @param content 文本内容
	 * @param company 公司(明文 int)
	 * @return 0=成功, 非 0=企业微信 errcode, -1=token/配置缺失
	 */
	public int sendText(String receiveId, String content, int company);

	/**
	 * 群机器人 - 发送文本消息
	 * @param webhookKey 群机器人 webhook key (即 URL 上 key 参数)
	 * @param content 文本内容
	 * @return 0=成功, 非 0=企业微信 errcode
	 */
	public int sendGroupText(String webhookKey, String content);

	/**
	 * 群机器人 - 发送 markdown 消息
	 * @param webhookKey 群机器人 webhook key
	 * @param markdown markdown 内容
	 * @return 0=成功, 非 0=企业微信 errcode
	 */
	public int sendGroupMarkdown(String webhookKey, String markdown);

}
