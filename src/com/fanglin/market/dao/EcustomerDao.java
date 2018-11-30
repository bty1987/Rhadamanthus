package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.EcustomerPO;
import com.fanglin.utils.Paging;

public interface EcustomerDao extends Dao<EcustomerPO>{
	
	public List<EcustomerPO> pageEcustomer(Paging paging, List<Filter> filters);

}
