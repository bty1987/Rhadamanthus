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

package com.fanglin.common.dao;

import com.fanglin.common.po.TokenPO;
import com.fanglin.core.dao.Dao;

public interface TokenDao extends Dao<TokenPO> {
	
	public TokenPO queryTokenByKey(String key);

}
