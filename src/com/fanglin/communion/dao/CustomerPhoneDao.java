package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.dao.Dao;

public interface CustomerPhoneDao extends Dao<CustomerPhonePO> {

	public List<CustomerPhonePO> queryCustomerPhoneByCid(Long cid, Short status);

	public List<CustomerPhonePO> queryCustomerPhoneByPhone(String phone, Short status, Integer company);

	public CustomerPhonePO queryCustomerPhoneForDefault(String phone, Integer company);

	public CustomerPhonePO queryCustomerPhone(Long cid, String phone);

	public int countCustomerPhone(String phone);

	public int clearCustomerPhoneForDefault(Long cid);

}
