package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructerDao;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("constructerDao")
public class ConstructerDaoImpl extends DaoImpl<ConstructerPO> implements
		ConstructerDao {

	public ConstructerDaoImpl() {
		super(ConstructerPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ConstructerPO> queryConstructerByOrderId(String orderId,Integer schedule) {
		Criteria c =  session()
				.createCriteria(ConstructerPO.class)
				.createAlias("user","u",Criteria.LEFT_JOIN)
				.add(Restrictions.eq(ConstructerPO.COLUMN_ORDERID_STR, orderId))
				.add(Restrictions.eq(ConstructerPO.COLUMN_STATUS_STR, (short)0));
		if (schedule != null && schedule > 0) {
			c.add(Restrictions.eq("schedule", schedule));
		}
		return c.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ConstructerPO> queryConstructerByCsId(Integer csId, Integer schedule) {
		Criteria c =  session()
				.createCriteria(ConstructerPO.class)
				.createAlias("user","u",Criteria.LEFT_JOIN)
				.add(Restrictions.eq(ConstructerPO.COLUMN_CSID_STR, csId))
				.add(Restrictions.eq(ConstructerPO.COLUMN_STATUS_STR, (short)0));
		if (schedule != null && schedule > 0) {
			c.add(Restrictions.eq("schedule", schedule));
		}
		System.out.println(c.list().size());
		return c.list();
	}

	@Override
	public ConstructerPO queryConstructerByCid(Integer cid) {
		return (ConstructerPO)session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_CID_STR,cid)).uniqueResult();
	}
}
