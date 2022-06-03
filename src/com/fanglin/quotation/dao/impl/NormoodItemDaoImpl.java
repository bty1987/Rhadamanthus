package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.po.NormoodItemPO;

@Repository("quotationNormoodItemDao")
public class NormoodItemDaoImpl extends DaoImpl<NormoodItemPO> implements NormoodItemDao {

	public NormoodItemDaoImpl() {
		super(NormoodItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormoodItemPO> queryNormoodItem(long qid) {
		return createCriteria(NormoodItemPO.class).add(Restrictions.eq("qid", qid)).list();
	}

}
