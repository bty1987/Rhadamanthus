package com.fanglin.production.dao;


import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.TranpackPO;
import com.fanglin.utils.Paging;

public interface TranpackDao extends Dao<TranpackPO> {

	public List<TranpackPO> pageTranpack(Paging paging, List<Filter> filters);

	public List<TranpackPO> queryTranpackByPid(Long pid);
	
	public int countTranpackByRid(Long rid);
	
	public int countTranpackByPid(Long pid,Short status,Long tid);

	public int updateTranpack(Long pid, Short status);

	public int countTranpackByPid(Long pid, Short status);
}