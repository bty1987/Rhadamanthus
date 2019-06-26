package com.fanglin.construction.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.construction.dao.ConstructionInfoDao;

import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.service.ConstructionInfoService;
import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.utils.BeanUtil;

@Service("ConstructionInfoService")
@Transactional(readOnly = true)
public class ConstructionInfoServiceImpl implements ConstructionInfoService {

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Override
	public ConstructionInfoVO queryConstructionInfo(ConstructionInfoVO constructionInfoVO) {

		ConstructionInfoPO constructIoninfoPO = constructionInfoDao.queryConstructionInfo(constructionInfoVO.getCid());

		BeanUtil.copyPropertie(constructIoninfoPO, constructionInfoVO);

		return constructionInfoVO;
	}

	@Override
	public ConstructionInfoVO queryConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO) {

		ConstructionInfoPO constructIoninfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());

		BeanUtil.copyPropertie(constructIoninfoPO, constructionInfoVO);

		return constructionInfoVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionInfo(ConstructionInfoVO constructionInfoVO) {

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfo(constructionInfoVO.getCid());

		if (constructionInfoPO == null) {
			constructionInfoPO = new ConstructionInfoPO();
		}

		BeanUtil.copyPropertie(constructionInfoVO, constructionInfoPO);

		constructionInfoDao.saveOrUpdate(constructionInfoPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO) {

		ConstructionInfoPO constructIoninfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());

		if (constructIoninfoPO == null) {
			constructIoninfoPO = new ConstructionInfoPO();
		}

		BeanUtil.copyPropertie(constructionInfoVO, constructIoninfoPO);

		constructionInfoDao.saveOrUpdate(constructIoninfoPO);
	}

}
