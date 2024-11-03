package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionPeriodDao;
import com.fanglin.data.common.service.ConstructionPeriodService;
import com.fanglin.data.common.vo.ConstructionPeriodVO;
import com.fanglin.data.po.ConstructionPeriodPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("ConstructionPeriodService")
@Transactional(readOnly = true)
public class ConstructionPeriodServiceImpl implements ConstructionPeriodService {

	@Autowired
	private ConstructionPeriodDao constructionPeriodDao;

	@Override
	public void pageConstructionPeriod(Paging paging, List<Filter> filters, int queryCompany) throws FLException {

		List<ConstructionPeriodPO> constructionPeriodPOs = constructionPeriodDao.pageConstructionPeriod(paging, filters);
		List<ConstructionPeriodVO> constructionPeriodVOs = new ArrayList<ConstructionPeriodVO>();

		for (ConstructionPeriodPO constructionPeriodPO : constructionPeriodPOs) {

			ConstructionPeriodVO constructionPeriodVO = new ConstructionPeriodVO();

			BeanUtil.copyProperties(constructionPeriodPO, constructionPeriodVO);

			constructionPeriodVOs.add(constructionPeriodVO);
		}

		paging.setData(constructionPeriodVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addConstructionPeriod(ConstructionPeriodVO constructionPeriod, int company) {

		ConstructionPeriodPO constructionPeriodPO = new ConstructionPeriodPO();

		BeanUtil.copyProperties(constructionPeriod, constructionPeriodPO);

		constructionPeriodPO.setCompany(company);

		constructionPeriodDao.save(constructionPeriodPO);

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateConstructionPeriod(ConstructionPeriodVO constructionPeriod) {

		ConstructionPeriodPO constructionPeriodPO = constructionPeriodDao.get(constructionPeriod.getCpid());

		BeanUtil.copyProperties(constructionPeriod, constructionPeriodPO);

		constructionPeriodDao.update(constructionPeriodPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteConstructionPeriod(ConstructionPeriodVO constructionPeriod) {

		constructionPeriodDao.deleteById(constructionPeriod.getCpid());

		return 0;
	}

}
