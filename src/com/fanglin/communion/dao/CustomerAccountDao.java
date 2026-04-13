package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CustomerAccountPO;
import com.fanglin.core.dao.Dao;

public interface CustomerAccountDao extends Dao<CustomerAccountPO> {

	public List<CustomerAccountPO> queryCustomerAccountByCid(long cid);

	public CustomerAccountPO queryDefaultCustomerAccount(long cid);

	public CustomerAccountPO queryCustomerAccountByBankno(String bankno);

	public int countCustomerAccountByCid(long cid);

}
