package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.AoodsCostPO;
import com.fanglin.utils.Paging;

public interface AoodsCostDao extends Dao<AoodsCostPO> {

	public List<AoodsCostPO> pageAoodsCost(Paging paging, List<Filter> filters, long aid);
	
	public int countAoodsCost(long aid, long ccid);
}
