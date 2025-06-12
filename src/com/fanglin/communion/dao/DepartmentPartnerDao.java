package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.DepartmentPartnerPO;
import com.fanglin.core.dao.Dao;

public interface DepartmentPartnerDao extends Dao<DepartmentPartnerPO> {

	public List<DepartmentPartnerPO> queryDepartmentPartner(int did);

	public DepartmentPartnerPO queryDepartmentPartner(int did, short type);

}
