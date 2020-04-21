package com.fanglin.decoration.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationInfoService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationInfoService")
@Transactional(readOnly = true)
public class DecorationInfoServiceImpl implements DecorationInfoService {

	@Autowired
	private DecorationInfoDao decorationInfoDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationService decorationService;

	@Override
	public DecorationInfoVO queryDecorationInfoByOrderId(String orderId) {

		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(orderId);
		DecorationInfoVO decorationInfoVO = new DecorationInfoVO();

		if (decorationInfoPO == null) {
			decorationInfoPO = new DecorationInfoPO();
		}

		BeanUtil.copyPropertie(decorationInfoPO, decorationInfoVO);

		return decorationInfoVO;
	}

	@Override
	public void sendDecorationInfoForConfirm(DecorationInfoVO decorationInfoVO) {

		String orderId = decorationInfoVO.getOrderId();

		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(orderId);

		if (decorationInfoPO.getIsConfirmPricture() == DecorationInfoPO.STATUS_COFIRM_INT && decorationInfoPO.getIsConfirmDesign() == DecorationInfoPO.STATUS_COFIRM_INT)
			return;

		if (decorationInfoVO.getIsConfirmPricture() != null && decorationInfoPO.getIsConfirmPricture() == DecorationInfoPO.STATUS_INIT_INT) {
			decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s,放线图纸确认", orderId), String.format("pages/drawLine/drawLine?orderId=%s&type=1", orderId));
		}

		if (decorationInfoVO.getIsConfirmDesign() != null && decorationInfoPO.getIsConfirmDesign() == DecorationInfoPO.STATUS_INIT_INT) {
			decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s,设计确认", orderId), String.format("pages/drawLine/drawLine?orderId=%s&type=2", orderId));
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmDecorationInfo(DecorationInfoVO decorationInfoVO) {

		String orderId = decorationInfoVO.getOrderId();

		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(orderId);

		if (decorationInfoVO.getIsConfirmPricture() != null && decorationInfoPO.getIsConfirmPricture() == DecorationInfoPO.STATUS_INIT_INT) {
			decorationInfoPO.setIsConfirmPricture(DecorationInfoPO.STATUS_COFIRM_INT);
		}

		if (decorationInfoVO.getIsConfirmDesign() != null && decorationInfoPO.getIsConfirmDesign() == DecorationInfoPO.STATUS_INIT_INT) {

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

			decorationInfoPO.setIsConfirmDesign(DecorationInfoPO.STATUS_COFIRM_INT);
			decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_END_INT);
			decorationPO.setEdesignTime(DateUtil.getDateToTimestamp(new Date()));

			decorationDao.update(decorationPO);
		}

		decorationInfoDao.update(decorationInfoPO);
	}

}
