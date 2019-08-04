package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationFunctionPO;

public interface DecorationFunctionDao extends Dao<DecorationFunctionPO> {

	public List<DecorationFunctionPO> queryDecorationFunction(Short type);
	
	public List<DecorationFunctionPO> queryDecorationFunctionByName(String name);
	
}
