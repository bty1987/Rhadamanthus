package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.FunctionPO;
import com.fanglin.utils.Paging;

public interface FunctionDao extends Dao<FunctionPO> {

	public List<FunctionPO> pageFunction(Paging paging, String FunctionName);

	public List<FunctionPO> queryFuctionByModuleId(int moduleId);
}
