package com.fanglin.sales.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.RefundsDao;
import com.fanglin.sales.po.RefundsPO;

@Repository("refundsDao")
public class RefundsDaoImpl extends DaoImpl<RefundsPO> implements RefundsDao{
	
	public RefundsDaoImpl(){
		super(RefundsPO.class);
	}

	@Override
	public void updateRefundsForStatusBySpid( Long spid,short status) {
		
		String sql="update sales.refunds set status = :status where spid = :spid";
		
		session().createSQLQuery(sql).setShort("status", status).setLong("spid", spid).executeUpdate();
	}
	
}
