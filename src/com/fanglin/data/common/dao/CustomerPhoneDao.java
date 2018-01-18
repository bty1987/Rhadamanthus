package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.CustomerPhonePO;

public interface CustomerPhoneDao extends Dao<CustomerPhonePO> {
	
	 public  int countCustomerPhone(String phone);
	
	 public List<CustomerPhonePO> queryCustomerPhoneByCid(Long cid, Short status);
	 
	 public List<CustomerPhonePO> queryCustomerPhoneByPhone(String phone, Short status);
	 
	 public CustomerPhonePO queryCustomerPhone(Long cid, String phone);
	 
	 public int clearCustomerPhoneForDefault(Long cid);

	
}
