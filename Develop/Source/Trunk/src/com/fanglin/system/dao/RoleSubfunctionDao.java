package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.RoleSubfunctionPO;

public interface RoleSubfunctionDao extends Dao<RoleSubfunctionPO> {

	List<RoleSubfunctionPO> findRoleSubFunctionByRoleId(String roleId);


}
