/**
 * @File Name		: TokenDao.java
 * @Package   	: com.fanglin.common.dao
 * @Version		: 1.0
 * @Date			: 2017-6-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.factory.po.TokenPO;

public interface TokenDao extends Dao<TokenPO> {
	
	public TokenPO queryTokenByKey(String key);

}
