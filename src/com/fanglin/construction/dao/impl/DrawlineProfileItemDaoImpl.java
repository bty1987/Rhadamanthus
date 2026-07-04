package com.fanglin.construction.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.construction.dao.DrawlineProfileItemDao;
import com.fanglin.construction.po.DrawlineProfileItemPO;

@Repository("drawlineProfileItemDao")
public class DrawlineProfileItemDaoImpl extends DaoImpl<DrawlineProfileItemPO> implements DrawlineProfileItemDao {

	public DrawlineProfileItemDaoImpl() {
		super(DrawlineProfileItemPO.class);
	}

}
