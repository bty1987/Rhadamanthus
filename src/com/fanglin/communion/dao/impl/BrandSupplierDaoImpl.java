/**
 * @File Name		: BrandDaoImpl.java
 * @Package   	: com.fanglin.data.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.BrandSupplierDao;
import com.fanglin.communion.po.BrandSupplierPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("brandSupplierDao")
public class BrandSupplierDaoImpl extends DaoImpl<BrandSupplierPO> implements BrandSupplierDao {

	public BrandSupplierDaoImpl() {
		super(BrandSupplierPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandSupplierPO> queryBrandSupplier(long bid) {

		Criteria query = session().createCriteria(BrandSupplierPO.class);

		query.add(Restrictions.eq(BrandSupplierPO.COLUMN_BID_STR, bid));

		return query.list();
	}

}
