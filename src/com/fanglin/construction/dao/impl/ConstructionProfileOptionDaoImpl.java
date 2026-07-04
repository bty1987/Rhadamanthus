package com.fanglin.construction.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.construction.dao.ConstructionProfileOptionDao;
import com.fanglin.construction.po.ConstructionProfileOptionPO;

@Repository("constructionProfileOptionDao")
public class ConstructionProfileOptionDaoImpl extends DaoImpl<ConstructionProfileOptionPO> implements ConstructionProfileOptionDao {

	public ConstructionProfileOptionDaoImpl() {
		super(ConstructionProfileOptionPO.class);
	}

}
