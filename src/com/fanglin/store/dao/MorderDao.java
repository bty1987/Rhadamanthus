package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.MorderPO;
import com.fanglin.utils.Paging;

public interface MorderDao extends Dao<MorderPO>{

	public List<MorderPO> pageMorder(Paging paging, List<Filter> filters);
	
}
