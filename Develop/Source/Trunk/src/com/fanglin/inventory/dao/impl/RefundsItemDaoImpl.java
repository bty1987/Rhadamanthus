package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.RefundsItemDao;
import com.fanglin.inventory.po.RefundsItemPO;

@Repository("RefundsItemDao")
public class RefundsItemDaoImpl  extends DaoImpl<RefundsItemPO> implements RefundsItemDao{

	@Override
	@SuppressWarnings("unchecked")
	public List<RefundsItemPO> queryRefundsItemBySid(long sid) {
		return session().createCriteria(RefundsItemPO.class)
				.add(Restrictions.eq(RefundsItemPO.COLUMN_SID_STR, sid))
				.list();
	}
	
}
