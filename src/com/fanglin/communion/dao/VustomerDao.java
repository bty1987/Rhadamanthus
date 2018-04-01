package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.VustomerPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface VustomerDao  extends Dao<VustomerPO> {
	
	public List<VustomerPO> pageVustomer(Paging paging, List<Filter> filters);
	
	public List<VustomerPO> queryVustomer();
	
	public List<VustomerPO> queryVustomerByIdent(String ident);
	
}
