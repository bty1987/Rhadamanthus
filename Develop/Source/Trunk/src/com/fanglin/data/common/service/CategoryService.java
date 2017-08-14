/**
 * @File Name		: CategoryService.java
 * @Package   	: com.fanglin.data.service
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CategoryVO;
import com.fanglin.utils.Paging;

public interface CategoryService {
	
	public void pageCategory(Paging paging, List<Filter> filters);
	
	public List<CategoryVO> queryCategory();
	
	public CategoryVO queryCategoryByCId(CategoryVO categoryVO);
	
	public CategoryVO queryCategoryByCategoryId(CategoryVO categoryVO);
	
	public int addCategory(CategoryVO categoryVO,int company);
	
	public int updateCategory(CategoryVO categoryVO);
	
	public int deleteCategoryByCId(CategoryVO categoryVO);
	
	public int deleteCategoryByCIds(List<Long> cIds);
	
}
