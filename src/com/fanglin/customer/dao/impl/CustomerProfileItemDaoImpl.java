package com.fanglin.customer.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerProfileItemDao;
import com.fanglin.customer.po.CustomerProfileItemPO;

@Repository("customerProfileItemDao")
public class CustomerProfileItemDaoImpl extends DaoImpl<CustomerProfileItemPO> implements CustomerProfileItemDao {

	public CustomerProfileItemDaoImpl() {
		super(CustomerProfileItemPO.class);
	}

}
