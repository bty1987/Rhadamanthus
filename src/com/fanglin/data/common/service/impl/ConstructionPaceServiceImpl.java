package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionPaceDao;
import com.fanglin.data.common.service.ConstructionPaceService;
import com.fanglin.data.common.vo.ConstructionPaceVO;
import com.fanglin.data.po.ConstructionPacePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("ConstructionPaceService")
@Transactional(readOnly = true)
public class ConstructionPaceServiceImpl implements ConstructionPaceService {

	@Autowired
	private ConstructionPaceDao constructionPaceDao;

	@Override
	public void pageConstructionPace(Paging paging, List<Filter> filters, int company) throws FLException {

		List<ConstructionPacePO> constructionPacePOs = constructionPaceDao.pageConstructionPace(paging, filters, company);
		List<ConstructionPaceVO> constructionPaceVOs = new ArrayList<ConstructionPaceVO>();

		for (ConstructionPacePO constructionPacePO : constructionPacePOs) {

			ConstructionPaceVO constructionPaceVO = new ConstructionPaceVO();

			BeanUtil.copyProperties(constructionPacePO, constructionPaceVO);

			constructionPaceVOs.add(constructionPaceVO);
		}

		paging.setData(constructionPaceVOs);
	}

	@Override
	public ConstructionPaceVO queryConstructionPace(ConstructionPaceVO constructionPaceVO, int company) {

		ConstructionPacePO constructionPacePO = constructionPaceDao.queryConstructionPace(constructionPaceVO.getLowerArea(), company);

		if (constructionPacePO != null) constructionPacePO.ptv(constructionPaceVO);

		return constructionPaceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addConstructionPace(ConstructionPaceVO constructionPace, int company) {

		ConstructionPacePO constructionPacePO = new ConstructionPacePO();

		BeanUtil.copyProperties(constructionPace, constructionPacePO);

		constructionPacePO.setCompany(company);

		constructionPaceDao.save(constructionPacePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateConstructionPace(ConstructionPaceVO constructionPace) {

		ConstructionPacePO constructionPacePO = constructionPaceDao.get(constructionPace.getCpid());

		BeanUtil.copyProperties(constructionPace, constructionPacePO);

		constructionPaceDao.update(constructionPacePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteConstructionPace(ConstructionPaceVO constructionPace) {

		constructionPaceDao.deleteById(constructionPace.getCpid());

		return 0;
	}

}
