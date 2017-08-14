/**
 * @File Name		: CategoryDaoImpl.java
 * @Package   	: com.fanglin.data.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CategoryDao;
import com.fanglin.data.po.CategoryPO;
import com.fanglin.utils.Paging;

@Repository("categoryDao")
public class CategoryDaoImpl extends DaoImpl<CategoryPO> implements CategoryDao {
	
	public CategoryDaoImpl(){
		super(CategoryPO.class);
	}
	
	@Override
	public List<CategoryPO> pageCategory(Paging paging, List<Filter> filters) {
		
		PagingQuery<CategoryPO> query = pagingQuery(paging, CategoryPO.class);
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}


	@Override
	public CategoryPO queryCategoryByCId(long cId) {
		return (CategoryPO) session().createCriteria(CategoryPO.class).add(Restrictions.eq(CategoryPO.COLUMN_CID_STR, cId)).uniqueResult();
	}

	@Override
	public CategoryPO queryCategoryByCategoryId(String categoryId) {
		return (CategoryPO) session().createCriteria(CategoryPO.class).add(Restrictions.eq(CategoryPO.COLUMN_CATEGORYID_STR, categoryId)).uniqueResult();
	}

}
