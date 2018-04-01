package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.VrecordPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface VrecordDao extends Dao<VrecordPO>{
	
	public List<VrecordPO> queryVrecordByVid(Paging paging, List<Filter> filters);
	
}
