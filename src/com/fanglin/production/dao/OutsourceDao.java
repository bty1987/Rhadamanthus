package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.OutsourcePO;
import com.fanglin.utils.Paging;

public interface OutsourceDao extends Dao<OutsourcePO>{

	public List<OutsourcePO> pageOutsource (Paging paging, List<Filter> filter);

}