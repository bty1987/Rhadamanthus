/**
 * @File Name		: SystemDefineItemDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SystemDefineItemPO;
import com.fanglin.data.quotation.dao.SystemDefineItemDao;
import com.fanglin.utils.Paging;

@Repository("systemDefineItemDao")
public class SystemDefineItemDaoImpl extends DaoImpl<SystemDefineItemPO> implements SystemDefineItemDao {

	public SystemDefineItemDaoImpl() {
		super(SystemDefineItemPO.class);
	}

	@Override
	public List<SystemDefineItemPO> pageSystemDefineItem(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SystemDefineItemPO> query = pagingQuery(paging, SystemDefineItemPO.class);

		queryFilterExcute(query, filters);

		query.asc("no");

		return query.add(Restrictions.eq(SystemDefineItemPO.COLUMN_COMPANY_STR, company)).list();
	}

	@Override
	public SystemDefineItemPO querySystemDefineItem(String no, int company) {
		return (SystemDefineItemPO) session().createCriteria(SystemDefineItemPO.class).add(Restrictions.and(Restrictions.eq("no", no), (Restrictions.eq(SystemDefineItemPO.COLUMN_COMPANY_STR, company)))).uniqueResult();

	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) {
			return;
		}

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("quotationBigCategoryId".equals(field)) {
				query.add(query.getCriterion("quotationBigCategory.id", Integer.parseInt(data), op));
			} else if ("quotationWorkTypeId".equals(field)) {
				query.add(query.getCriterion("workType.id", Integer.parseInt(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			}
		}
	}
}
