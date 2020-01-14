package com.fanglin.payment.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.ActivityReceiptDao;
import com.fanglin.payment.po.ActivityReceiptPO;

@Repository("activityReceiptDao")
public class ActivityReceiptDaoImpl extends DaoImpl<ActivityReceiptPO> implements ActivityReceiptDao {
	
	public ActivityReceiptDaoImpl(){
		super(ActivityReceiptPO.class);
	}

}
