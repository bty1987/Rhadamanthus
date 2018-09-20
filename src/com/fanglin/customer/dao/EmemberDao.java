package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.EmemberPO;
import com.fanglin.utils.Paging;

public interface EmemberDao extends Dao<EmemberPO>{
	
	public List<EmemberPO> pageEmember(Paging paging, List<Filter> filters);

	public EmemberPO queryEmenber(String unionId);
	
}
