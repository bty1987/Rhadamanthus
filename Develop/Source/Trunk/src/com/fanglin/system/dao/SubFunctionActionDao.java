package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.po.SubFunctionActionPO;
import com.fanglin.utils.Paging;

public interface SubFunctionActionDao extends Dao<SubFunctionActionPO> {
	
	public List<SubFunctionActionPO> pageSubFunctionAction(Paging paging, List<FilterVO> filters);
	
	public List<SubFunctionActionPO> querySubFunctionAction();
	
	public List<SubFunctionActionPO> querySubFunctionActionBySubFunctionId(int subFunctionId);

	public SubFunctionActionPO querySubFunctionActionByActionName(String actionName);
	
	public List<SubFunctionActionPO> querySubFunctionActionLikeName(String actionName);
	
}
