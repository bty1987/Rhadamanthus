package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserRolePO;

public interface UserRoleDao extends Dao<UserRolePO> {

	public List<UserRolePO> queryUserRole(int uid);

	public int deleteUserRole(int uid);

}
