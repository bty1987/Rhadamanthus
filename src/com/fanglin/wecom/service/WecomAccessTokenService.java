/**
 * @File Name		: WecomAccessTokenService.java
 * @Package   	: com.fanglin.wecom.service
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信 access_token 服务接口
 */

package com.fanglin.wecom.service;

import com.fanglin.wecom.vo.WecomAccessTokenVO;

public interface WecomAccessTokenService {

	/**
	 * 查询指定公司的 access_token (不会主动刷新)
	 */
	public WecomAccessTokenVO queryAccessToken(String company);

	/**
	 * 主动调用企业微信 gettoken 接口刷新并落库 access_token
	 * @return 0=成功 1=缺少 corpid/secret 配置
	 */
	public int makeAccessToken(String company);

	/**
	 * 批量刷新 0..company 全部公司的 access_token
	 */
	public int batchmakeAccessToken(String company);

	/**
	 * 清理过期 token
	 */
	public int deleteAccessTokenByOperateTime();

	/**
	 * 获取未过期的 access_token, 过期则自动刷新 (供 WecomMessageService 调用)
	 * @param company 编码后的 company 字符串
	 * @return access_token, 失败返回空串
	 */
	public String getAccessToken(String company);

}
