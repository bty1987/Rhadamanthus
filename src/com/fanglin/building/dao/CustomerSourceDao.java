package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.CustomerSourcePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerSourceDao extends Dao<CustomerSourcePO> {
	
	public List<CustomerSourcePO> pageCustomerSource(Paging paging, List<Filter> filters, Integer uid);
	
	public CustomerSourcePO queryCustomerSourceByNo(String no);
	
	public CustomerSourcePO checkCustomerSource(Long cid, Short type);
	
	public int countCustomerSource(Long id, Short type);

}
