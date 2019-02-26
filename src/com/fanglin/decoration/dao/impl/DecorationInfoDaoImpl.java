package com.fanglin.decoration.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.po.DecorationInfoPO;

@Repository("decorationInfoDao")
public class DecorationInfoDaoImpl extends DaoImpl<DecorationInfoPO> implements DecorationInfoDao {

	public DecorationInfoDaoImpl() {
		super(DecorationInfoPO.class);
	}

	@Override
	public DecorationInfoPO queryDecorationInfoByOrderId(String orderId) {

		return (DecorationInfoPO) session().createCriteria(DecorationInfoPO.class).add(Restrictions.eq("orderId", orderId)).uniqueResult();
	}

}
