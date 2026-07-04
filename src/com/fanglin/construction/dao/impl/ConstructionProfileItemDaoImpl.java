package com.fanglin.construction.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.construction.dao.ConstructionProfileItemDao;
import com.fanglin.construction.po.ConstructionProfileItemPO;

@Repository("constructionProfileItemDao")
public class ConstructionProfileItemDaoImpl extends DaoImpl<ConstructionProfileItemPO> implements ConstructionProfileItemDao {

	public ConstructionProfileItemDaoImpl() {
		super(ConstructionProfileItemPO.class);
	}

}
