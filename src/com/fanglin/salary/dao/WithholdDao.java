package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.WithholdPO;
import com.fanglin.utils.Paging;

public interface WithholdDao extends Dao<WithholdPO>{
	
	public List<WithholdPO> pageWithhold(Paging paging, List<Filter> filters);
	
	public List<WithholdPO> queryWithhold(long ident, short type);

}
