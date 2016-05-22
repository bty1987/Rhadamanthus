/**
 * @File Name		: CategoryServiceImpl.java
 * @Package   	: com.fanglin.data.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.dao.CategoryDao;
import com.fanglin.data.po.CategoryPO;
import com.fanglin.data.service.CategoryService;
import com.fanglin.data.vo.CategoryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("categoryService")
@Transactional(readOnly=true)
public class CategoryServiceImpl implements CategoryService {
	
	@Autowired
	private CategoryDao categoryDao;
	
	@Autowired
	private CountingService countingService;

	@Override
	public void pageCategory(Paging paging, List<FilterVO> filters) {
		
		List<CategoryPO> categoryPOs = categoryDao.pageCategory(paging, filters);
		List<CategoryVO> categoryVOs = new ArrayList<CategoryVO>();
		
		for(CategoryPO categoryPO: categoryPOs){
			CategoryVO categoryVO = new CategoryVO();
			BeanUtil.copyProperties(categoryPO, categoryVO);
			
			categoryVOs.add(categoryVO);
		}

		paging.setData(categoryVOs);
	}

	@Override
	public List<CategoryVO> queryCategory() {
		
		List<CategoryPO> categoryPOs = categoryDao.list();
		List<CategoryVO> categoryVOs = new ArrayList<CategoryVO>();
		
		for(CategoryPO categoryPO: categoryPOs){
			CategoryVO categoryVO = new CategoryVO();
			BeanUtil.copyProperties(categoryPO, categoryVO);
			
			categoryVOs.add(categoryVO);
		}
		
		return categoryVOs;
	}

	@Override
	public CategoryVO queryCategoryByCId(CategoryVO categoryVO) {
		
		CategoryPO categoryPO = categoryDao.queryCategoryByCId(categoryVO.getCid());
		
		BeanUtil.copyProperties(categoryPO, categoryVO);
		
		return categoryVO;
	}

	@Override
	public CategoryVO queryCategoryByCategoryId(CategoryVO categoryVO) {
		
		CategoryPO categoryPO = categoryDao.queryCategoryByCategoryId(categoryVO.getCategoryId());
		
		BeanUtil.copyProperties(categoryPO, categoryVO);
		
		return categoryVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addCategory(CategoryVO categoryVO) {
		
		CategoryPO categoryPO = new CategoryPO();
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CATEGORY_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer categoryId = new StringBuffer();
		categoryId.append(SystemConfig.getString("companyIdent", ""));
		categoryId.append(SystemConfig.getString("categoryIdent", "C_"));
		categoryId.append(FormatUtil.fillZero(count, "000"));
		
		categoryPO.setCategoryId(categoryId.toString());
		
		BeanUtil.copyProperties(categoryVO, categoryPO, Arrays.asList("categoryId"));
		
		categoryDao.save(categoryPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateCategory(CategoryVO categoryVO) {
		
		CategoryPO categoryPO = categoryDao.get(categoryVO.getCid());
		
		BeanUtil.copyProperties(categoryVO, categoryPO, Arrays.asList("categoryId"));
		
		categoryDao.update(categoryPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteCategoryByCId(CategoryVO categoryVO) {
		
		categoryDao.deleteById(categoryVO.getCid());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteCategoryByCIds(List<Long> cIds) {
		
		for(long cId: cIds){
			categoryDao.deleteById(cId);
		}
		
		return 0;
	}

}
