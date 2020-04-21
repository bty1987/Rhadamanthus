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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
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
	
	@Autowired
	private DecorationService decorationService;
	
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
			constructIoninfoPO.setIsConfirmPricture(ConstructionInfoPO.COLUMN_STAY_SHORT);
		}

		BeanUtil.copyPropertie(constructionInfoVO, constructIoninfoPO);

		constructionInfoDao.saveOrUpdate(constructIoninfoPO);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmConstructionInfo(ConstructionInfoVO constructionInfoVO) throws FLException{

		ConstructionInfoPO constructIoninfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());
		
		if(constructIoninfoPO == null){
			throw new FLException(120020, "工程信息不存在");
		}

		constructIoninfoPO.setIsConfirmPricture(constructionInfoVO.getIsConfirmPricture());

		constructionInfoDao.update(constructIoninfoPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int sendConstructionInfoForConfirm(ConstructionInfoVO constructionInfoVO) throws FLException{
		
		ConstructionInfoPO constructIoninfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());
		
		if(constructIoninfoPO == null){
			throw new FLException(120020 , "工程信息不存在");
		}
		
		decorationService.sendMessage(constructIoninfoPO.getOrderId(), "装修单", String.format("装修单号:%s,放线图纸确认", constructIoninfoPO.getOrderId()), String.format("pages/drawLine/drawLine?orderId=%s", constructIoninfoPO.getOrderId()));
		
		return 0;
	}
	
	private DecorationVO decorationPOToVO(DecorationPO decorationPO) {

		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setSupervisor(new UserBaseVO());

		decorationPO.ptvcascade(decorationVO);

		return decorationVO;
	}

}
