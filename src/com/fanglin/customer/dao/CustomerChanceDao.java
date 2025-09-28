package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.utils.Paging;

public interface CustomerChanceDao extends Dao<CustomerChancePO> {

	public List<CustomerChancePO> pageCustomerChance(Paging paging, List<Filter> filters, Integer company);

	public List<CustomerChancePO> queryCustomerChance(long csid);

	public CustomerChancePO queryCustomerChance(long csid, int company);

	public CustomerChancePO queryCustomerChance(String orderId);

	public CustomerChancePO queryCustomerChanceByCno(String cno);

	public int countCustomerSchance(long csid);

}
