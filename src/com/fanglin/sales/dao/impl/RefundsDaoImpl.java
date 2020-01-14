package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.RefundsDao;
import com.fanglin.sales.po.RefundsPO;

@Repository("refundsDao")
public class RefundsDaoImpl extends DaoImpl<RefundsPO> implements RefundsDao{
	
	public RefundsDaoImpl(){
		super(RefundsPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<RefundsPO> queryRefundsBySid(Long sid) {
		
		return createCriteria(RefundsPO.class).add(Restrictions.eq(RefundsPO.COLUMN_SID_STR, sid)).list();
		
	}
	
	@Override
	public void updateRefundsForStatusBySpid( Long spid,short status) {
		
		String sql="update sales.refunds set status = :status where spid = :spid";
		
		session().createSQLQuery(sql).setShort("status", status).setLong("spid", spid).executeUpdate();
	}
	
}
