package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ContractPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ContractDao extends Dao<ContractPO> {

	public List<ContractPO> pageContract(Paging paging, List<Filter> filters, int company);
	
}
