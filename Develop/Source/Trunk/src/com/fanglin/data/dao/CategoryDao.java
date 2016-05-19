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

package com.fanglin.data.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.po.CategoryPO;
import com.fanglin.utils.Paging;

public interface CategoryDao extends Dao<CategoryPO> {
	
	public List<CategoryPO> pageCategory(Paging paging, List<FilterVO> filters);
	
	public CategoryPO queryCategoryByCId(long cId);
	
	public CategoryPO queryCategoryByCategoryId(String categoryId);

}
