package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesActivityRecordDao;
import com.fanglin.sales.po.SalesActivityRecordPO;

@Repository("salesActivityRecordDao")
public class SalesActivityRecordDaoImpl extends DaoImpl<SalesActivityRecordPO> implements SalesActivityRecordDao {

	public SalesActivityRecordDaoImpl() {
		super(SalesActivityRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesActivityRecordPO> querySalesActivityRecord(long saiid) {
		return session().createCriteria(SalesActivityRecordPO.class).add(Restrictions.eq("salesActivityItem.saiid", saiid)).list();
	}

}
