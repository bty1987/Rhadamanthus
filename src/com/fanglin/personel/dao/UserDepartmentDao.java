package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserDepartmentPO;

public interface UserDepartmentDao extends Dao<UserDepartmentPO> {

	public List<UserDepartmentPO> queryUserDepartment(int uid);

	public int deleteUserDepartment(int uid);

}
