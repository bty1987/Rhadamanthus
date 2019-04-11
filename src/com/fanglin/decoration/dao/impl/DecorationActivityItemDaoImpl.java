/**
 * @File Name		: DecorationActivityItemDaoImpl.java
 * @Package   	: com.fanglin.decoration.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;

@Repository("decorationActivityItemDao")
public class DecorationActivityItemDaoImpl extends DaoImpl<DecorationActivityItemPO> implements DecorationActivityItemDao {
	
	public DecorationActivityItemDaoImpl(){
		super(DecorationActivityItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityItemPO> queryDecorationActivityItemByOrderId(String orderId) {
		return session().createCriteria(DecorationActivityItemPO.class).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityItemPO> queryDecorationActivityItemForCouponAVaildByOrderId(String orderId) {
		return session().createCriteria(DecorationActivityItemPO.class)
				.add(Restrictions.eq(DecorationActivityItemPO.COLUMN_ORDERID_STR, orderId))
				.add(Restrictions.eq(DecorationActivityItemPO.COLUMN_TYPE_STR, DecorationActivityItemPO.TYPE_COUPON_INT))
				.add(Restrictions.eq(DecorationActivityItemPO.COLUMN_STATUS_STR, DecorationActivityItemPO.STATUS_INIT_INT))
				.list();
	}
	
	@Override
	public float amountDecorationActivityItemForIsPayment(String orderId, short isPayment) {
		
		String sql = "select COALESCE(SUM(money*num),0) as priceSum from decoration.decorationActivityitem where orderId =:orderId and type = 0 and isPayment =:isPayment";
	    SQLQuery sqlQuery = session().createSQLQuery(sql);
	    sqlQuery.addScalar("priceSum", StandardBasicTypes.FLOAT).setString("orderId", orderId).setShort("isPayment", isPayment);
	    
	    return ((Float) sqlQuery.uniqueResult()).floatValue();
	}

}
