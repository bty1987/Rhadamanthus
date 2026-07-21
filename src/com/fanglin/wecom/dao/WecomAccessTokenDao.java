/**
 * @File Name		: WecomAccessTokenDao.java
 * @Package   	: com.fanglin.wecom.dao
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信 access_token 数据访问接口
 */

package com.fanglin.wecom.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wecom.po.WecomAccessTokenPO;

public interface WecomAccessTokenDao extends Dao<WecomAccessTokenPO> {

	/**
	 * 查询指定公司最新的 access_token
	 */
	public WecomAccessTokenPO queryAccessToken(int company);

	/**
	 * 清理指定时间之前的过期 token
	 */
	public int deleteAccessToken(long operateTime);

	/**
	 * 清理指定公司的全部 token (用于刷新后只保留最新一条)
	 */
	public int deleteAccessTokenByCompany(int company);

}
