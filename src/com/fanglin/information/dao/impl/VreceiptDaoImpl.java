package com.fanglin.information.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.VreceiptDao;
import com.fanglin.information.po.VreceiptPO;

@Repository("vreceiptDao")
public class VreceiptDaoImpl extends DaoImpl<VreceiptPO> implements VreceiptDao {
	
	public VreceiptDaoImpl(){
		super(VreceiptPO.class);
	}

}
