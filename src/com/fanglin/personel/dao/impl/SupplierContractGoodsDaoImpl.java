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
import com.fanglin.personel.dao.SupplierContractGoodsDao;
import com.fanglin.personel.po.SupplierContractGoodsPO;
import com.fanglin.utils.Paging;

@Repository("supplierContractGoodsDao")
public class SupplierContractGoodsDaoImpl extends DaoImpl<SupplierContractGoodsPO> implements SupplierContractGoodsDao {

	public SupplierContractGoodsDaoImpl() {
		super(SupplierContractGoodsPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierContractGoodsPO> querySupplierContractGoods(Long scid) {

		return session().createCriteria(SupplierContractGoodsPO.class).add(Restrictions.eq("scid", scid)).list();
	}

	@Override
	public List<SupplierContractGoodsPO> pageSupplierContractGoods(Paging paging, List<Filter> filters, int company, long scid) {

		PagingQuery<SupplierContractGoodsPO> query = pagingQuery(paging, SupplierContractGoodsPO.class);

		query.add(Restrictions.eq("scid", scid));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("goods", "goods");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("goods.gid".equals(field)) {
				query.add(Restrictions.eq("goods.gid", Integer.valueOf(data)));
			} else if ("scid".equals(field)) {
				query.add(Restrictions.eq("scid", Integer.valueOf(data)));
			}
		}
	}

}
