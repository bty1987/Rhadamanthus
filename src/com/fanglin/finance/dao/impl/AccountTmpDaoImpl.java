/**
 * @File Name		: AccountTmpDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-4-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.finance.dao.AccountTmpDao;
import com.fanglin.finance.po.AccountTmpPO;

@Repository("accountTmpDao")
public class AccountTmpDaoImpl extends DaoImpl<AccountTmpPO> implements AccountTmpDao {
	
	public AccountTmpDaoImpl(){
		super(AccountTmpPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AccountTmpPO> queryAccountTmpByAtIds(List<Long> atIds) {
		return session().createCriteria(AccountTmpPO.class).add(Restrictions.in(AccountTmpPO.COLUMN_ATID_STR, atIds)).list();
	}

	@Override
	public AccountTmpPO queryAccountTmpByAId(long aId) {
		return (AccountTmpPO) session().createCriteria(AccountTmpPO.class).add(Restrictions.eq(AccountTmpPO.COLUMN_AID_STR, aId)).setMaxResults(1).uniqueResult();
	}

}
