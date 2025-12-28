/**
 * @File Name		: DAccessTokenDao.java
 * @Package   	: com.fanglin.common.dao
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.dingding.po.DingTalkAccessTokenPO;

public interface DingTalkAccessTokenDao extends Dao<DingTalkAccessTokenPO> {

	public DingTalkAccessTokenPO queryAccessToken(int company);

	public int deleteAccessToken(long operateTime);

}
