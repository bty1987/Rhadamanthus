package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ConstantDao;
import com.fanglin.communion.po.ConstantPO;
import com.fanglin.communion.service.ConstantService;
import com.fanglin.communion.vo.ConstantVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("constantService")
@Transactional(readOnly = true)
public class ConstantServiceImpl implements ConstantService {

	@Autowired
	private ConstantDao constantDao;

	@Override
	public void pageConstant(Paging paging, List<Filter> filters) {

		List<ConstantPO> constantPOs = constantDao.pageConstant(paging, filters);
		List<ConstantVO> constantVOs = new ArrayList<ConstantVO>();

		for (ConstantPO constantPO : constantPOs) {

			ConstantVO constantVO = new ConstantVO();

			BeanUtil.copyPropertie(constantPO, constantVO);
			BeanUtil.copyProperties(constantPO.getModule(), constantVO.getModule());

			constantVOs.add(constantVO);

		}
		paging.setData(constantVOs);
	}

	@Override
	public List<ConstantVO> queryConstant(ConstantVO constantVO) {

		if (constantVO == null) constantVO = new ConstantVO();

		List<ConstantPO> constantPOs = constantDao.queryConstant(constantVO.getModule(), constantVO.getClazz(), constantVO.getType());
		List<ConstantVO> constantVOs = new ArrayList<ConstantVO>();

		for (ConstantPO constantPO : constantPOs) {

			constantVO = new ConstantVO();

			BeanUtil.copyProperties(constantPO, constantVO);

			constantVOs.add(constantVO);
		}

		return constantVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addConstant(ConstantVO constantVO) {

		ConstantPO constantPO = new ConstantPO();

		BeanUtil.copyProperties(constantVO, constantPO);

		constantDao.save(constantPO);

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateConstant(ConstantVO constantVO) throws FLException {

		ConstantPO constantPO = constantDao.get(constantVO.getCid());

		BeanUtil.copyProperties(constantVO, constantPO);

		constantDao.update(constantPO);

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstantForStatus(ConstantVO constantVO) throws FLException {

		ConstantPO constantPO = constantDao.get(constantVO.getCid());

		BeanUtil.copyProperties(constantVO, constantPO);
		constantPO.setStatus(constantVO.getStatus());

		constantDao.update(constantPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteConstant(ConstantVO constantVO) throws FLException {

		Long cid = constantVO.getCid();

		constantDao.deleteById(cid);

		return 0;
	}
}