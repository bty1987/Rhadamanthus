/**
 * @File Name		: DecorationContractDaoImpl
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
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.po.DecorationContractPO;

@Repository("decorationContractDao")
public class DecorationContractDaoImpl extends DaoImpl<DecorationContractPO> implements DecorationContractDao {

	public DecorationContractDaoImpl(){
		super(DecorationContractPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationContractPO> queryDecorationContractByOrderId(String orderId){
		return session().createCriteria(DecorationContractPO.class).add(Restrictions.eq("orderId", orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationContractPO> queryDecorationContractForFlowPatrol(Short provider, List<Short> status, java.sql.Timestamp deadline, int limit){
		return session().createCriteria(DecorationContractPO.class)
			.add(Restrictions.eq("provider", provider))
			.add(Restrictions.in("status", status))
			.add(Restrictions.le("createTime", deadline))
			.addOrder(org.hibernate.criterion.Order.asc("dcid"))
			.setMaxResults(limit)
			.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationContractPO> queryDecorationContractByFlowId(Short provider, String flowId){
		return session().createCriteria(DecorationContractPO.class)
			.add(Restrictions.eq("provider", provider))
			.add(Restrictions.eq("flowId", flowId))
			.list();
	}
}
