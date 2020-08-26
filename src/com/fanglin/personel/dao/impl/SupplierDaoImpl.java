/**
 * @File Name		: SupplierDaoImpl.java
 * @Package   	: com.fanglin.personel.dao.impl
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.SupplierDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("supplierDao")
public class SupplierDaoImpl extends DaoImpl<UserPO> implements SupplierDao {

	public SupplierDaoImpl() {
		super(UserPO.class);
	}

	@Override
	public List<UserPO> pageSupplier(Paging paging, List<Filter> filters, int company) {

		PagingQuery<UserPO> query = pagingQuery(paging, UserPO.class);

		query.add(Restrictions.eq("company", company));
		query.add(Restrictions.eq("type", UserPO.TYPE_SUPPLIER_INT));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<UserPO> querySupplierByPinyin(String pinyin, int company) throws FLException {

		PagingQuery<UserPO> query = pagingQuery(new Paging(0, 10), UserPO.class);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.add(Restrictions.eq("company", company));
		}

		query.add(Restrictions.eq("type", UserPO.TYPE_SUPPLIER_INT));

		query.alias("role", "role");

		if (StringUtils.isNotEmpty(pinyin)) {

			Disjunction pinyinDisjunction = Restrictions.disjunction();

			pinyinDisjunction.add(Restrictions.like("currentName", pinyin, MatchMode.ANYWHERE));
			pinyinDisjunction.add(Restrictions.like("pinYin", pinyin, MatchMode.ANYWHERE));
			pinyinDisjunction.add(Restrictions.like("userId", pinyin, MatchMode.ANYWHERE));

			query.add(pinyinDisjunction);
		}

		return query.list();
	}

	@Override
	public int countSupplierByCompany(int company) {

		String sql = "select count(*) from communion.user where company = :company and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).setShort("type", UserPO.TYPE_SUPPLIER_INT).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {

			query.alias("dept", "dept");
			query.alias("role", "role");
			query.alias("duty", "duty");

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();

				if ("userId".equals(field)) {
					query.add(query.getCriterion("userId", filter));
				} else if ("userName".equals(field)) {
					query.add(query.getCriterion("userName", filter));
				} else if ("roleId".equals(field)) {
					query.add(Restrictions.eq("role.rid", Integer.valueOf(data)));
				} else if ("deptId".equals(field)) {
					query.add(query.getCriterion("dept.no", filter));
				} else if ("status".equals(field)) {
					query.add(Restrictions.eq("status", Short.valueOf(data)));
				} else if ("phone".equals(field)) {
					query.add(query.getCriterion("phone", filter));
				}
			}
		}
	}

}
