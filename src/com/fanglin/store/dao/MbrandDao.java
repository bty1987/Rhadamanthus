package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.MbrandPO;
import com.fanglin.utils.Paging;

public interface MbrandDao extends Dao<MbrandPO> {

	public List<MbrandPO> pageMbrand(Paging paging, List<Filter> filters);
	
	public List<MbrandPO> queryMbrand(Long cid);

	public List<MbrandPO> queryMbrandByName(Paging paging, String name);

}
