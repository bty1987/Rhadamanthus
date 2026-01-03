/**
 * Title: CustomerDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("customerDao")
public class CustomerDaoImpl extends DaoImpl<CustomerPO> implements CustomerDao {

	public CustomerDaoImpl() {
		super(CustomerPO.class);
	}

	@Override
	public List<CustomerPO> pageCustomer(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<CustomerPO> query = pagingQuery(paging, CustomerPO.class);

		queryFilterExcute(query, filters);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		query.asc("cid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPO> queryCustomerByPinyin(String pinyinName, int limit, Integer company) {

		String likestr = String.format("%s%%", pinyinName);

		StringBuffer sql = new StringBuffer();

		sql.append("select c.* ");
		sql.append("from communion.customer c left join communion.customerphone cp on c.cid = cp.cid ");
		sql.append("where (c.pinyinAll like :pinyinAll or c.pinyinAB like :pinyinAB or c.name like :name) or (cp.phone = :phone and cp.status = :status) ");

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			sql.append("and c.company =:company ");
		}

		sql.append("group by c.cid ");
		sql.append("limit :limit ");

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerPO.class);
		query.setString("pinyinAll", likestr).setString("pinyinAB", likestr).setString("name", likestr).setShort("status", CustomerPhonePO.STATUS_ENABLE_INT).setInteger("limit", limit);

		if (pinyinName != null && pinyinName.matches("1[3-9]\\d{9}")) {
			query.setString("phone", FormatUtil.encodePhone(pinyinName));
		} else {
			query.setString("phone", pinyinName);
		}

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.setInteger("company", company);
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPO> queryCustomer(String phone) {
		return session().createCriteria(CustomerPO.class).add(Restrictions.eq("phone", phone)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPO> queryCustomer(List<String> phones) {
		return session().createCriteria(CustomerPO.class).add(Restrictions.in("phone", phones)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("customerName".equals(field)) {
				query.add(query.getCriterion("customerName", filter));
			} else if ("relationshipType".equals(field)) {
				query.add(query.getCriterion("relationshipType", filter));
			} else if ("type".equals(field)) {
				query.add(Restrictions.eq("type", Short.valueOf(data)));
			} else if ("phone".equals(field)) {
				query.add(Restrictions.eq("phone", FormatUtil.encodePhone(data)));
			}
		}
	}
}
