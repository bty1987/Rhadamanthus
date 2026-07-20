package com.fanglin.decoration.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationMidpackDao;
import com.fanglin.decoration.po.DecorationMidpackPO;

@Repository("decorationMidpackDao")
public class DecorationMidpackDaoImpl extends DaoImpl<DecorationMidpackPO>  implements DecorationMidpackDao{
	
	public DecorationMidpackDaoImpl() {
		super();
	}

	@Override
	public DecorationMidpackPO queryDecorationMidpack(String orderId) {
		return (DecorationMidpackPO) session().createCriteria(DecorationMidpackPO.class).add(Restrictions.eq("decoration.orderId", orderId)).setMaxResults(1).uniqueResult();
	}

}
