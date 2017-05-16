/**
 * @File Name		: AccountTmpDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2016-4-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.finance.po.AccountTmpPO;

public interface AccountTmpDao extends Dao<AccountTmpPO> {
	
	public List<AccountTmpPO> queryAccountTmpByAtIds(List<Long> atIds);
	
	public AccountTmpPO queryAccountTmpByAId(long aId);

}
