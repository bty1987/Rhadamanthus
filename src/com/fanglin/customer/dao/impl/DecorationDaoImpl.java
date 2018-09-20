package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.po.DecorationPO;

@Repository("decorationOrderDao")
public class DecorationDaoImpl extends DaoImpl<DecorationPO> implements DecorationDao{
	
	public DecorationDaoImpl(){
		super(DecorationPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DecorationPO> queryCusDecoration(String unionId) {
		return createCriteria(DecorationPO.class).add(Restrictions.eq(DecorationPO.COLUMN_UNIONID_STR, unionId)).list();
	}

	@Override
	public DecorationPO queryCusDecorationByOrderId(String orderId,String unionId) {
		return (DecorationPO) createCriteria(DecorationPO.class).add(Restrictions.eq(DecorationPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(DecorationPO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}

	@Override
	public DecorationPO queryCusDecorationForDefault(String unionId) {
		return (DecorationPO) createCriteria(DecorationPO.class).add(Restrictions.eq(DecorationPO.COLUMN_UNIONID_STR, unionId)).add(Restrictions.eq(DecorationPO.COLUMN_DEFAULTFLAG_STR, DecorationPO.DEFAULTFLAG_DEFAULT_SHORT)).uniqueResult();
	}

	@Override
	public void deleteCusDecorationByUnionId(String unionId) {
		
		String sql = "delete from customer.decoration where unionId = :unionId";
		
		session().createSQLQuery(sql).setString(DecorationPO.COLUMN_UNIONID_STR, unionId).executeUpdate();
		
	}

}
