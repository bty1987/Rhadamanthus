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
import com.fanglin.decoration.po.DecorationBelongInfoPO;

@Repository("orderBelongInfoDao")
public class DecorationBelongDaoImpl extends DaoImpl<DecorationBelongInfoPO> implements DecorationBelongDao {

	public DecorationBelongDaoImpl(){
		super(DecorationBelongInfoPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongInfoPO> queryOrderBelongInfoByOrderIdAType(String orderId,String belongType){
		 return createCriteria(DecorationBelongInfoPO.class)
				 .add(Restrictions.eq("decorationOrderPO.orderId", orderId))
				 .add(Restrictions.eq("belongType", belongType))
				 .add(Restrictions.eq("status", DecorationBelongInfoPO.STATUS_APPLY_STR))
				 .list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongInfoPO> queryOrderBelongInfoForCurrentByOrderIdAType(String orderId,String belongType){
		 return createCriteria(DecorationBelongInfoPO.class)
				 .add(Restrictions.eq("decorationOrderPO.orderId", orderId))
				 .add(Restrictions.eq("belongType", belongType))
				 .add(Restrictions.eq("status", DecorationBelongInfoPO.STATUS_PASS_STR))
				 .list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongInfoPO> queryOrderBelongInfoByOrderId(String orderId){
		return createCriteria(DecorationBelongInfoPO.class)
				 .add(Restrictions.eq("decorationOrderPO.orderId", orderId))
				 .add(Restrictions.eq("status", DecorationBelongInfoPO.STATUS_PASS_STR))
				 .list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongInfoPO> queryOrderBelongInfoByOrderIds(List<String> orderIds) {
		return session().createCriteria(DecorationBelongInfoPO.class).add(Restrictions.in("decorationOrderPO.orderId", orderIds)).add(Restrictions.ne("status", DecorationBelongInfoPO.STATUS_REPLACE_STR)).list();
	}

	@Override
	public int changeOrderBelongInfoForOrderId(String newOrderId, String oldOrderId) {
		
		String sql = "update platform.orderbelonginfo set orderId=:newOrderId where orderId=:oldOrderId";
	    
	    session().createSQLQuery(sql).setString("newOrderId", newOrderId).setString("oldOrderId", oldOrderId).executeUpdate();
		
		return 0;
	}
}
