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
import com.fanglin.decoration.vo.DecorationVO;
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
	public DecorationInfoVO queryDecorationInfoByOrderId(DecorationInfoVO decorationInfoVO) {

		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(decorationInfoVO.getOrderId());

		BeanUtil.copyPropertie(decorationInfoPO, decorationInfoVO);

		return decorationInfoVO;
	}

	@Override
	public DecorationInfoVO queryDecorationInfoForCustomer(DecorationInfoVO decorationInfoVO) {

		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(decorationInfoVO.getOrderId());

		BeanUtil.copyPropertie(decorationInfoPO, decorationInfoVO);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationInfoVO.getOrderId());

		if (decorationPO != null && decorationPO.getCustomer() != null) {
			decorationInfoVO.setCustomerPhone(decorationPO.getCustomer().getPhone());
		}

		return decorationInfoVO;
	}

	@Override
	public void sendDecorationInfoForConfirm(DecorationInfoVO decorationInfoVO) {

		String orderId = decorationInfoVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO.getSourceStatus() == decorationInfoVO.getSourceStatus()) return;

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT && decorationPO.getSourceStatus() == DecorationPO.STATUS_INITIA_INT) {
			decorationService.sendMessage(orderId, "装修单", "初稿方案请查收确认, 如有修改可以调整.", String.format("pages/construction/drawLine/drawLine?orderId=%s&type=1", orderId));
		}

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT && decorationPO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT) {
			decorationService.sendMessage(orderId, "装修单", "施工方案请查收确认, 已便安排放线进场.", String.format("pages/construction/drawLine/drawLine?orderId=%s&type=2", orderId));
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmDecorationInfo(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException {

		String orderId = decorationInfoVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		com.fanglin.customer.vo.DecorationVO cusDecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cusDecorationVO.setOrderId(orderId);
		cusDecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationService.queryDecoration(cusDecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

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

			messageService.sendMessage(designer.getUserId(), null, String.format("装修单: %s , 地址: %s , 合同设计方案客户已确认通过 , 持续关注客户服务及放线开工推进 .", orderId, houseAddr), MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		}

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT) {

			decorationPO.setSourceStatus(decorationInfoVO.getSourceStatus());
			decorationPO.setEdesignTime(DateUtil.getDateToTimestamp(new Date()));
			messageService.sendMessage(designer.getUserId(), null, String.format("装修单: %s , 地址: %s , 放线开工设计方案客户已确认通过 , 持续关注客户服务及对接排放线事项安排 .", orderId, houseAddr), MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		}

		decorationDao.update(decorationPO);
	}
}
