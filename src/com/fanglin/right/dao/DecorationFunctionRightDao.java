package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.DecorationFunctionRightPO;

public interface DecorationFunctionRightDao extends Dao<DecorationFunctionRightPO> {

	public List<DecorationFunctionRightPO> queryDecorationFunctionRightByName(String name, Integer company);

	public int deleteDecorationFunctionRightByName(String name, Integer company);

}
