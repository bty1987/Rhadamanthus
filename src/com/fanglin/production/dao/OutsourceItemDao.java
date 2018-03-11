package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.OutsourceItemPO;
import com.fanglin.utils.Paging;

public interface OutsourceItemDao extends Dao<OutsourceItemPO>{

	public List<OutsourceItemPO> pageoutsourceItem (Paging paging, List<Filter> filters,Long oid);

}
