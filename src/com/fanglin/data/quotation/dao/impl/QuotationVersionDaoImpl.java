/**
 * @File Name		: QuotationVersionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.utils.Paging;

@Repository("quotationVersionDao")
public class QuotationVersionDaoImpl extends DaoImpl<QuotationVersionPO> implements QuotationVersionDao {

	public QuotationVersionDaoImpl() {
		super(QuotationVersionPO.class, true);
	}

	@Override
	public List<QuotationVersionPO> pageQuotationVersion(Paging paging, List<Filter> filters, int company) {

		PagingQuery<QuotationVersionPO> query = pagingQuery(paging, QuotationVersionPO.class);

		queryFliterExcute(query, filters);

		query.desc("defaultFlag");

		return query.add(Restrictions.eq("company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationVersionPO> queryQuotationVersion(int company) {
		return createCriteria(QuotationVersionPO.class).add(Restrictions.eq("company", company)).addOrder(Order.desc("defaultFlag")).list();
	}

	@Override
	public QuotationVersionPO queryQuotationVersionByVersionId(String no) {
		return (QuotationVersionPO) session().createCriteria(QuotationVersionPO.class).add(Restrictions.eq("no", no)).uniqueResult();
	}

	@Override
	public QuotationVersionPO queryQuotationVersionForDefault(int company, short type) {
		return (QuotationVersionPO) createCriteria(QuotationVersionPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("type", type)).add(Restrictions.eq("defaultFlag", QuotationVersionPO.DEFAULTFLAG_DEFAULT_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int updateQuotationVersionForDefault(int company, short defaultFlag, short type) {

		String sql = "update quotation.quotationversion set defaultFlag = :defaultFlag where company = :company and type = :type";

		session().createSQLQuery(sql).setInteger("company", company).setShort("defaultFlag", defaultFlag).setShort("type", type).executeUpdate();

		return 0;
	}

	private void queryFliterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("no".equals(field)) {
				query.add(query.getCriterion("no", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), "eq"));
			} else if ("defaultFlag".equals(field)) {
				query.add(query.getCriterion("defaultFlag", Short.valueOf(data), "eq"));
			}

		}
	}
}
