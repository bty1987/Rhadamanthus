package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.NormricePO;
import com.fanglin.data.quotation.dao.NormriceDao;

@Repository("normriceDao")
public class NormriceDaoImpl extends DaoImpl<NormricePO> implements NormriceDao{

	public NormriceDaoImpl() {
		super(NormricePO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<NormricePO> queryNormriceByQiid(Long qiid) {
		return createCriteria(NormricePO.class).createAlias("quotationItem", "quotationItem").add(Restrictions.eq(NormricePO.COLUMN_QIID_STR, qiid)).list();
	}
	
}
