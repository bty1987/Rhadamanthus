package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.CustomerSourceRightPO;

public interface CustomerSourceRightDao extends Dao<CustomerSourceRightPO> {

	public List<CustomerSourceRightPO> queryCustomerSourceRightByUserId(int uid,int company);
	
	public void deleteCustomerSourceRightByUid(int uid,int company);
	
}
