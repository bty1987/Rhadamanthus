package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionFunctionDao;
import com.fanglin.construction.po.ConstructionFunctionPO;
import com.fanglin.construction.service.ConstructionFunctionService;
import com.fanglin.construction.vo.ConstructionFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("constructionFunctionService")
@Transactional(readOnly = true)
public class ConstructionFunctionServiceImpl implements ConstructionFunctionService {

	@Autowired
	private ConstructionFunctionDao constructionFunctionDao;

	@Override
	public List<ConstructionFunctionVO> queryConstructionFunction(ConstructionFunctionVO constructionFunctionVO) {

		List<ConstructionFunctionPO> constructionFunctionPOs = constructionFunctionDao.queryConstructionFunction(constructionFunctionVO.getType());
		List<ConstructionFunctionVO> constructionFunctionVOs = new ArrayList<ConstructionFunctionVO>();

		for (ConstructionFunctionPO constructionFunctionPO : constructionFunctionPOs) {

			constructionFunctionVO = new ConstructionFunctionVO();

			BeanUtil.copyPropertie(constructionFunctionPO, constructionFunctionVO);

			constructionFunctionVOs.add(constructionFunctionVO);

		}

		return constructionFunctionVOs;
	}

	@Override
	public List<ConstructionFunctionVO> queryConstructionFunctionByName(ConstructionFunctionVO constructionFunctionVO) {

		List<ConstructionFunctionPO> constructionFunctionPOs = constructionFunctionDao.queryConstructionFunctionByName(constructionFunctionVO.getName());
		List<ConstructionFunctionVO> constructionFunctionVOs = new ArrayList<ConstructionFunctionVO>();

		for (ConstructionFunctionPO constructionFunctionPO : constructionFunctionPOs) {

			constructionFunctionVO = new ConstructionFunctionVO();

			BeanUtil.copyPropertie(constructionFunctionPO, constructionFunctionVO);

			constructionFunctionVOs.add(constructionFunctionVO);

		}

		return constructionFunctionVOs;
	}

}
