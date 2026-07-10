package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.ConstructionFunctionRightPO;

public interface ConstructionFunctionRightDao extends Dao<ConstructionFunctionRightPO> {

	public List<ConstructionFunctionRightPO> queryConstructionFunctionRightByName(String name, Integer company);

	public void syncConstructionFunctionRight(String name, List<Integer> cids, Integer company);

	public int deleteConstructionFunctionRightByName(String name, Integer company);

	public void deleteConstructionFunctionRight(String name, List<Integer> cids);

}
