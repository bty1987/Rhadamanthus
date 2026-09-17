package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CategoryDao;
import com.fanglin.communion.dao.CategoryFormatDao;
import com.fanglin.communion.po.CategoryFormatPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.communion.service.CategoryFormatService;
import com.fanglin.communion.vo.CategoryFormatVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.BeanUtil;

@Service("categoryFormatService")
@Transactional(readOnly = true)
public class CategoryFormatServiceImpl implements CategoryFormatService {

	@Autowired
	private CategoryFormatDao categoryFormatDao;

	@Autowired
	private CategoryDao categoryDao;

	@Override
	public List<CategoryFormatVO> queryCategoryFormatByCid(CategoryFormatVO categoryFormatVO) {

		List<CategoryFormatVO> categoryFormatVOs = new ArrayList<CategoryFormatVO>();

		for (CategoryFormatPO categoryFormatPO : categoryFormatDao.queryCategoryFormatByCid(categoryFormatVO.getCid())) {

			CategoryFormatVO _categoryFormatVO = new CategoryFormatVO();

			BeanUtil.copyPropertie(categoryFormatPO, _categoryFormatVO);

			_categoryFormatVO.setCid(categoryFormatPO.getCategory().getCid());

			categoryFormatVOs.add(_categoryFormatVO);
		}

		return categoryFormatVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCategoryFormat(CategoryFormatVO categoryFormatVO) throws FLException {

		CategoryPO categoryPO = checkCategory(categoryFormatVO.getCid());

		if (categoryFormatVO.getFormat() == null || "".equals(categoryFormatVO.getFormat())) {
			throw new FLException(200122, "品类规格不存在");
		}

		if (categoryFormatDao.queryCategoryFormat(categoryFormatVO.getCid(), categoryFormatVO.getFormat()) != null) {
			throw new FLException(200123, "品类规格已存在");
		}

		CategoryFormatPO categoryFormatPO = new CategoryFormatPO();

		categoryFormatPO.setCategory(categoryPO);
		categoryFormatPO.setFormat(categoryFormatVO.getFormat());
		categoryFormatPO.setComment(categoryFormatVO.getComment());

		categoryFormatDao.save(categoryFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCategoryFormat(CategoryFormatVO categoryFormatVO) throws FLException {

		CategoryFormatPO categoryFormatPO = checkCategoryFormat(categoryFormatVO.getCfid());

		if (categoryFormatVO.getFormat() == null || "".equals(categoryFormatVO.getFormat())) {
			throw new FLException(200122, "品类规格不存在");
		}

		CategoryFormatPO queryPO = categoryFormatDao.queryCategoryFormat(categoryFormatPO.getCategory().getCid(), categoryFormatVO.getFormat());

		if (queryPO != null && queryPO.getCfid() != categoryFormatPO.getCfid()) {
			throw new FLException(200123, "品类规格已存在");
		}

		categoryFormatPO.setFormat(categoryFormatVO.getFormat());
		categoryFormatPO.setComment(categoryFormatVO.getComment());

		categoryFormatDao.update(categoryFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCategoryFormat(CategoryFormatVO categoryFormatVO) throws FLException {

		CategoryFormatPO categoryFormatPO = checkCategoryFormat(categoryFormatVO.getCfid());

		categoryFormatDao.delete(categoryFormatPO);

		return 0;
	}

	private CategoryPO checkCategory(Long cid) throws FLException {

		CategoryPO categoryPO = cid == null ? null : categoryDao.queryCategoryByCId(cid);

		if (categoryPO == null) {
			throw new FLException(200118, "品类不存在");
		}

		return categoryPO;
	}

	private CategoryFormatPO checkCategoryFormat(Long cfid) throws FLException {

		CategoryFormatPO categoryFormatPO = cfid == null ? null : categoryFormatDao.get(cfid);

		if (categoryFormatPO == null) {
			throw new FLException(200122, "品类规格不存在");
		}

		return categoryFormatPO;
	}

}
