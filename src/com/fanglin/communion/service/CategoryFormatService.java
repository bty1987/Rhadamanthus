package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.CategoryFormatVO;
import com.fanglin.core.interceptor.FLException;

public interface CategoryFormatService {

	public List<CategoryFormatVO> queryCategoryFormatByCid(CategoryFormatVO categoryFormatVO) throws FLException;

	public int addCategoryFormat(CategoryFormatVO categoryFormatVO) throws FLException;

	public int updateCategoryFormat(CategoryFormatVO categoryFormatVO) throws FLException;

	public int deleteCategoryFormat(CategoryFormatVO categoryFormatVO) throws FLException;

}
