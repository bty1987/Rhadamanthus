package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.utils.Paging;

public interface DrawLineGroupDao extends Dao<DrawLineGroupPO> {
	
	public List<DrawLineGroupPO> pageDrawLineGroup(Paging paging, List<Filter> filters);
	
	public DrawLineGroupPO queryDrawLineGroupByName(String groupName) ;
	
	public DrawLineGroupPO queryDrawLineGroupById(long gid) ;
	
	public List<DrawLineGroupPO> queryDrawLineGroup();
	
}
