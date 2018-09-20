package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.GroupPO;
import com.fanglin.utils.Paging;

public interface GroupDao extends Dao<GroupPO>{
	
	public List<GroupPO> pageGroup(Paging paging,List<Filter> filters);
	
	public GroupPO queryGroup(String opengid);

}
