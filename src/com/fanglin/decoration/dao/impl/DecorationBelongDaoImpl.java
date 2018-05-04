/**
 * @File Name		: OrderBelongInfoDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationBelongPO;

@Repository("orderBelongInfoDao")
public class DecorationBelongDaoImpl extends DaoImpl<DecorationBelongPO> implements DecorationBelongDao {

	public DecorationBelongDaoImpl(){
		super(DecorationBelongPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryOrderBelongInfoByOrderIdAType(String orderId,Short belongType){
		 return createCriteria(DecorationBelongPO.class)
				 .add(Restrictions.eq("orderId", orderId))
				 .add(Restrictions.eq("type", belongType))
				 .add(Restrictions.eq("status", DecorationBelongPO.STATUS_INVALID_INT))
				 .list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryOrderBelongInfoForCurrentByOrderIdAType(String orderId,Short belongType){
		 return createCriteria(DecorationBelongPO.class)
				 .add(Restrictions.eq("orderId", orderId))
				 .add(Restrictions.eq("type", belongType))
				 .add(Restrictions.eq("status", DecorationBelongPO.STATUS_INVALID_INT))
				 .list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryOrderBelongInfoByOrderId(String orderId){
		return createCriteria(DecorationBelongPO.class)
				 .add(Restrictions.eq("orderId", orderId))
				 .add(Restrictions.eq("status", DecorationBelongPO.STATUS_INVALID_INT))
				 .list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryOrderBelongInfoByOrderIds(List<String> orderIds) {
		return session().createCriteria(DecorationBelongPO.class).add(Restrictions.in("orderId", orderIds)).add(Restrictions.ne("status", DecorationBelongPO.STATUS_EFFCTIVE_INT)).list();
	}

	@Override
	public int changeOrderBelongInfoForOrderId(String newOrderId, String oldOrderId) {
		
		String sql = "update decoration.decorationbelong set orderId=:newOrderId where orderId=:oldOrderId";
	    
	    session().createSQLQuery(sql).setString("newOrderId", newOrderId).setString("oldOrderId", oldOrderId).executeUpdate();
		
		return 0;
	}
}
