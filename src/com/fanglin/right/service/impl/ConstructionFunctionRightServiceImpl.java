package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionFunctionDao;
import com.fanglin.construction.po.ConstructionFunctionPO;
import com.fanglin.construction.vo.ConstructionFunctionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.dao.ConstructionFunctionRightDao;
import com.fanglin.right.po.ConstructionFunctionRightPO;
import com.fanglin.right.service.ConstructionFunctionRightService;
import com.fanglin.right.vo.ConstructionFunctionRightVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;

@Service("constructionFunctionRightService")
@Transactional(readOnly = true)
public class ConstructionFunctionRightServiceImpl implements ConstructionFunctionRightService {

	@Autowired
	private ConstructionFunctionRightDao constructionFunctionRightDao;

	@Autowired
	private ConstructionFunctionDao constructionFunctionDao;

	@Override
	public List<ConstructionFunctionRightVO> queryConstructionFunctionRightByName(ConstructionFunctionRightVO constructionFunctionRightVO, int company) {

		List<ConstructionFunctionRightPO> constructionFunctionRightPOs = constructionFunctionRightDao.queryConstructionFunctionRightByName(constructionFunctionRightVO.getName(), company);
		List<ConstructionFunctionRightVO> constructionFunctionRightVOs = new ArrayList<ConstructionFunctionRightVO>();

		for (ConstructionFunctionRightPO constructionFunctionRightPO : constructionFunctionRightPOs) {

			constructionFunctionRightVO = new ConstructionFunctionRightVO(new ConstructionFunctionVO());

			BeanUtil.copyPropertie(constructionFunctionRightPO, constructionFunctionRightVO, Arrays.asList("constructionFunction"));
			BeanUtil.copyPropertie(constructionFunctionRightPO.getConstructionFunction(), constructionFunctionRightVO.getConstructionFunction());

			constructionFunctionRightVOs.add(constructionFunctionRightVO);
		}

		return constructionFunctionRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionFunctionRight(ConstructionFunctionRightVO constructionFunctionRightVO, List<Long> cfids, int company) {

		constructionFunctionRightDao.deleteConstructionFunctionRightByName(constructionFunctionRightVO.getName(), company);

		for (Long cfid : cfids) {
			ConstructionFunctionRightPO constructionFunctionRightPO = new ConstructionFunctionRightPO();
			ConstructionFunctionPO constructionFunctionPO = constructionFunctionDao.get(cfid);

			constructionFunctionRightPO.setName(constructionFunctionRightVO.getName());
			constructionFunctionRightPO.setConstructionFunction(constructionFunctionPO);
			constructionFunctionRightPO.setCompany(company);

			constructionFunctionRightDao.save(constructionFunctionRightPO);
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncConstructionFunctionRight(ConstructionFunctionRightVO constructionFunctionRightVO, List<String> companys, Integer company) throws FLException {

		List<Integer> cids = new ArrayList<Integer>();

		for (String cid : companys) {
			cids.add(CompanyServiceImpl.decode(cid));
		}

		constructionFunctionRightDao.deleteConstructionFunctionRight(constructionFunctionRightVO.getName(), cids);
		constructionFunctionRightDao.syncConstructionFunctionRight(constructionFunctionRightVO.getName(), cids, company);

		return 0;
	}

}
