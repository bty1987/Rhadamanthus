package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserCompanyPO;

public interface UserCompanyDao extends Dao<UserCompanyPO> {

	public List<UserCompanyPO> queryUserCompany(int uid);

	public UserCompanyPO queryUserCompany(int uid, int company);

	public List<UserCompanyPO> queryUserCompanyByCid(int cid);

	public int deleteUserCompany(int uid);

}
