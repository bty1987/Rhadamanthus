package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.UserFunctionRightPO;

public interface UserFunctionRightDao extends Dao<UserFunctionRightPO> {

	public List<UserFunctionRightPO> queryUserFunctionRight(String name);

	public int deleteUserFunctionRightByName(String name);

}
