package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.quotation.dao.NormoodDao;

@Repository("normoodDao")
public class NormoodDaoImpl extends DaoImpl<NormoodPO> implements NormoodDao{

	public NormoodDaoImpl() {
		super(NormoodPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<NormoodPO> queryNormoodByQiid(Long qiid) {
		return createCriteria(NormoodPO.class).createAlias("quotationItem", "quotationItem").add(Restrictions.eq(NormoodPO.COLUMN_QIID_STR, qiid)).list();
	}

}
