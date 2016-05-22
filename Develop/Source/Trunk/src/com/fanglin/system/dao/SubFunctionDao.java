package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.SubFunctionPO;
import com.fanglin.utils.Paging;

public interface SubFunctionDao extends Dao<SubFunctionPO> {
	
	public List<SubFunctionPO> pageSubFunction(Paging paging, String subFunctionName);
	
	public List<SubFunctionPO> querySubFunction();

	public SubFunctionPO querySubFunctionByName(String subFunctionName);

	public List<SubFunctionPO> querySubFunctionLikeName(String subFunctionName);
	
	public List<SubFunctionPO> querySubFunctionByFunctionId(int functionId);

	public SubFunctionPO querySubFunctionById(int subFunctionId);
	
}
