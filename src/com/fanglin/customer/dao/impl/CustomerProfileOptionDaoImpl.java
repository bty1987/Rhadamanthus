package com.fanglin.customer.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerProfileOptionDao;
import com.fanglin.customer.po.CustomerProfileOptionPO;

@Repository("customerProfileOptionDao")
public class CustomerProfileOptionDaoImpl extends DaoImpl<CustomerProfileOptionPO> implements CustomerProfileOptionDao {

	public CustomerProfileOptionDaoImpl() {
		super(CustomerProfileOptionPO.class);
	}

}
