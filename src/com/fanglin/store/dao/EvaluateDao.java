package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.EvaluatePO;
import com.fanglin.utils.Paging;

public interface EvaluateDao extends Dao<EvaluatePO>{
	
	public List<EvaluatePO> pageEvaluate(Paging paging, List<Filter> filters, List<Long> pids);
	
}
