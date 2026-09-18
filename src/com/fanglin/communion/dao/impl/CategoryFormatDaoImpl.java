package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CategoryFormatDao;
import com.fanglin.communion.po.CategoryFormatPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("categoryFormatDao")
public class CategoryFormatDaoImpl extends DaoImpl<CategoryFormatPO> implements CategoryFormatDao {

	public CategoryFormatDaoImpl() {
		super(CategoryFormatPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CategoryFormatPO> queryCategoryFormatByCid(long cid) {
		return session().createCriteria(CategoryFormatPO.class).createAlias("category", "category").add(Restrictions.eq("category.cid", cid)).list();
	}

	@Override
	public CategoryFormatPO queryCategoryFormat(long cid, String format) {
		return (CategoryFormatPO) session().createCriteria(CategoryFormatPO.class).createAlias("category", "category").add(Restrictions.eq("category.cid", cid)).add(Restrictions.eq("format", format)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteCategoryFormatByCid(long cid) {

		session().createQuery("delete from CategoryFormatPO where category.cid = :cid").setLong("cid", cid).executeUpdate();

		return 0;
	}

}
