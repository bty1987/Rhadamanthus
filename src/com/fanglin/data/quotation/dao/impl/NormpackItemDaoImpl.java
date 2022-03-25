package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.NormpackItemPO;
import com.fanglin.data.quotation.dao.NormpackItemDao;

@Repository("normpackItemDao")
public class NormpackItemDaoImpl extends DaoImpl<NormpackItemPO> implements NormpackItemDao {

	public NormpackItemDaoImpl() {
		super(NormpackItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormpackItemPO> queryNormpackItem(long npid) {
		return session().createCriteria(NormpackItemPO.class).add(Restrictions.eq("npid", npid)).list();
	}

}
