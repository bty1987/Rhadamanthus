package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.VrecordDao;
import com.fanglin.customer.po.VrecordPO;

@Repository("vrecordDao")
public class VrecordDaoImpl extends DaoImpl<VrecordPO> implements VrecordDao {

	public VrecordDaoImpl() {
		super(VrecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<VrecordPO> queryVrecordByVid(long vid) {
		return session().createCriteria(VrecordPO.class).add(Restrictions.eq(VrecordPO.COLUMN_VID_STRING, vid)).list();
	}

}
