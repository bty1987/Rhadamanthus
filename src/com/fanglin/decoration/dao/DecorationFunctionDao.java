package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationFunctionPO;
import com.fanglin.utils.Paging;

public interface DecorationFunctionDao extends Dao<DecorationFunctionPO> {

	public List<DecorationFunctionPO> pageDecorationFunction(Paging paging, List<Filter> filters);

	public List<DecorationFunctionPO> queryDecorationFunction(Short type);

	public List<DecorationFunctionPO> queryDecorationFunctionByName(String name);

	public long countDecorationFunctionRightByDfid(long dfid);

}
