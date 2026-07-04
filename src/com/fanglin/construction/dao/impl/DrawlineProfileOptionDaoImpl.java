package com.fanglin.construction.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.construction.dao.DrawlineProfileOptionDao;
import com.fanglin.construction.po.DrawlineProfileOptionPO;

@Repository("drawlineProfileOptionDao")
public class DrawlineProfileOptionDaoImpl extends DaoImpl<DrawlineProfileOptionPO> implements DrawlineProfileOptionDao {

	public DrawlineProfileOptionDaoImpl() {
		super(DrawlineProfileOptionPO.class);
	}

}
