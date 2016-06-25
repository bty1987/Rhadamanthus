/**
 * @File Name		: AccountDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.finance.dao.AccountDao;
import com.fanglin.finance.po.AccountPO;

@Repository("accountDao")
public class AccountDaoImpl extends DaoImpl<AccountPO> implements AccountDao {
	
	public AccountDaoImpl(){
		super(AccountPO.class);
	}

	@Override
	public AccountPO merge(AccountPO accountPO) {
		return (AccountPO) financeSession().merge(accountPO);
	}

}
