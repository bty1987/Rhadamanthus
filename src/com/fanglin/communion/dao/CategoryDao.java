/**
 * @File Name		: CategoryDao.java
 * @Package   	: com.fanglin.data.dao
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CategoryPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CategoryDao extends Dao<CategoryPO> {

	public List<CategoryPO> pageCategory(Paging paging, List<Filter> filters);

	public List<CategoryPO> queryCategory(Short isCoupon, Short isCount);

	public CategoryPO queryCategoryByCId(long cId);

	public CategoryPO queryCategoryByCategoryId(String categoryId);

	public CategoryPO queryCategoryByName(String name);

}
