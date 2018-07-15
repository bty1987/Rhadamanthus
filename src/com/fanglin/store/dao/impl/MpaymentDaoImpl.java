package com.fanglin.store.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.MpaymentDao;
import com.fanglin.store.po.MpaymentPO;

@Repository("MpaymentDao")
public class MpaymentDaoImpl extends DaoImpl<MpaymentPO> implements MpaymentDao{

	public MpaymentDaoImpl(){
		super(MpaymentPO.class);
	}
	
}
