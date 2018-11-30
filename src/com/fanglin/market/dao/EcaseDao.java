package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.EcasePO;
import com.fanglin.utils.Paging;

public interface EcaseDao extends Dao<EcasePO>{
	
	public List<EcasePO> pageEcase(Paging paging, List<Filter> filters);
	
	public List<EcasePO> queryEcaseByTypeAndStatus(long cityId, short status, short type);
	
}