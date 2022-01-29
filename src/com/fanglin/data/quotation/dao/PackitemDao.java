package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PackitemPO;
import com.fanglin.utils.Paging;

public interface PackitemDao extends Dao<PackitemPO>{
	
	public List<PackitemPO> pagePackitem(Paging paging, List<Filter> filters);
	
	public List<PackitemPO> queryPackitem(short sort);
	
}
