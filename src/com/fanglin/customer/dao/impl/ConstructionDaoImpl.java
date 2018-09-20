package com.fanglin.customer.dao.impl;


import org.springframework.stereotype.Repository;

import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.ConstructionDao;

@Repository("constructionOrderDao")
public class ConstructionDaoImpl extends DaoImpl<ConstructionPO> implements ConstructionDao {
	
	public ConstructionDaoImpl(){
		super(ConstructionPO.class);
	}

}
