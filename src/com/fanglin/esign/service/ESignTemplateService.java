package com.fanglin.esign.service;

import com.fanglin.core.interceptor.FLException;

/**
 * e签宝流程模板免登维护 Service。
 *
 * <p>Action 不得直调 DAO(web.xml 无 OpenSessionInView, Action 层无事务 session),
 * 配置读取与 e签宝端点调用统一下沉本层(@Transactional 绑定 session)。
 */
public interface ESignTemplateService {

	/**
	 * 获取《创建流程模板》免登页面链接(无需登录, 有效期30分钟)。
	 *
	 * @param redirectUrl 创建完成后 e签宝重定向回的站内落点页绝对地址
	 * @return signTemplateCreateUrl
	 */
	String querySignTemplateCreateUrl(String redirectUrl) throws FLException;

	/**
	 * 停用指定流程模板并获取《编辑流程模板》免登页面链接(官方编辑流程: 先停用再编辑)。
	 *
	 * @param signTemplateId 流程模板ID
	 * @param redirectUrl 编辑完成后 e签宝重定向回的站内落点页绝对地址
	 * @return signTemplateEditUrl
	 */
	String querySignTemplateEditUrl(String signTemplateId, String redirectUrl) throws FLException;

	/**
	 * 重新开启流程模板(编辑落点页自动调用)。
	 *
	 * @param signTemplateId 流程模板ID
	 */
	void enableSignTemplate(String signTemplateId) throws FLException;

	/**
	 * 读取 systemconfig 单值(事务内, 供无事务上下文的调用方使用)。
	 *
	 * @param key 配置键
	 * @return 配置值, 缺失返回 null
	 */
	String queryConfigValue(String key) throws FLException;

}
