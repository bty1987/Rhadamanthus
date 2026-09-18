package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CategoryDao;
import com.fanglin.communion.dao.CategoryFormatDao;
import com.fanglin.communion.po.CategoryFormatPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.FunctionAreaCategoryPO;
import com.fanglin.data.po.FunctionAreaFormatPO;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.quotation.dao.FunctionAreaCategoryDao;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaFormatDao;
import com.fanglin.data.quotation.service.FunctionAreaCategoryService;
import com.fanglin.data.quotation.vo.FunctionAreaCategoryVO;
import com.fanglin.data.quotation.vo.FunctionAreaFormatVO;
import com.fanglin.utils.BeanUtil;

@Service("functionAreaCategoryService")
@Transactional(readOnly = true)
public class FunctionAreaCategoryServiceImpl implements FunctionAreaCategoryService {

	@Autowired
	private FunctionAreaCategoryDao functionAreaCategoryDao;

	@Autowired
	private FunctionAreaFormatDao functionAreaFormatDao;

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Autowired
	private CategoryDao categoryDao;

	@Autowired
	private CategoryFormatDao categoryFormatDao;

	@Override
	public List<FunctionAreaCategoryVO> queryFunctionAreaCategoryByFaid(FunctionAreaCategoryVO functionAreaCategoryVO) {

		List<FunctionAreaCategoryVO> functionAreaCategoryVOs = new ArrayList<FunctionAreaCategoryVO>();

		List<FunctionAreaCategoryPO> functionAreaCategoryPOs = functionAreaCategoryDao.queryFunctionAreaCategoryByFaid(functionAreaCategoryVO.getFaid());

		for (FunctionAreaCategoryPO functionAreaCategoryPO : functionAreaCategoryPOs) {

			FunctionAreaCategoryVO _functionAreaCategoryVO = new FunctionAreaCategoryVO();

			_functionAreaCategoryVO.setFcid(functionAreaCategoryPO.getFcid());
			_functionAreaCategoryVO.setFaid(functionAreaCategoryPO.getFunctionArea().getFaid());
			_functionAreaCategoryVO.setCid(functionAreaCategoryPO.getCategory().getCid());
			_functionAreaCategoryVO.setCategoryName(functionAreaCategoryPO.getCategory().getName());

			List<FunctionAreaFormatVO> functionAreaFormatVOs = new ArrayList<FunctionAreaFormatVO>();

			for (FunctionAreaFormatPO functionAreaFormatPO : functionAreaFormatDao.queryFunctionAreaFormatByFacid(functionAreaCategoryPO.getFcid())) {

				FunctionAreaFormatVO functionAreaFormatVO = new FunctionAreaFormatVO();

				BeanUtil.copyPropertie(functionAreaFormatPO, functionAreaFormatVO);

				functionAreaFormatVOs.add(functionAreaFormatVO);
			}

			_functionAreaCategoryVO.setFormats(functionAreaFormatVOs);

			functionAreaCategoryVOs.add(_functionAreaCategoryVO);
		}

		return functionAreaCategoryVOs;
	}

	@Override
	public List<FunctionAreaFormatVO> queryFunctionAreaFormatByFacids(String facids) {

		List<FunctionAreaFormatVO> functionAreaFormatVOs = new ArrayList<FunctionAreaFormatVO>();

		List<Long> facidList = new ArrayList<Long>();

		for (String facid : facids.split(",")) {
			if (!facid.trim().isEmpty()) facidList.add(Long.parseLong(facid.trim()));
		}

		if (facidList.isEmpty()) return functionAreaFormatVOs;

		for (FunctionAreaFormatPO functionAreaFormatPO : functionAreaFormatDao.queryFunctionAreaFormatByFacids(facidList)) {

			FunctionAreaFormatVO functionAreaFormatVO = new FunctionAreaFormatVO();

			BeanUtil.copyPropertie(functionAreaFormatPO, functionAreaFormatVO);

			functionAreaFormatVO.setFcid(functionAreaFormatPO.getFunctionAreaCategory().getFcid());

			functionAreaFormatVOs.add(functionAreaFormatVO);
		}

		return functionAreaFormatVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFunctionAreaCategory(FunctionAreaCategoryVO functionAreaCategoryVO) throws FLException {

		FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaCategoryVO.getFaid());

		if (functionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		CategoryPO categoryPO = categoryDao.queryCategoryByCId(functionAreaCategoryVO.getCid());

		if (categoryPO == null) {
			throw new FLException(200118, "品类不存在");
		}

		if (functionAreaCategoryDao.queryFunctionAreaCategory(functionAreaCategoryVO.getFaid(), functionAreaCategoryVO.getCid()) != null) {
			throw new FLException(200119, "功能区品类已存在");
		}

		FunctionAreaCategoryPO functionAreaCategoryPO = new FunctionAreaCategoryPO();

		functionAreaCategoryPO.setFunctionArea(functionAreaPO);
		functionAreaCategoryPO.setCategory(categoryPO);

		functionAreaCategoryDao.save(functionAreaCategoryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteFunctionAreaCategory(FunctionAreaCategoryVO functionAreaCategoryVO) throws FLException {

		FunctionAreaCategoryPO functionAreaCategoryPO = functionAreaCategoryVO.getFcid() == null ? null : functionAreaCategoryDao.get(functionAreaCategoryVO.getFcid());

		if (functionAreaCategoryPO == null) {
			throw new FLException(200120, "功能区品类不存在");
		}

		functionAreaFormatDao.deleteFunctionAreaFormatByFacid(functionAreaCategoryPO.getFcid());

		functionAreaCategoryDao.delete(functionAreaCategoryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFunctionAreaFormat(FunctionAreaFormatVO functionAreaFormatVO) throws FLException {

		FunctionAreaCategoryPO functionAreaCategoryPO = checkFunctionAreaCategory(functionAreaFormatVO.getFcid());

		if (functionAreaFormatVO.getFormat() == null || "".equals(functionAreaFormatVO.getFormat())) {
			throw new FLException(200121, "功能区规格不存在");
		}

		checkFormatInCategoryScope(functionAreaCategoryPO.getCategory().getCid(), functionAreaFormatVO.getFormat());

		FunctionAreaFormatPO functionAreaFormatPO = new FunctionAreaFormatPO();

		functionAreaFormatPO.setFunctionAreaCategory(functionAreaCategoryPO);
		functionAreaFormatPO.setFormat(functionAreaFormatVO.getFormat());
		functionAreaFormatPO.setFormula(functionAreaFormatVO.getFormula());
		functionAreaFormatPO.setComment(functionAreaFormatVO.getComment());

		functionAreaFormatDao.save(functionAreaFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateFunctionAreaFormat(FunctionAreaFormatVO functionAreaFormatVO) throws FLException {

		FunctionAreaFormatPO functionAreaFormatPO = checkFunctionAreaFormat(functionAreaFormatVO.getFfid());

		if (functionAreaFormatVO.getFormat() == null || "".equals(functionAreaFormatVO.getFormat())) {
			throw new FLException(200121, "功能区规格不存在");
		}

		checkFormatInCategoryScope(functionAreaFormatPO.getFunctionAreaCategory().getCategory().getCid(), functionAreaFormatVO.getFormat());

		functionAreaFormatPO.setFormat(functionAreaFormatVO.getFormat());
		functionAreaFormatPO.setFormula(functionAreaFormatVO.getFormula());
		functionAreaFormatPO.setComment(functionAreaFormatVO.getComment());

		functionAreaFormatDao.update(functionAreaFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteFunctionAreaFormat(FunctionAreaFormatVO functionAreaFormatVO) throws FLException {

		FunctionAreaFormatPO functionAreaFormatPO = checkFunctionAreaFormat(functionAreaFormatVO.getFfid());

		functionAreaFormatDao.delete(functionAreaFormatPO);

		return 0;
	}

	private FunctionAreaCategoryPO checkFunctionAreaCategory(Long fcid) throws FLException {

		FunctionAreaCategoryPO functionAreaCategoryPO = fcid == null ? null : functionAreaCategoryDao.get(fcid);

		if (functionAreaCategoryPO == null) {
			throw new FLException(200120, "功能区品类不存在");
		}

		return functionAreaCategoryPO;
	}

	/**
	 * 功能区品类规格取值范围校验：品类已维护规格(communion.categoryformat)时，
	 * 功能区规格必须取自品类规格集合；品类未维护规格时不约束（兼容自由录入）。
	 */
	private void checkFormatInCategoryScope(long cid, String format) throws FLException {

		List<CategoryFormatPO> categoryFormatPOs = categoryFormatDao.queryCategoryFormatByCid(cid);

		if (categoryFormatPOs.isEmpty()) return;

		for (CategoryFormatPO categoryFormatPO : categoryFormatPOs) {
			if (format.equals(categoryFormatPO.getFormat())) return;
		}

		throw new FLException(200124, "规格不在品类规格范围");
	}

	private FunctionAreaFormatPO checkFunctionAreaFormat(Long ffid) throws FLException {

		FunctionAreaFormatPO functionAreaFormatPO = ffid == null ? null : functionAreaFormatDao.get(ffid);

		if (functionAreaFormatPO == null) {
			throw new FLException(200121, "功能区规格不存在");
		}

		return functionAreaFormatPO;
	}

}
