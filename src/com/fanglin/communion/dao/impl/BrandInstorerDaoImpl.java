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

import com.fanglin.communion.dao.BrandInstorerDao;
import com.fanglin.communion.po.BrandInstorerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("brandInstorerDao")
public class BrandInstorerDaoImpl extends DaoImpl<BrandInstorerPO> implements BrandInstorerDao {

	public BrandInstorerDaoImpl() {
		super(BrandInstorerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandInstorerPO> queryBrandInstorer(long bid) {
		Criteria query = session().createCriteria(BrandInstorerPO.class);

		query.add(Restrictions.eq(BrandInstorerPO.COLUMN_BID_STR, bid));

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandInstorerPO> queryBrandInstorerByIuid(long iuid) {
		Criteria query = session().createCriteria(BrandInstorerPO.class);

		query.add(Restrictions.eq(BrandInstorerPO.COLUMN_IUID_STR, iuid));

		return query.list();
	}

}
