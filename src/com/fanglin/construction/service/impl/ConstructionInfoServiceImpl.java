package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionInfoDao;

import com.fanglin.construction.po.ConstructionInfoDO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.service.ConstructionInfoService;
import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;

import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("ConstructionInfoService")
@Transactional(readOnly = true)
public class ConstructionInfoServiceImpl implements ConstructionInfoService {

	@Autowired
	private ConstructionInfoDao constructionInfoDao;
	
	@Override
	public void pageConstructionInfo(Paging paging, List<Filter> filters, Integer company) {
		List<ConstructionInfoDO> constructionInfoDOs = constructionInfoDao.pageConstructionInfo(paging, filters, company);
		List<ConstructionInfoVO> constructionVOs = new ArrayList<ConstructionInfoVO>();
		
		ConstructionInfoVO constructionInfoVO;

		for (ConstructionInfoDO constructionInfoDO : constructionInfoDOs) {
			
			constructionInfoVO = new ConstructionInfoVO(new DecorationVO());
			BeanUtil.copyProperties(constructionInfoDO, constructionInfoVO, Arrays.asList("decoration"));
			BeanUtil.copyProperties(decorationPOToVO(constructionInfoDO.getDecoration()), constructionInfoVO.getDecoration());
			
			constructionVOs.add(constructionInfoVO);
			
		}

		paging.setData(constructionVOs);
	}

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
	
	private DecorationVO decorationPOToVO(DecorationPO decorationPO) {

		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setSupervisor(new UserBaseVO());

		decorationPO.ptvcascade(decorationVO);

		return decorationVO;
	}

}
