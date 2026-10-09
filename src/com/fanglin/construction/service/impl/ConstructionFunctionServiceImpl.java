package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.dao.ConstructionFunctionDao;
import com.fanglin.construction.po.ConstructionFunctionPO;
import com.fanglin.construction.service.ConstructionFunctionService;
import com.fanglin.construction.vo.ConstructionFunctionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

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

	@Override
	public List<ConstructionFunctionVO> pageConstructionFunction(Paging paging, List<Filter> filters) {

		List<ConstructionFunctionPO> constructionFunctionPOs = constructionFunctionDao.pageConstructionFunction(paging, filters);
		List<ConstructionFunctionVO> constructionFunctionVOs = new ArrayList<ConstructionFunctionVO>();

		for (ConstructionFunctionPO constructionFunctionPO : constructionFunctionPOs) {

			ConstructionFunctionVO constructionFunctionVO = new ConstructionFunctionVO();
			BeanUtil.copyPropertie(constructionFunctionPO, constructionFunctionVO);

			constructionFunctionVOs.add(constructionFunctionVO);
		}

		return constructionFunctionVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addConstructionFunction(ConstructionFunctionVO constructionFunctionVO) throws FLException {

		if (constructionFunctionDao.queryConstructionFunctionByName(constructionFunctionVO.getName()).size() > 0) {
			throw new FLException(120053, "工程功能已存在");
		}

		ConstructionFunctionPO constructionFunctionPO = new ConstructionFunctionPO();

		BeanUtil.copyPropertie(constructionFunctionVO, constructionFunctionPO);

		constructionFunctionDao.save(constructionFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateConstructionFunction(ConstructionFunctionVO constructionFunctionVO) throws FLException {

		ConstructionFunctionPO constructionFunctionPO = constructionFunctionDao.get(constructionFunctionVO.getCfid());

		if (constructionFunctionPO == null) {
			throw new FLException(120055, "工程功能不存在");
		}

		for (ConstructionFunctionPO namePO : constructionFunctionDao.queryConstructionFunctionByName(constructionFunctionVO.getName())) {
			if (namePO.getCfid() != constructionFunctionVO.getCfid().longValue()) {
				throw new FLException(120053, "工程功能已存在");
			}
		}

		BeanUtil.copyPropertie(constructionFunctionVO, constructionFunctionPO, Arrays.asList("cfid"));

		constructionFunctionDao.update(constructionFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteConstructionFunction(ConstructionFunctionVO constructionFunctionVO) throws FLException {

		if (constructionFunctionDao.countConstructionFunctionRightByCfid(constructionFunctionVO.getCfid()) > 0) {
			throw new FLException(120054, "工程功能已被引用,不可删除");
		}

		constructionFunctionDao.deleteById(constructionFunctionVO.getCfid());

		return 0;
	}

}
