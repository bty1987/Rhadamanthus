package com.fanglin.balance.dao;

import java.util.List;



import com.fanglin.balance.po.BalanceAccountPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;


public interface BalanceAccountDao extends Dao<BalanceAccountPO> {

	public List<BalanceAccountPO> pageBalanceAccount(Paging paging, List<Filter> filters);

	public List<BalanceAccountPO> queryBalanceAccount(int buid);

	public List<BalanceAccountPO> queryBalanceAccountForTeller(int company);

	public void updateBalanceAccountForRefer(long baid, long money);

	public int updateBalanceAccountForReal(long baid, long money);

	public void updateBalanceAccountForRealUncheck(long baid, long money);

}
