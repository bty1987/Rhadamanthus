package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.data.po.QuotationFormatPO;
import com.fanglin.data.quotation.dao.QuotationFormatDao;
import com.fanglin.utils.Paging;

@Repository("quotationFormatDao")
public class QuotationFormatDaoImpl extends DaoImpl<QuotationFormatPO> implements QuotationFormatDao {

	public QuotationFormatDaoImpl() {
		super(QuotationFormatPO.class);
	}

	@Override
	public List<QuotationFormatPO> queryQuotationFormat(Paging paging, String pinyin) {
		PagingQuery<QuotationFormatPO> query = pagingQuery(paging, QuotationFormatPO.class);

		query.add(Restrictions.eq(QuotationCtemPO.COLUMN_STATUS_STR, QuotationFormatPO.STATUS_ENABLE_STR)).add(Restrictions.ilike(QuotationFormatPO.COLUMN_PINYIN_STR, pinyin, MatchMode.ANYWHERE));

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFormatPO> queryQuotationFormatByQcid(Long qcid) {
		return createCriteria(QuotationFormatPO.class).createAlias("quotationCtem", "quotationCtem").add(Restrictions.eq(QuotationFormatPO.COLUMN_QCID_STR, qcid)).list();
	}

}
