/**
 * @File Name		: TokenDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-6-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.factory.dao.TokenDao;
import com.fanglin.factory.po.TokenPO;

@Repository("tokenDao")
public class TokenDaoImpl extends DaoImpl<TokenPO> implements TokenDao {
	
	public TokenDaoImpl(){
		super(TokenPO.class);
	}
	
	@Override
	public TokenPO queryTokenByKey(String key) {
		return (TokenPO) session().createCriteria(TokenPO.class).add(Restrictions.eq(TokenPO.COLUMN_KEY_STR, key)).add(Restrictions.eq(TokenPO.COLUMN_STATUS_STR, TokenPO.STATUS_ENABLE_INT)).uniqueResult();
	}

}
