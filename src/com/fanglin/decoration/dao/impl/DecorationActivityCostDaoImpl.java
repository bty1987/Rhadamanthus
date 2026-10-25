package com.fanglin.decoration.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationActivityCostDao;
import com.fanglin.decoration.po.DecorationActivityCostPO;

@Repository("decorationActivityCostDao")
public class DecorationActivityCostDaoImpl extends DaoImpl<DecorationActivityCostPO> implements DecorationActivityCostDao {

	public DecorationActivityCostDaoImpl() {
		super(DecorationActivityCostPO.class);
	}

}
