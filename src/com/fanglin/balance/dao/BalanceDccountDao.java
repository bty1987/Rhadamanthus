package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceDccountPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;


public interface BalanceDccountDao extends Dao<BalanceDccountPO> {

	public List<BalanceDccountPO> pageBalanceDccount(Paging paging, List<Filter> filters);

	public List<BalanceDccountPO> queryBalanceDccount(int buid);

	public void updateBalanceDccountForSurplus(long bdid, long money);

}
