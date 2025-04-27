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

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.SupplierContractBrandDao;
import com.fanglin.personel.po.SupplierContractBrandPO;
import com.fanglin.utils.Paging;

@Repository("supplierBrandDao")
public class SupplierContractBrandDaoImpl extends DaoImpl<SupplierContractBrandPO> implements SupplierContractBrandDao {

	public SupplierContractBrandDaoImpl() {
		super(SupplierContractBrandPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierContractBrandPO> querySupplierBrand(Long scid) {

		return session().createCriteria(SupplierContractBrandPO.class).add(Restrictions.eq("scid", scid)).list();
	}

	@Override
	public List<SupplierContractBrandPO> pageSupplierBrand(Paging paging, List<Filter> filters, int company, long scid) {

		PagingQuery<SupplierContractBrandPO> query = pagingQuery(paging, SupplierContractBrandPO.class);

		query.add(Restrictions.eq("scid", scid));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("brand", "brand");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("sales.brand.bid".equals(field)) {
				query.add(Restrictions.eq("brand.bid", Integer.valueOf(data)));
			} else if ("scid".equals(field)) {
				query.add(Restrictions.eq("scid", Integer.valueOf(data)));
			}
		}
	}

}
