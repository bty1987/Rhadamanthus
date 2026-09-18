package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FunctionAreaTypePO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaTypeDao;
import com.fanglin.data.quotation.service.FunctionAreaTypeService;
import com.fanglin.data.quotation.vo.FunctionAreaTypeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("functionAreaTypeService")
@Transactional(readOnly = true)
public class FunctionAreaTypeServiceImpl implements FunctionAreaTypeService {

	// functionAreaType 历史计价口径值与新字典并存于同字段,禁将老词建入字典混淆语义;"0"系管理费功能区魔法值(QuotationFunctionAreaServiceImpl 排序依赖)
	private static final List<String> RESERVED_NAMES = Arrays.asList("0", "标准", "普通", "一次性包死", "综合项目", "管理费");

	@Autowired
	private FunctionAreaTypeDao functionAreaTypeDao;

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Override
	public void pageFunctionAreaType(Paging paging, List<Filter> filters) {

		List<FunctionAreaTypePO> functionAreaTypePOs = functionAreaTypeDao.pageFunctionAreaType(paging, filters);
		List<FunctionAreaTypeVO> functionAreaTypeVOs = new ArrayList<FunctionAreaTypeVO>();

		for (FunctionAreaTypePO functionAreaTypePO : functionAreaTypePOs) {

			FunctionAreaTypeVO functionAreaTypeVO = new FunctionAreaTypeVO();

			BeanUtil.copyPropertie(functionAreaTypePO, functionAreaTypeVO);

			functionAreaTypeVOs.add(functionAreaTypeVO);
		}

		paging.setData(functionAreaTypeVOs);
	}

	@Override
	public List<FunctionAreaTypeVO> queryFunctionAreaType() {

		List<FunctionAreaTypePO> functionAreaTypePOs = functionAreaTypeDao.queryFunctionAreaType();
		List<FunctionAreaTypeVO> functionAreaTypeVOs = new ArrayList<FunctionAreaTypeVO>();

		for (FunctionAreaTypePO functionAreaTypePO : functionAreaTypePOs) {

			FunctionAreaTypeVO functionAreaTypeVO = new FunctionAreaTypeVO();

			BeanUtil.copyPropertie(functionAreaTypePO, functionAreaTypeVO);

			functionAreaTypeVOs.add(functionAreaTypeVO);
		}

		return functionAreaTypeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFunctionAreaType(FunctionAreaTypeVO functionAreaTypeVO) throws FLException {

		String name = checkName(functionAreaTypeVO.getName());

		if (functionAreaTypeDao.queryFunctionAreaTypeByName(name) != null) {
			throw new FLException(200116, "功能区类型不存在");
		}

		FunctionAreaTypePO functionAreaTypePO = new FunctionAreaTypePO();

		functionAreaTypePO.setName(name);
		functionAreaTypePO.setCompany(0);
		functionAreaTypePO.setStatus(FunctionAreaTypePO.STATUS_ENABLE_INT);

		functionAreaTypeDao.save(functionAreaTypePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateFunctionAreaType(FunctionAreaTypeVO functionAreaTypeVO) throws FLException {

		FunctionAreaTypePO functionAreaTypePO = checkFunctionAreaType(functionAreaTypeVO.getFatId());

		String name = checkName(functionAreaTypeVO.getName());

		FunctionAreaTypePO otherPO = functionAreaTypeDao.queryFunctionAreaTypeByName(name);

		if (otherPO != null && otherPO.getFatId() != functionAreaTypePO.getFatId()) {
			throw new FLException(200116, "功能区类型不存在");
		}

		functionAreaTypePO.setName(name);

		functionAreaTypeDao.update(functionAreaTypePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateFunctionAreaTypeForStatus(FunctionAreaTypeVO functionAreaTypeVO) throws FLException {

		FunctionAreaTypePO functionAreaTypePO = checkFunctionAreaType(functionAreaTypeVO.getFatId());

		functionAreaTypePO.setStatus(functionAreaTypeVO.getStatus());

		functionAreaTypeDao.update(functionAreaTypePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteFunctionAreaType(FunctionAreaTypeVO functionAreaTypeVO) throws FLException {

		FunctionAreaTypePO functionAreaTypePO = checkFunctionAreaType(functionAreaTypeVO.getFatId());

		if (functionAreaDao.countFunctionAreaByFunctionAreaType(functionAreaTypePO.getName()) > 0) {
			throw new FLException(200117, "功能区类型已被引用");
		}

		functionAreaTypeDao.delete(functionAreaTypePO);

		return 0;
	}

	private FunctionAreaTypePO checkFunctionAreaType(Long fatId) throws FLException {

		FunctionAreaTypePO functionAreaTypePO = fatId == null ? null : functionAreaTypeDao.get(fatId);

		if (functionAreaTypePO == null) {
			throw new FLException(200116, "功能区类型不存在");
		}

		return functionAreaTypePO;
	}

	private String checkName(String name) throws FLException {

		if (name == null || "".equals(name) || name.length() > 10) {
			throw new FLException(200116, "功能区类型不存在");
		}

		if (RESERVED_NAMES.contains(name)) {
			throw new FLException(200116, "功能区类型不存在");
		}

		return name;
	}

}
