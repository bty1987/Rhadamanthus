package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.ComplackDao;
import com.fanglin.customer.po.ComplackPO;

@Repository("complackDao")
public class ComplackDaoImpl extends DaoImpl<ComplackPO> implements ComplackDao {

	public ComplackDaoImpl() {
		super(ComplackPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ComplackPO> queryComplack(long ctid) {
		return createCriteria(ComplackPO.class).add(Restrictions.eq(ComplackPO.COLUMN_CTID_STR, ctid)).list();
	}

}
