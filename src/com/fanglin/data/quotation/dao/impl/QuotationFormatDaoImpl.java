package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
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
	public List<QuotationFormatPO> queryQuotationFormatByQcid(Long qcid, List<Filter> filters) {

		Criteria criteria = createCriteria(QuotationFormatPO.class).createAlias("quotationCtem", "quotationCtem").add(Restrictions.eq(QuotationFormatPO.COLUMN_QCID_STR, qcid));

		if (filters != null) {

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("name".equals(field)) {
					criteria.add(getCriterion("name", data, op));
				} else if ("format".equals(field)) {
					criteria.add(getCriterion("format", data, op));
				} else if ("alias".equals(field)) {
					criteria.add(getCriterion("alias", data, op));
				} else if ("workType.id".equals(field)) {
					criteria.add(getCriterion("workType.id", data, op));
				} else if ("type".equals(field)) {
					criteria.add(getCriterion("type", data, op));
				} else if ("status".equals(field)) {
					criteria.add(getCriterion("status", data, op));
				}
			}
		}

		return criteria.list();
	}

}
