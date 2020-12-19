package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.material.dao.PriceDao;
import com.fanglin.data.po.PricePO;


@Repository("priceDao")
public class PriceDaoImpl extends DaoImpl<PricePO> implements PriceDao {

	public PriceDaoImpl() {
		super(PricePO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PricePO> queryPriceByGid(long gid, Short status) {
		
		Criteria criteria = session().createCriteria(PricePO.class).add(Restrictions.eq(PricePO.COLUMN_GID_STR, gid));
		
		if (status != null){
			criteria.add(Restrictions.eq(PricePO.COLUMN_STATUS_STR, status));
		}
		
		return criteria.list();
	}

	@Override
	public PricePO queryPriceByPid(long pid) {
		return (PricePO) session().createCriteria(PricePO.class).add(Restrictions.eq(PricePO.COLUMN_PID_STR, pid)).uniqueResult();
	}

}
