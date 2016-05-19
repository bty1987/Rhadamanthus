/**
 * @File Name		: OrderBelongInfoDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.OrderBelongInfoDao;
import com.fanglin.decoration.po.OrderBelongInfoPO;

@Repository("orderBelongInfoDao")
public class OrderBelongInfoDaoImpl extends DaoImpl<OrderBelongInfoPO> implements OrderBelongInfoDao {

	public OrderBelongInfoDaoImpl(){
		super(OrderBelongInfoPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<OrderBelongInfoPO> queryOrderBelongInfoByOrderIdAType(String orderId,String belongType){
		 return createCriteria(OrderBelongInfoPO.class)
				 .add(Restrictions.eq("decorationOrderPO.orderId", orderId))
				 .add(Restrictions.eq("belongType", belongType))
				 .add(Restrictions.eq("status", OrderBelongInfoPO.STATUS_APPLY_STR))
				 .list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<OrderBelongInfoPO> queryOrderBelongInfoForCurrentByOrderIdAType(String orderId,String belongType){
		 return createCriteria(OrderBelongInfoPO.class)
				 .add(Restrictions.eq("decorationOrderPO.orderId", orderId))
				 .add(Restrictions.eq("belongType", belongType))
				 .add(Restrictions.eq("status", OrderBelongInfoPO.STATUS_PASS_STR))
				 .list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OrderBelongInfoPO> queryOrderBelongInfoByOrderId(String orderId){
		return createCriteria(OrderBelongInfoPO.class)
				 .add(Restrictions.eq("decorationOrderPO.orderId", orderId))
				 .add(Restrictions.eq("status", OrderBelongInfoPO.STATUS_PASS_STR))
				 .list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OrderBelongInfoPO> queryOrderBelongInfoByOrderIds(List<String> orderIds) {
		return session().createCriteria(OrderBelongInfoPO.class).add(Restrictions.in("decorationOrderPO.orderId", orderIds)).add(Restrictions.ne("status", OrderBelongInfoPO.STATUS_REPLACE_STR)).list();
	}
}
