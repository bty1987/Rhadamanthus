/**
 * @File Name		: WOpenAccessTokenDao.java
 * @Package   	: com.fanglin.common.dao
 * @Version		: 1.0
 * @Date			: 2016-6-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wechat.po.OpenAccessTokenPO;

public interface OpenAccessTokenDao extends Dao<OpenAccessTokenPO> {

	public OpenAccessTokenPO queryOpenAccessToken(String code);

	public int deleteOpenAccessToken(long operateTime);

}
