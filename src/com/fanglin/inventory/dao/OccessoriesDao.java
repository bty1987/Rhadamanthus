package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.utils.Paging;

public interface OccessoriesDao extends Dao<OccessoriesPO> {

	public List<OccessoriesPO> pageOccessories(Paging paging, List<Filter> filters, int company);
	
	public List<OccessoriesPO> pageOccessoriesForSupplier(Paging paging, List<Filter> filters, int uid);

}
