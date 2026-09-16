package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.CrossCompanyRightPO;

public interface CrossCompanyRightDao extends Dao<CrossCompanyRightPO> {

	public List<CrossCompanyRightPO> queryCrossCompanyRight(int uid);

	public CrossCompanyRightPO queryCrossCompanyRight(String userId, String module);

	public void addCrossCompanyRight(CrossCompanyRightPO crossCompanyRightPO);

	public void deleteCrossCompanyRight(int uid);

	public void deleteCrossCompanyRight(int uid, String module);
}
