package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.ComplaintDao;
import com.fanglin.customer.po.ComplaintPO;

@Repository("complaintDao")
public class ComplaintDaoImpl extends DaoImpl<ComplaintPO> implements ComplaintDao {

	public ComplaintDaoImpl() {
		super(ComplaintPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ComplaintPO> queryComplaint(long cid) {
		
		return createCriteria(ComplaintPO.class).add(Restrictions.eq(ComplaintPO.COLUMN_CID_STR, cid)).list();
	}
}
