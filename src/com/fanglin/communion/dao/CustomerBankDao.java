package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CustomerBankPO;
import com.fanglin.core.dao.Dao;

public interface CustomerBankDao extends Dao<CustomerBankPO> {

	public List<CustomerBankPO> queryCustomerBankByCid(long cid);

	public CustomerBankPO queryDefaultCustomerBank(long cid);

	public CustomerBankPO queryCustomerBankByBankno(String bankno);

	public int countCustomerBankByCid(long cid);

}
