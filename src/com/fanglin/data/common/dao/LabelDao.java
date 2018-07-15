package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.LabelPO;
import com.fanglin.utils.Paging;

public interface LabelDao extends Dao<LabelPO> {

	public List<LabelPO> queryLabel(Short status);
	
	public List<LabelPO> pageLabel(Paging paging, List<Filter> filters);
	
}
