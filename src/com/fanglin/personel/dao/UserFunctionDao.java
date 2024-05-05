package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserFunctionPO;

public interface UserFunctionDao extends Dao<UserFunctionPO> {

	public List<UserFunctionPO> queryUserFunction(Short type);

}
