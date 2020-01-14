package com.fanglin.balance.dao;

import java.util.List;



import com.fanglin.balance.po.AccountPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;


public interface AccountDao extends Dao<AccountPO> {
	
	public List<AccountPO> pageAccount(Paging paging, List<Filter> filters);
	
	public List<AccountPO> queryAccount(int buid);
	
	public List<AccountPO> queryAccountForTeller(int company);

}
