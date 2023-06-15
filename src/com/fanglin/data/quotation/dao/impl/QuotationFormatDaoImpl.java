package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.QuotationFormatPO;
import com.fanglin.data.quotation.dao.QuotationFormatDao;

@Repository("quotationFormatDao")
public class QuotationFormatDaoImpl extends DaoImpl<QuotationFormatPO> implements QuotationFormatDao {

	public QuotationFormatDaoImpl() {
		super(QuotationFormatPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFormatPO> queryQuotationFormatByQcid(Long qcid) {
		return createCriteria(QuotationFormatPO.class).createAlias("quotationCtem", "quotationCtem").add(Restrictions.eq(QuotationFormatPO.COLUMN_QCID_STR, qcid)).list();
	}

}
