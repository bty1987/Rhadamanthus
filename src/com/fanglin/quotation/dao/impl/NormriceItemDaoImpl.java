package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.po.NormriceItemPO;

@Repository("quotationNormriceItemDao")
public class NormriceItemDaoImpl extends DaoImpl<NormriceItemPO> implements NormriceItemDao {

	public NormriceItemDaoImpl() {
		super(NormriceItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormriceItemPO> queryNormriceItem(long qid) {
		return createCriteria(NormriceItemPO.class).add(Restrictions.eq("qid", qid)).list();
	}
}
