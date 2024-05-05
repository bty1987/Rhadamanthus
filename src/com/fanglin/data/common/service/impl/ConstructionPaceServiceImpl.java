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

@Service("constructionPaceService")
@Transactional(readOnly = true)
public class ConstructionPaceServiceImpl implements ConstructionPaceService {

	@Autowired
	private ConstructionPaceDao constructionPaceDao;

	@Override
	public void pageConstructionPace(Paging paging, List<Filter> filters) {

		List<ConstructionPacePO> constructionPacePOs = constructionPaceDao.pageConstructionPace(paging, filters);
		List<ConstructionPaceVO> constructionPaceVOs = new ArrayList<ConstructionPaceVO>();

		for (ConstructionPacePO constructionPacePO : constructionPacePOs) {
			ConstructionPaceVO constructionPaceVO = new ConstructionPaceVO();

			BeanUtil.copyProperties(constructionPacePO, constructionPaceVO);

			constructionPaceVOs.add(constructionPaceVO);
		}

		paging.setData(constructionPaceVOs);
	}

	@Override
	public List<ConstructionPaceVO> queryConstructionPace() {

		List<ConstructionPacePO> constructionPacePOs = constructionPaceDao.queryConstructionPace();
		List<ConstructionPaceVO> constructionPaceVOs = new ArrayList<ConstructionPaceVO>();

		for (ConstructionPacePO constructionPacePO : constructionPacePOs) {
			ConstructionPaceVO constructionPaceVO = new ConstructionPaceVO();

			BeanUtil.copyProperties(constructionPacePO, constructionPaceVO);

			constructionPaceVOs.add(constructionPaceVO);
		}

		return constructionPaceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionPace(ConstructionPaceVO constructionPaceVO) {

		ConstructionPacePO constructionPacePO = new ConstructionPacePO();

		BeanUtil.copyProperties(constructionPaceVO, constructionPacePO);

		constructionPaceDao.save(constructionPacePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionPace(ConstructionPaceVO constructionPace) throws FLException {

		ConstructionPacePO constructionPacePO = constructionPaceDao.get(constructionPace.getCpid());

		if (constructionPacePO == null) {
			throw new FLException(130123, "工程计划不存在");
		}

		BeanUtil.copyProperties(constructionPace, constructionPacePO);

		constructionPaceDao.update(constructionPacePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionPaceForStatus(ConstructionPaceVO constructionPace) throws FLException {

		ConstructionPacePO constructionPacePO = constructionPaceDao.get(constructionPace.getCpid());

		if (constructionPacePO == null) {
			throw new FLException(130123, "工程计划不存在");
		}

		constructionPacePO.setStatus(constructionPace.getStatus());

		constructionPaceDao.update(constructionPacePO);

	}

}
