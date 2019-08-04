/**
 * @File Name		: QuotationSmallCategoryDaoImpl.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.QuotationSmallCategoryDao;
import com.fanglin.communion.po.QuotationSmallCategoryPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("quotationsmallcategory")
public class QuotationSmallCategoryDaoImpl extends DaoImpl<QuotationSmallCategoryPO> implements QuotationSmallCategoryDao {

	public QuotationSmallCategoryDaoImpl() {
		super(QuotationSmallCategoryPO.class);
	}

	@Override
	public List<QuotationSmallCategoryPO> pageQuotationSmallCategory(Paging paging, List<Filter> filters) {

		PagingQuery<QuotationSmallCategoryPO> query = pagingQuery(paging, QuotationSmallCategoryPO.class);

		queryFilterExcute(query, filters);

		query.asc("id");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationSmallCategoryPO> queryQuotationSmallCategory(Integer qtid) {
		return session().createCriteria(QuotationSmallCategoryPO.class).add(Restrictions.eq("qtid", qtid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {
				if ("name".equals(filter.getField())) {
					query.add(query.getCriterion("name", Short.parseShort(filter.getData()), filter.getOp()));
				}
			}
		}
	}

}
