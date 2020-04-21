/**
 * @File Name		: AccountDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2015-11-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.po.FccountPO;
import com.fanglin.utils.Paging;

public interface FccountDao extends Dao<FccountPO> {

	public List<FccountPO> pageAccount(Paging paging, List<Filter> filters, String condition);

	public int countAccountByCode(String oneCode, String twoCode, String thrCode);

	public int updateAccountForStatusByVId(long vId, short status);

	public int updateAccountForStatusByPeriod(String period, short status);

	public int alowAccountForPeriodByPrecut(String period, String nextPeriod);

}
