package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.dao.DecorationServiceDao;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.po.DecorationServicePO;
import com.fanglin.decoration.service.DecorationInfoService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("decorationInfoService")
@Transactional(readOnly = true)
public class DecorationInfoServiceImpl implements DecorationInfoService {

	@Autowired
	private DecorationInfoDao decorationInfoDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationServiceDao decorationServiceDao;

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private MessageService messageService;

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private WeChatAppService weChatAppService;

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
	@Transactional(rollbackFor = Exception.class)
	public void sendDecorationInfoForConfirm(DecorationInfoVO decorationInfoVO, String userId) {

		String orderId = decorationInfoVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO.getSourceStatus() == decorationInfoVO.getSourceStatus()) return;

		UserPO creater = userDao.queryUserByUserId(userId);

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT && decorationPO.getSourceStatus() == DecorationPO.STATUS_INITIA_INT) {
			decorationService.sendMessage(orderId, "装修单", "初稿方案请查收确认, 如有修改可以调整.", String.format("pages/construction/drawLine/drawLine?orderId=%s&type=1", orderId), creater);
		}

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT && decorationPO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT) {
			decorationService.sendMessage(orderId, "装修单", "施工方案请查收确认, 已便安排放线进场.", String.format("pages/construction/drawLine/drawLine?orderId=%s&type=2", orderId), creater);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmDecorationInfo(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		String orderId = decorationInfoVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			decorationVO.getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (decorationVO.getCustomer().getPhone() != null && !decorationPO.getCustomer().getPhone().equals(FormatUtil.encodePhone(decorationVO.getCustomer().getPhone()))) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cecorationVO.setOrderId(orderId);
		cecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationVO.getCustomer().getNo() != null && decorationService.queryDecoration(cecorationVO).getOrderId() == null) {
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
			decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_END_INT);
			decorationPO.setSourceStatus(DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT);
			decorationPO.setSdesignTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if ((decorationInfoVO.getSourceStatus() % 10) == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT) {

			decorationPO.setDesignStatus(decorationInfoVO.getSourceStatus());

			DecorationServicePO decorationServicePO = new DecorationServicePO();

			decorationServicePO.setName("设计方案确认");
			decorationServicePO.setOrderId(decorationPO.getOrderId());
			decorationServicePO.setStatus(DecorationServicePO.SERVICESTATUS_INIT_INT);
			decorationServicePO.setOperater(designer);
			decorationServicePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationServicePO.setComment(String.format("装修单: %s, 设计方案确认, %s", decorationPO.getOrderId(), decorationInfoVO.getSourceStatus()));

			ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

			int daynum = 1;

			if (decorationInfoVO.getSourceStatus() == DecorationPO.DESIGN_STATUS_MINI_INT) daynum = daynum + 3;

			if (decorationInfoVO.getSourceStatus() == DecorationPO.DESIGN_STATUS_MORE_INT && constructionInfoPO != null) {
				daynum = daynum + Arith.div(constructionInfoPO.getDesignPeriod(), 300, Arith.ROUND_FLOOR) / 1000;
			}

			if (constructionInfoPO != null) {

				Timestamp designTime = constructionInfoPO.getDesignTime();

				if (designTime == null) {
					designTime = DateUtil.getDateToTimestamp(new Date());
				}

				if (decorationInfoVO.getSourceStatus() == DecorationPO.DESIGN_STATUS_MINI_INT) {
					constructionInfoPO.setDesignTime(DateUtil.getDateToTimestamp(DateUtil.plusDay(new Date(designTime.getTime()), 3)));
				} else if (decorationInfoVO.getSourceStatus() == DecorationPO.DESIGN_STATUS_MORE_INT && constructionInfoPO.getDesignPeriod() != 0) {
					Date newDesignTime = new Date(designTime.getTime() + Arith.mul(constructionInfoPO.getDesignPeriod(), 30) * 60 * 1000);
					constructionInfoPO.setDesignTime(DateUtil.getDateToTimestamp(newDesignTime));
				}
				constructionInfoDao.update(constructionInfoPO);
			}

			// 设置计划时间：当前时间 + 4天
			decorationServicePO.setPlanTime(DateUtil.getDateToTimestamp(DateUtil.plusDay(new Date(), daynum)));

			decorationServiceDao.save(decorationServicePO);

			messageService.sendMessage(designer.getUserId(), null, String.format("装修单: %s , 地址: %s , 合同设计方案客户已确认通过 , 持续关注客户服务及放线开工推进 .", orderId, houseAddr), MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		}

		if (decorationInfoVO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT) {

			decorationPO.setSourceStatus(DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT);
			decorationPO.setEdesignTime(DateUtil.getDateToTimestamp(new Date()));

			messageService.sendMessage(designer.getUserId(), null, String.format("装修单: %s , 地址: %s , 放线开工设计方案客户已确认通过 , 持续关注客户服务及对接排放线事项安排 .", orderId, houseAddr), MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		}

		decorationDao.update(decorationPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int referDecorationInfo(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		DecorationPO referationPO = decorationDao.queryDecorationByOrderId(decorationInfoVO.getReferOrderId());

		if (referationPO == null) {
			throw new FLException(140086, "推荐订单不存在");
		}

		referationPO = null;// 如果不初始化 当customerChancePO，customerOriginPO，decorationInfoPO都为空 不会产生数据

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(decorationVO.getOrderId());

		if (customerChancePO != null) {
			referationPO = decorationDao.queryDecorationByOrderId(customerChancePO.getSource().getReferOrderId());
		}

		if (referationPO == null && customerChancePO != null) {

			CustomerSourcePO customerSourcePO = customerChancePO.getSource();

			if (customerSourcePO != null) {

				customerSourcePO.setReferOrderId(decorationInfoVO.getReferOrderId());
				customerSourceDao.update(customerSourcePO);

				return 0;
			}
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.queryCustomerOrigin(decorationVO.getOrderId());

		if (customerOriginPO != null) {
			referationPO = decorationDao.queryDecorationByOrderId(customerOriginPO.getReferOrderId());
		}

		if (referationPO == null && customerOriginPO != null) {

			customerOriginPO.setReferOrderId(decorationInfoVO.getReferOrderId());

			customerOriginDao.update(customerOriginPO);

			return 0;
		}

		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(decorationVO.getOrderId());

		if (decorationInfoPO == null) {
			decorationInfoPO = new DecorationInfoPO(decorationVO.getOrderId());
		}

		decorationInfoPO.setReferOrderId(decorationInfoVO.getReferOrderId());

		decorationInfoDao.saveOrUpdate(decorationInfoPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteReferDecorationInfo(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		DecorationPO referationPO = decorationDao.queryDecorationByOrderId(decorationInfoVO.getReferOrderId());

		if (referationPO == null) {
			throw new FLException(140086, "推荐订单不存在");
		}

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(decorationVO.getOrderId());

		if (customerChancePO != null) {
			DecorationPO ccReferationPO = decorationDao.queryDecorationByOrderId(customerChancePO.getSource().getReferOrderId());

			if (ccReferationPO != null && customerChancePO != null && ccReferationPO.getOrderId().equals(decorationInfoVO.getReferOrderId())) {

				customerChancePO.getSource().setReferOrderId(null);
				customerChanceDao.update(customerChancePO);

				return 0;
			}
		}

		CustomerChancePO customerChancePO1 = customerChanceDao.queryCustomerChance(decorationInfoVO.getReferOrderId());

		if (customerChancePO1 != null) {
			DecorationPO ccReferationPO = decorationDao.queryDecorationByOrderId(customerChancePO1.getSource().getReferOrderId());

			if (ccReferationPO != null && customerChancePO1 != null && ccReferationPO.getOrderId().equals(decorationVO.getOrderId())) {

				customerChancePO1.getSource().setReferOrderId(null);
				customerChanceDao.update(customerChancePO1);

				return 0;
			}
		}

		CustomerOriginPO customerOriginPO = customerOriginDao.queryCustomerOrigin(decorationVO.getOrderId());

		if (customerOriginPO != null) {
			DecorationPO coReferationPO = decorationDao.queryDecorationByOrderId(customerOriginPO.getReferOrderId());

			if (coReferationPO != null && customerOriginPO != null && coReferationPO.getOrderId().equals(decorationInfoVO.getReferOrderId())) {

				customerOriginPO.setReferOrderId(null);

				customerOriginDao.update(customerOriginPO);

				return 0;
			}
		}

		CustomerOriginPO customerOriginPO1 = customerOriginDao.queryCustomerOrigin(decorationInfoVO.getReferOrderId());

		if (customerOriginPO1 != null) {
			DecorationPO coReferationPO = decorationDao.queryDecorationByOrderId(customerOriginPO1.getReferOrderId());

			if (coReferationPO != null && customerOriginPO1 != null && coReferationPO.getOrderId().equals(decorationVO.getOrderId())) {

				customerOriginPO1.setReferOrderId(null);

				customerOriginDao.update(customerOriginPO1);

				return 0;
			}
		}

		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(decorationVO.getOrderId());

		if (decorationInfoPO != null && decorationInfoPO.getReferOrderId() != null && decorationInfoPO.getReferOrderId().equals(decorationInfoVO.getReferOrderId())) {
			decorationInfoPO.setReferOrderId(null);

			decorationInfoDao.update(decorationInfoPO);

			return 0;
		}

		DecorationInfoPO decorationInfoPO1 = decorationInfoDao.queryDecorationInfoByOrderId(decorationInfoVO.getReferOrderId());

		if (decorationInfoPO1 != null && decorationInfoPO1.getReferOrderId() != null && decorationInfoPO1.getReferOrderId().equals(decorationVO.getOrderId())) {
			decorationInfoPO1.setReferOrderId(null);

			decorationInfoDao.update(decorationInfoPO1);

			return 0;
		}

		return 0;
	}
}
