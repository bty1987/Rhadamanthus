package com.fanglin.sales.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesProfileOptionDao;
import com.fanglin.sales.po.SalesProfileOptionPO;

@Repository("salesProfileOptionDao")
public class SalesProfileOptionDaoImpl extends DaoImpl<SalesProfileOptionPO> implements SalesProfileOptionDao {

	public SalesProfileOptionDaoImpl() {
		super(SalesProfileOptionPO.class);
	}

}
