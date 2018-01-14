package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.RefundsItemDao;
import com.fanglin.sales.po.RefundsItemPO;

@Repository("RefundsItemDao")
public class RefundsItemDaoImpl  extends DaoImpl<RefundsItemPO> implements RefundsItemDao{
	
	public RefundsItemDaoImpl(){
		super(RefundsItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RefundsItemPO> queryRefundsItemBySid(long sid) {
		return session().createCriteria(RefundsItemPO.class).add(Restrictions.eq(RefundsItemPO.COLUMN_SID_STR, sid)).list();
	}
	
}
