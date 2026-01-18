/**
 * @File Name		: ReceiptTypeDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-5-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.utils.Paging;

@Repository("receiptTypeDao")
public class ReceiptTypeDaoImpl extends DaoImpl<ReceiptTypePO> implements ReceiptTypeDao {

	public ReceiptTypeDaoImpl() {
		super(ReceiptTypePO.class);
	}

	@Override
	public List<ReceiptTypePO> pageReceiptType(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ReceiptTypePO> query = pagingQuery(paging, ReceiptTypePO.class);

		queryFilterExcute(query, filters);

		query.add(Restrictions.eq("company", company));

		query.asc("rtId");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ReceiptTypePO> queryReceiptType(int company) {
		return session().createCriteria(ReceiptTypePO.class).add(Restrictions.eq("company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ReceiptTypePO> queryReceiptTypeByType(short type, String grade, int company) {

		Criteria criteria = session().createCriteria(ReceiptTypePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ReceiptTypePO.COLUMN_TYPE_STR, type));

		if (grade != null) {
			criteria.add(Restrictions.eq(ReceiptTypePO.COLUMN_GRADE_STR, grade));
		}

		return criteria.list();
	}

	@Override
	public ReceiptTypePO queryReceiptTypeByNo(String no, int company) {
		return (ReceiptTypePO) session().createCriteria(ReceiptTypePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ReceiptTypePO.COLUMN_NO_STR, no)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {
				if ("name".equals(filter.getField())) {
					query.add(Restrictions.ilike("name", filter.getData(), MatchMode.ANYWHERE));
				} else if ("type".equals(filter.getField())) {
					query.add(Restrictions.eq("type", Short.valueOf(filter.getData())));
				} else if ("status".equals(filter.getField())) {
					query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
				} else if ("fund".equals(filter.getField())) {
					query.add(Restrictions.eq("fund", Short.valueOf(filter.getData())));
				} else if ("grade".equals(filter.getField())) {
					query.add(Restrictions.eq("grade", filter.getData()));
				} else if ("kino".equals(filter.getField())) {
					query.add(Restrictions.ilike("kino", filter.getData(), MatchMode.ANYWHERE));
				} else if ("kiname".equals(filter.getField())) {
					query.add(Restrictions.ilike("kiname", filter.getData(), MatchMode.ANYWHERE));
				} else if ("kibalance".equals(filter.getField())) {
					query.add(Restrictions.ilike("kibalance", filter.getData(), MatchMode.ANYWHERE));
				} else if ("bankno".equals(filter.getField())) {
					query.add(Restrictions.ilike("bankno", filter.getData(), MatchMode.ANYWHERE));
				} else if ("assistant".equals(filter.getField())) {
					query.add(Restrictions.ilike("assistant", filter.getData(), MatchMode.ANYWHERE));
				} else if ("value".equals(filter.getField())) {
					query.add(Restrictions.ilike("value", filter.getData(), MatchMode.ANYWHERE));
				}
			}
		}

	}

}
