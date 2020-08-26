package com.fanglin.decoration.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationInfoService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.po.UserPO;
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

	@Autowired
	private MessageService messageService;

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

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO.getSourceStatus() == decorationInfoVO.getSourceStatus())
			return;

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT && decorationPO.getSourceStatus() == DecorationPO.STATUS_INITIA_INT) {
			decorationService.sendMessage(orderId, "装修单", String.format("装修单号: %s, 您的合同设计方案已完成 , 请及时查收 , 当前无变更请点确认 , 代表您对设计方案满意. 放线开工前 , 如有修改可随时联系设计师调整 . 感谢您的配合 , 祝生活愉快 .", orderId), String.format("pages/drawLine/drawLine?orderId=%s&type=1", orderId));
		}

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT && decorationPO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT) {
			decorationService.sendMessage(orderId, "装修单", String.format("装修单号: %s, 为使您的工程进度有序进展 , 请您对预计放线开工的方案及时查收 , 无变更请点确认 , 代表可按该方案为您准备放线进场事项 . 感谢您的配合 , 祝您生活愉快 .", orderId), String.format("pages/drawLine/drawLine?orderId=%s&type=2", orderId));
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmDecorationInfo(DecorationInfoVO decorationInfoVO, String userId) throws FLException {

		String orderId = decorationInfoVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO.getSourceStatus() >= decorationInfoVO.getSourceStatus()) {
			throw new FLException(140074, "装修确认不可操作");
		}

		if (decorationPO.getSourceStatus() == DecorationPO.STATUS_INITIA_INT && decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT) {
			throw new FLException(140074, "装修确认不可操作");
		}

		UserPO designer = decorationPO.getDesigner();
		HousePO housePO = decorationPO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String houseAddr = String.format("%s %s", villagePO.getName(), housePO.getHouseNumber());

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT) {

			decorationPO.setSourceStatus(decorationInfoVO.getSourceStatus());
			decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_END_INT);
			decorationPO.setSdesignTime(DateUtil.getDateToTimestamp(new Date()));

			messageService.sendMessage(designer.getUserId(), userId, String.format("装修单: %s , 地址: %s , 合同设计方案客户已确认通过 , 持续关注客户服务及放线开工推进 .", orderId, houseAddr), MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		}

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT) {

			decorationPO.setSourceStatus(decorationInfoVO.getSourceStatus());
			decorationPO.setEdesignTime(DateUtil.getDateToTimestamp(new Date()));

			messageService.sendMessage(designer.getUserId(), userId, String.format("装修单: %s , 地址: %s , 放线开工设计方案客户已确认通过 , 持续关注客户服务及对接排放线事项安排 .", orderId, houseAddr), MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		}

		decorationDao.update(decorationPO);

	}
}
