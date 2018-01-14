package com.fanglin.data.common.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.ChainPageDao;
import com.fanglin.data.po.ChainPagePO;

@Repository("chainPageDao")
public class ChainPageDaoImpl extends DaoImpl<ChainPagePO> implements  ChainPageDao{

	public ChainPageDaoImpl(){
		super(ChainPagePO.class);
	}
}
