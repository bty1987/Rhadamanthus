/**
 * @File Name		: DecorationBelongDaoImpl
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
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationBelongPO;

@Repository("DecorationBelongDao")
public class DecorationBelongDaoImpl extends DaoImpl<DecorationBelongPO> implements DecorationBelongDao {

	public DecorationBelongDaoImpl() {
		super(DecorationBelongPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryDecorationBelongByOrderIdAType(String orderId, Short belongType) {
		return createCriteria(DecorationBelongPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("type", belongType)).add(Restrictions.eq("status", DecorationBelongPO.STATUS_INVALID_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryDecorationBelongForCurrentByOrderIdAType(String orderId, Short belongType) {
		return createCriteria(DecorationBelongPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("type", belongType)).add(Restrictions.eq("status", DecorationBelongPO.STATUS_INVALID_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryDecorationBelongByOrderId(String orderId) {
		return createCriteria(DecorationBelongPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("status", DecorationBelongPO.STATUS_INVALID_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryDecorationBelongByOrderIds(List<String> orderIds) {
		return session().createCriteria(DecorationBelongPO.class).add(Restrictions.in("orderId", orderIds)).add(Restrictions.ne("status", DecorationBelongPO.STATUS_EFFCTIVE_INT)).list();
	}

	@Override
	public int changeDecorationBelongForOrderId(String newOrderId, String oldOrderId) {

		String sql = "update decoration.decorationbelong set orderId=:newOrderId where orderId=:oldOrderId";
		session().createSQLQuery(sql).setString("newOrderId", newOrderId).setString("oldOrderId", oldOrderId).executeUpdate();

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationBelongStatusByOrderId(String orderId, Short status) {
		
		String sql = "update decoration.decorationbelong set status=:status where orderId=:orderId";
		session().createSQLQuery(sql).setString("orderId", orderId).setShort("status", status).executeUpdate();
		
		return 0;
	}
}
